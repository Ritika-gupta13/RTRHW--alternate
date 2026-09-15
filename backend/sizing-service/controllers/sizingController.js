const {
  calculateHarvestedWater,
  calculateSystemSizing,
  calculateItemizedCosts
} = require('../services/sizingEngine');

exports.calculateSizing = (req, res) => {
  try {
    const { roofAreaSqM, annualRainfallMm, roofMaterial, dryDays } = req.body;

    if (!roofAreaSqM || !annualRainfallMm) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: roofAreaSqM and annualRainfallMm are required.'
      });
    }

    const area = Number(roofAreaSqM);
    const rainfall = Number(annualRainfallMm);

    const annualWaterLiters = calculateHarvestedWater(area, rainfall, roofMaterial);
    const sizing = calculateSystemSizing(area, annualWaterLiters, dryDays ? Number(dryDays) : 45);
    const costEstimation = calculateItemizedCosts(sizing);

    return res.status(200).json({
      success: true,
      data: {
        hydrology: {
          roofAreaSqM: area,
          annualRainfallMm: rainfall,
          roofMaterial: roofMaterial || 'concrete',
          annualHarvestedWaterLiters: annualWaterLiters
        },
        sizing,
        costEstimation
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error processing hydrological calculations.',
      error: error.message
    });
  }
};