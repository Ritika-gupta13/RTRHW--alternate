from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from calculations import (
    calculate_annual_savings,
    calculate_payback,
    calculate_roi
)

from models import FinancialInput
from chart_data import create_monthly_data
from recommendations import generate_recommendations


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Financial Analysis Service is running"
    }


@app.post("/api/v1/analytics/roi")
def financial_analysis(data: FinancialInput):

    annual_savings = calculate_annual_savings(
        data.harvested_water,
        data.water_rate
    )

    payback = calculate_payback(
        data.total_cost,
        annual_savings
    )

    roi = calculate_roi(
        data.total_cost,
        annual_savings
    )

    chart_data = create_monthly_data(
        data.harvested_water,
        data.water_rate
    )

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