const filterService = require('../services/filter.service'); // ✅ Renommé
const filterCounterService = require('../services/filter-counter.service');
const imageService = require('../services/image.service');

// ══════════════════════════════════════════════════════
//                    PUBLIQUE
// ══════════════════════════════════════════════════════

exports.getActiveFilters = async (req, res, next) => {
  try {
    const filters = await filterService.getActive();
    res.status(200).json({ status: 'success', data: filters, message: 'Filtres actifs' });
  } catch (error) { next(error); }
};

// ══════════════════════════════════════════════════════
//                    ADMIN
// ══════════════════════════════════════════════════════

exports.getAll = async (req, res, next) => {
  try {
    const filters = await filterService.getAll();
    res.status(200).json({ status: 'success', data: filters, message: 'Liste filtres' });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const filter = await filterService.getById(req.params.id);
    res.status(200).json({ status: 'success', data: filter, message: 'Filtre récupéré' });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const file = req.file;
    let imageUrl = null;

    if (file) {
      imageUrl = await imageService.uploadFilterImage(file, 'filters'); // ✅ Folder renommé
    }

    const filter = await filterService.create({ ...req.body, imageUrl });

    // Charger en RAM si actif
    if (filter.isActive) {
      await filterCounterService.load(filter.id);
    }

    res.status(201).json({ status: 'success', data: filter, message: 'Filtre créé' });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const file = req.file;
    let imageUrl = null;

    if (file) {
      const old = await filterService.getById(req.params.id);
      if (old.imageUrl) await imageService.deleteImage(old.imageUrl);
      
      imageUrl = await imageService.uploadFilterImage(file, 'filters');
    }

    // Update (gère aussi l'activation/désactivation)
    const filter = await filterService.update(req.params.id, req.body, imageUrl);

    // Mise à jour de la RAM
    if (filter.isActive) {
      await filterCounterService.load(filter.id);
    } else {
      filterCounterService.unload(filter.id);
    }

    res.status(200).json({ status: 'success', data: filter, message: 'Filtre mis à jour' });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const filter = await filterService.delete(req.params.id);
    
    if (filter.imageUrl) await imageService.deleteImage(filter.imageUrl);
    filterCounterService.unload(filter.id);

    res.status(200).json({ status: 'success', data: null, message: 'Filtre supprimé' });
  } catch (error) { next(error); }
};