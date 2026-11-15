const Specialty = require('../models/Specialty');

// @desc    Get all specialties
// @route   GET /api/specialties
// @access  Public
exports.getAllSpecialties = async (req, res, next) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: specialties.length,
      data: specialties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specialty by ID
// @route   GET /api/specialties/:id
// @access  Public
exports.getSpecialtyById = async (req, res, next) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: specialty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new specialty
// @route   POST /api/specialties
// @access  Private (Admin)
exports.createSpecialty = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide specialty name.'
      });
    }
    
    const specialty = await Specialty.create({
      name,
      description
    });
    
    res.status(201).json({
      success: true,
      data: specialty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update specialty
// @route   PUT /api/specialties/:id
// @access  Private (Admin)
exports.updateSpecialty = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    
    const specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: specialty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete specialty
// @route   DELETE /api/specialties/:id
// @access  Private (Admin)
exports.deleteSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found.'
      });
    }
    
    await specialty.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Specialty deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};



