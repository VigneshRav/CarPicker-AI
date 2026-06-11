const recommendationService = require('../services/recommendationService');

/**
 * Controller mapping for POST /api/recommend
 */
exports.getRecommendations = (req, res) => {
  try {
    const {
      budget,
      fuelType,
      familySize,
      usage,
      safetyPriority,
      mileagePriority
    } = req.body;

    // 1. Validation checks
    const errors = [];

    // Budget Validation
    if (budget === undefined || budget === null) {
      errors.push('Budget is required.');
    } else if (typeof budget !== 'number' || budget <= 0) {
      errors.push('Budget must be a positive number.');
    }

    // Fuel Type Validation
    const validFuels = ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'any'];
    if (!fuelType) {
      errors.push('Fuel preference is required.');
    } else if (typeof fuelType !== 'string' || !validFuels.includes(fuelType.toLowerCase())) {
      errors.push(`Fuel preference must be one of: ${validFuels.join(', ')}.`);
    }

    // Family Size Validation
    if (familySize === undefined || familySize === null) {
      errors.push('Family size is required.');
    } else {
      const parsedSize = Number(familySize);
      if (!Number.isInteger(parsedSize) || parsedSize <= 0) {
        errors.push('Family size must be a positive integer.');
      }
    }

    // Driving Usage Validation
    const validUsages = ['daily-commute', 'family-trips', 'off-roading', 'highway-cruising'];
    if (!usage) {
      errors.push('Driving usage preference is required.');
    } else if (typeof usage !== 'string' || !validUsages.includes(usage.toLowerCase())) {
      errors.push(`Driving usage must be one of: ${validUsages.join(', ')}.`);
    }

    // Priorities Validation
    const validPriorities = ['low', 'medium', 'high'];
    
    if (!safetyPriority) {
      errors.push('Safety priority is required.');
    } else if (typeof safetyPriority !== 'string' || !validPriorities.includes(safetyPriority.toLowerCase())) {
      errors.push(`Safety priority must be one of: ${validPriorities.join(', ')}.`);
    }

    if (!mileagePriority) {
      errors.push('Mileage priority is required.');
    } else if (typeof mileagePriority !== 'string' || !validPriorities.includes(mileagePriority.toLowerCase())) {
      errors.push(`Mileage priority must be one of: ${validPriorities.join(', ')}.`);
    }

    // Return 400 Bad Request if validation failed
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    // 2. Call service layer
    const recommendations = recommendationService.getRecommendations({
      budget: Number(budget),
      fuelType,
      familySize: Number(familySize),
      usage,
      safetyPriority,
      mileagePriority
    });

    // 3. Return response
    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Controller Error in getRecommendations:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal server error occurred while processing recommendations.'
    });
  }
};
