const challengeService = require('../services/challenge.service');
const imageService = require('../services/image.service');
const challengeCounterService = require('../services/challenge-counter.service');

// ══════════════════════════════════════════════════════
//                    PUBLIQUE
// ══════════════════════════════════════════════════════

exports.getActiveChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeService.getActive();

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        data: null,
        message: 'Aucun challenge actif'
      });
    }

    const data = challenge.toJSON();
    const isRevealed = data.currentViews >= data.targetViews;

    return res.status(200).json({
      status: 'success',
      data: {
        ...data,
        imageUrl: isRevealed ? data.imageUrl : null,
        isRevealed,
        progress: Math.min((data.currentViews / data.targetViews) * 100, 100)
      },
      message: 'Challenge actif récupéré'
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════
//                    ADMIN
// ══════════════════════════════════════════════════════

exports.getAll = async (req, res, next) => {
  try {
    const challenges = await challengeService.getAll();
    res.status(200).json({
      status: 'success',
      data: challenges,
      message: 'Liste des challenges récupérée'
    });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const challenge = await challengeService.getById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: challenge,
      message: 'Challenge récupéré'
    });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const file = req.file;
    let urls = null;

    if (file) {
      urls = await imageService.uploadChallengeImage(file, 'reveal_challenges');
    }

    const challenge = await challengeService.create({
      ...req.body,
      imageUrl: urls?.originalUrl,
      blurredImageUrl: urls?.blurredUrl
    });

    res.status(201).json({
      status: 'success',
      data: challenge,
      message: 'Challenge créé avec succès'
    });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const file = req.file;
    let urls = null;

    if (file) {
      urls = await imageService.uploadChallengeImage(file, 'reveal_challenges');
    }

    const challenge = await challengeService.update(req.params.id, req.body, urls);

    // Gestion RAM
    if (challenge.isActive) {
      // Si activé : Charger
      challengeCounterService.unload(); // Vider l'ancien actif (sécurité)
      await challengeCounterService.load(challenge.id);
    } else {
      // Si désactivé : Décharger
      challengeCounterService.unload();
    }

    res.status(200).json({ status: 'success', data: challenge, message: 'Challenge mis à jour' });
  } catch (error) { next(error); }
};


exports.remove = async (req, res, next) => {
  try {
    const challenge = await challengeService.delete(req.params.id);

    if (challenge.imageUrl) await imageService.deleteImage(challenge.imageUrl);
    if (challenge.blurredImageUrl) await imageService.deleteImage(challenge.blurredImageUrl);

    if (challenge.isActive) challengeCounterService.unload();

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Challenge supprimé avec succès'
    });
  } catch (error) { next(error); }
};