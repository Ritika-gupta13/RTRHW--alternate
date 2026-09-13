import csv
from pathlib import Path


MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
]


def load_monthly_rainfall():

    file_path = Path(__file__).with_name("monthly_rainfall.csv")

    rainfall = {}

    with open(file_path, newline="", encoding="utf-8") as file:

        reader = csv.DictReader(file)

        for row in reader:
            rainfall[row["month"]] = float(row["rainfall_mm"])

    return [rainfall[month] for month in MONTHS]


def create_monthly_data(annual_water, water_rate):

    rainfall = load_monthly_rainfall()

    total_rainfall = sum(rainfall)

    water_collection = [
        round(
            annual_water * (monthly_rain / total_rainfall),
            2
        )
        for monthly_rain in rainfall
    ]

    monthly_savings = [
        round(water * water_rate, 2)
        for water in water_collection
    ]

    return {
        "labels": MONTHS,
        "rainfall_mm": rainfall,
        "water_collection_liters": water_collection,
        "monthly_savings_inr": monthly_savings,
        "data_source": "IMD West Madhya Pradesh 1971-2020 normal rainfall"
    }