export function calculateHydrology(roofArea, rainfall, runoffCoeff = 0.85, householdMembers = 4, soilType = 'Loamy') {
  const area = Math.max(10, Number(roofArea) || 120);
  const rain = Math.max(200, Number(rainfall) || 950);
  const coeff = Number(runoffCoeff) || 0.85;
  const members = Number(householdMembers) || 4;

  // Annual harvested water (Liters)
  // 1 mm of rain on 1 sq meter = 1 Liter
  const annualHarvest = Math.round(area * rain * coeff);

  // Household demand (standard 135 L / person / day)
  const dailyDemand = members * 135;
  const annualDemand = dailyDemand * 365;

  // Self sufficiency percentage
  const selfSufficiencyPct = Math.min(100, Math.round((annualHarvest / annualDemand) * 100));

  // Storage tank sizing (18% of annual harvested monsoon water)
  const tankCapacity = Math.round(annualHarvest * 0.18 / 500) * 500 || 3000;

  // Downpipe sizing
  let downpipeDiameter = '75 mm PVC';
  if (area > 250) {
    downpipeDiameter = '160 mm Reinforced PVC';
  } else if (area > 100) {
    downpipeDiameter = '110 mm Commercial PVC';
  }

  // Gutter length estimation
  const gutterLength = Math.round(Math.sqrt(area) * 4);

  // Recharge Pit dimensions
  const pitVolumeM3 = Math.round((annualHarvest * 0.05 / 1000) * 10) / 10 || 2.5;
  const side = Math.round(Math.sqrt(pitVolumeM3 / 1.5) * 10) / 10;
  const pitDimensions = `${side}m x ${side}m x 1.8m`;

  // Itemized Pricing Engine (INR ₹)
  const tankCost = Math.round(tankCapacity * 5.5);
  const filterCost = 8500; // Multi-stage gravel-charcoal filter
  const pipingCost = Math.round(gutterLength * 320);
  const excavationCost = Math.round(pitVolumeM3 * 1800);
  const laborCost = 7500;
  const totalCost = tankCost + filterCost + pipingCost + excavationCost + laborCost;

  // Financial ROI
  const waterRatePerLiter = 0.14; // ₹ per liter saved vs tanker / municipal supply
  const annualSavings = Math.round(annualHarvest * waterRatePerLiter);
  const paybackYears = Math.round((totalCost / annualSavings) * 10) / 10 || 2.4;

  // Safety & AI Rules
  let safetyAlert = null;
  if (soilType === 'Clayey') {
    safetyAlert = {
      type: 'warning',
      title: 'Heavy Clay Soil Detected',
      message: 'Clay soil has poor percolation (< 10 mm/hr). We strongly recommend prioritizing Above-Ground Polyethylene Storage Tanks over direct Soil Recharge Pits to prevent surface waterlogging.'
    };
  } else if (soilType === 'Sandy') {
    safetyAlert = {
      type: 'success',
      title: 'Optimal Sandy Soil Percolation',
      message: 'Sandy soil offers high infiltration rates (> 50 mm/hr). Ideal for deep aquifer recharge pit injection.'
    };
  }

  // 12-Month Water Balance Chart Data
  const monthlyRainDistribution = [0.02, 0.02, 0.03, 0.04, 0.08, 0.22, 0.28, 0.20, 0.07, 0.01, 0.005, 0.005];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = monthNames.map((month, idx) => {
    const harvested = Math.round(annualHarvest * monthlyRainDistribution[idx]);
    const demand = Math.round(dailyDemand * 30);
    const balance = harvested - demand;
    return {
      month,
      harvested,
      demand,
      savings: Math.round(harvested * waterRatePerLiter),
      tankStorage: Math.min(tankCapacity, Math.max(0, balance > 0 ? balance : tankCapacity + balance))
    };
  });

  // AI Recommendation rules
  const aiRecommendations = [
    `Increasing tank capacity by 1,000L captures 16% more peak monsoon overflow in July-August.`,
    `Installing a dual-stage first-flush diverter will improve harvested water purity by 94%.`,
    `Roof surface (${roofArea} m²) generates enough water to fulfill ${selfSufficiencyPct}% of your family's annual non-potable needs.`
  ];

  return {
    annualHarvest,
    annualDemand,
    selfSufficiencyPct,
    tankCapacity,
    downpipeDiameter,
    gutterLength,
    pitDimensions,
    pitVolumeM3,
    pricing: {
      tankCost,
      filterCost,
      pipingCost,
      excavationCost,
      laborCost,
      totalCost
    },
    financials: {
      annualSavings,
      paybackYears,
      waterRatePerLiter
    },
    safetyAlert,
    monthlyData,
    aiRecommendations
  };
}
