const snapFilterService = require('../services/snap-filter.service');
const imageService = require('../services/image.service');
const viewService = require('../services/view.service');

// ══════════════════════════════════════════════════════
//                    ROUTES PUBLIQUES
// ══════════════════════════════════════════════════════

/**
 * GET /api/snapfilters/public
 */
exports.getActiveFilters = async (req, res, next) => {
  try {
    const filters = await snapFilterService.getActive();

    return res.status(200).json({
      status: 'success',
      data: filters
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════
//                    ROUTES ADMIN
// ══════════════════════════════════════════════════════

/**
 * GET /api/snapfilters
 */
exports.getAll = async (req, res, next) => {
  try {
    const filters = await snapFilterService.getAll();

    return res.status(200).json({
      status: 'success',
      data: filters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/snapfilters/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const filter = await snapFilterService.getById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: filter
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/snapfilters
 */
exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;

    let imageUrl = null;

    // Upload de l'image si fournie
    if (file) {
      imageUrl = await imageService.uploadFilterImage(file, 'snapfilters');
    }

    const filter = await snapFilterService.create({
      ...data,
      imageUrl
    });

    // Charger en RAM si actif
    if (filter.isActive) {
      await viewService.loadFilter(filter.id);
    }

    return res.status(201).json({
      status: 'success',
      data: filter,
      message: 'Filtre créé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/snapfilters/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    let imageUrl = null;

    // Upload nouvelle image si fournie
    if (file) {
      // Supprimer l'ancienne image
      const oldFilter = await snapFilterService.getById(id);
      if (oldFilter.imageUrl) {
        await imageService.deleteImage(oldFilter.imageUrl);
      }

      // Upload la nouvelle
      imageUrl = await imageService.uploadFilterImage(file, 'snapfilters');
    }

    const filter = await snapFilterService.update(id, data, imageUrl);

    // Gérer le cache RAM
    if (filter.isActive) {
      await viewService.loadFilter(filter.id);
    } else {
      viewService.unloadFilter(filter.id);
    }

    return res.status(200).json({
      status: 'success',
      data: filter,
      message: 'Filtre mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/snapfilters/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Récupérer le filtre pour supprimer l'image
    const filter = await snapFilterService.getById(id);

    // Supprimer l'image de Cloudinary
    if (filter.imageUrl) {
      await imageService.deleteImage(filter.imageUrl);
    }

    // Supprimer le filtre de la DB
    await snapFilterService.delete(id);

    // Retirer de la RAM
    viewService.unloadFilter(id);

    return res.status(200).json({
      status: 'success',
      message: 'Filtre supprimé'
    });
  } catch (error) {
    next(error);
  }
};