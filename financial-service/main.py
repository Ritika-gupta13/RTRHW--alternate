from fastapi import FastAPI

from calculations import (
    calculate_annual_savings,
    calculate_payback,
    calculate_roi
)

from models import FinancialInput
from chart_data import create_monthly_data
from recommendations import generate_recommendations


app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Financial Analysis Service is running"
    }


@app.post("/api/v1/analytics/roi")
def financial_analysis(data: FinancialInput):

    # Calculate annual savings
    annual_savings = calculate_annual_savings(
        data.harvested_water,
        data.water_rate
    )

    # Calculate payback period
    payback = calculate_payback(
        data.total_cost,
        annual_savings
    )

    # Calculate ROI
    roi = calculate_roi(
        data.total_cost,
        annual_savings
    )

    # Generate monthly chart data
    chart_data = create_monthly_data(
        data.harvested_water,
        data.water_rate
    )

    # Generate financial recommendations
    recommendations = generate_recommendations(
        roi=roi,
        payback_years=payback,
        annual_savings=annual_savings
    )

    return {
        "annual_savings": round(annual_savings, 2),

        "payback_period_years": (
            round(payback, 2)
            if payback is not None
            else None
        ),

        "roi_percent": round(roi, 2),

        "chart_data": chart_data,

        "recommendations": recommendations
    }