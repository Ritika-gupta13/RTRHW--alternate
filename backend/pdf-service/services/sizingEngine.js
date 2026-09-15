/**
 * Hydrological Math & Sizing Engine
 * Member 2 Core Service
 */

const RUNOFF_COEFFICIENTS = {
  concrete: 0.85,
  tiles: 0.85,
  metal: 0.90,
  asphalt: 0.75,
  default: 0.80
};

const UNIT_PRICES = {
  pvcPipePerMeter: 250,        // ₹250 / meter
  filterUnit: 4500,            // ₹4,500 / unit
  tankPerLiter: 7.5,           // ₹7.5 / Liter capacity
  excavationPerCubicMeter: 600,// ₹600 / m³
  laborFlatFee: 3500           // ₹3,500 base labor
};

// Formula: Harvested Water (L/yr) = Roof Area * Annual Rainfall * Runoff Coeff * Filter Efficiency
function calculateHarvestedWater(roofAreaSqM, annualRainfallMm, roofMaterial = 'concrete', filterEfficiency = 0.90) {
  const C = RUNOFF_COEFFICIENTS[roofMaterial.toLowerCase()] || RUNOFF_COEFFICIENTS.default;
  const annualWaterLiters = roofAreaSqM * annualRainfallMm * C * filterEfficiency;
  return Math.round(annualWaterLiters);
}

// Sizing algorithms for storage tank, downpipes, gutters, and recharge pit
function calculateSystemSizing(roofAreaSqM, annualWaterLiters, dryDays = 45) {
  const dailyYield = annualWaterLiters / 365;
  
  // Storage Tank: Sized for dry spell demand up to 20% total capacity
  const optimalTankCapacityLiters = Math.min(
    Math.round(dailyYield * dryDays),
    Math.round(annualWaterLiters * 0.20)
  );

  // Gutter & Downpipe Sizing: 1 cm² downpipe area per 1 m² roof area
  const requiredDownpipeAreaSqCm = roofAreaSqM * 1.0;
  const downpipeRadiusCm = Math.sqrt(requiredDownpipeAreaSqCm / Math.PI);
  const downpipeDiameterMm = Math.max(75, Math.ceil((downpipeRadiusCm * 2 * 10) / 5) * 5);
  
  const estimatedGutterLengthM = Math.round(Math.sqrt(roofAreaSqM) * 4);
  const estimatedDownpipeLengthM = 6;

  // Recharge Pit Sizing (Length x Width x Depth in meters)
  const surgeVolumeCubicMeters = (roofAreaSqM * 0.05 * 0.85) / 1000;
  const pitDepthM = 2.0;
  const pitWidthM = 1.5;
  const pitLengthM = parseFloat((surgeVolumeCubicMeters / (pitDepthM * pitWidthM)).toFixed(2));

  return {
    optimalTankCapacityLiters,
    gutterLengthMeters: estimatedGutterLengthM,
    downpipeDiameterMm,
    downpipeLengthMeters: estimatedDownpipeLengthM,
    rechargePit: {
      lengthMeters: Math.max(1.2, pitLengthM),
      widthMeters: pitWidthM,
      depthMeters: pitDepthM,
      volumeCubicMeters: parseFloat((Math.max(1.2, pitLengthM) * pitWidthM * pitDepthM).toFixed(2))
    }
  };
}

// Pricing engine for material and labor costs
function calculateItemizedCosts(sizingResults) {
  const pvcCost = (sizingResults.gutterLengthMeters + sizingResults.downpipeLengthMeters) * UNIT_PRICES.pvcPipePerMeter;
  const filterCost = UNIT_PRICES.filterUnit;
  const tankCost = sizingResults.optimalTankCapacityLiters * UNIT_PRICES.tankPerLiter;
  const excavationCost = sizingResults.rechargePit.volumeCubicMeters * UNIT_PRICES.excavationPerCubicMeter;
  const laborCost = UNIT_PRICES.laborFlatFee;

  const totalCost = pvcCost + filterCost + tankCost + excavationCost + laborCost;

  return {
    breakdown: {
      pvcPipes: Math.round(pvcCost),
      filtrationSystem: Math.round(filterCost),
      storageTank: Math.round(tankCost),
      pitExcavation: Math.round(excavationCost),
      laborAndInstallation: Math.round(laborCost)
    },
    totalCostINR: Math.round(totalCost)
  };
}

module.exports = {
  calculateHarvestedWater,
  calculateSystemSizing,
  calculateItemizedCosts
};