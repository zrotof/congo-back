const challengeService = require('../services/challenge.service');
const imageService = require('../services/image.service');
const viewService = require('../services/view.service');
const { models } = require('../models');

// ══════════════════════════════════════════════════════
//                    ROUTES PUBLIQUES
// ══════════════════════════════════════════════════════

exports.getActiveChallenge = async (req, res, next) => {
  try {
    const challenge = await models.Challenge.findOne({
      where: { isActive: true },
      attributes: [
        'id',
        'title',
        'contextText',
        'blurredImageUrl',
        'targetViews',
        'currentViews'
      ]
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun challenge actif'
      });
    }

    const isRevealed = challenge.currentViews >= challenge.targetViews;

    let imageUrl = null;
    if (isRevealed) {
      const fullChallenge = await models.Challenge.findByPk(challenge.id);
      imageUrl = fullChallenge.imageUrl;
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...challenge.toJSON(),
        imageUrl,
        isRevealed,
        progress: Math.min((challenge.currentViews / challenge.targetViews) * 100, 100)
      }
    });

  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════
//                    ROUTES ADMIN
// ══════════════════════════════════════════════════════

exports.getAll = async (req, res, next) => {
  try {
    const challenges = await challengeService.getAll();
    return res.status(200).json({
      status: 'success',
      data: challenges
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const challenge = await challengeService.getById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: challenge
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;

    let imageUrl = null;
    let blurredImageUrl = null;

    if (file) {
      const urls = await imageService.uploadChallengeImage(file, 'reveal_challenges');
      imageUrl = urls.originalUrl;
      blurredImageUrl = urls.blurredUrl;
    }

    const challenge = await challengeService.create({
      ...data,
      imageUrl,
      blurredImageUrl
    });

    return res.status(201).json({
      status: 'success',
      data: challenge,
      message: 'Challenge créé'
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    let imageUrls = null;

    if (file) {
      imageUrls = await imageService.uploadChallengeImage(file, 'reveal_challenges');
    }

    const challenge = await challengeService.update(id, data, imageUrls);

    if (challenge.isActive) {
      await viewService.loadChallenge(challenge.id);
    }

    return res.status(200).json({
      status: 'success',
      data: challenge,
      message: 'Challenge mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { id } = req.params;

    viewService.unloadChallenge();

    const challenge = await challengeService.activate(id);

    await viewService.loadChallenge(id);

    return res.status(200).json({
      status: 'success',
      data: challenge,
      message: 'Challenge activé'
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await challengeService.deactivate(id);

    viewService.unloadChallenge();

    return res.status(200).json({
      status: 'success',
      data: challenge,
      message: 'Challenge désactivé'
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await challengeService.getById(id);

    if (challenge.imageUrl) {
      await imageService.deleteImage(challenge.imageUrl);
    }
    if (challenge.blurredImageUrl) {
      await imageService.deleteImage(challenge.blurredImageUrl);
    }

    await challengeService.delete(id);

    if (challenge.isActive) {
      viewService.unloadChallenge();
    }

    return res.status(200).json({
      status: 'success',
      message: 'Challenge supprimé'
    });
  } catch (error) {
    next(error);
  }
};