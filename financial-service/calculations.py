def calculate_annual_savings(harvested_water, water_rate):
    return harvested_water * water_rate


def calculate_payback(cost, annual_savings):
    if annual_savings <= 0:
        return None

    return cost / annual_savings


def calculate_roi(cost, annual_savings):
    if cost <= 0:
        return 0

    return (annual_savings / cost) * 100