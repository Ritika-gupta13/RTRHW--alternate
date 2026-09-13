from pydantic import BaseModel, Field


class FinancialInput(BaseModel):

    total_cost: float = Field(gt=0)
    harvested_water: float = Field(ge=0)
    water_rate: float = Field(gt=0)