const FINANCIAL_URL =
  import.meta.env.VITE_FINANCIAL_SERVICE_URL || 'http://localhost:5002';

export async function calculateFinancialAnalysis({
  totalCost,
  harvestedWater,
  waterRate
}) {
  const response = await fetch(
    `${FINANCIAL_URL}/api/v1/analytics/roi`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        total_cost: Number(totalCost),
        harvested_water: Number(harvestedWater),
        water_rate: Number(waterRate)
      })
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Financial service error: ${response.status}`
    );
  }

  return response.json();
}
