from calculations import (
    calculate_annual_savings,
    calculate_payback,
    calculate_roi
)


def test_annual_savings():
    result = calculate_annual_savings(60000, 0.20)
    assert result == 12000


def test_payback():
    result = calculate_payback(50000, 12000)
    assert round(result, 2) == 4.17


def test_roi():
    result = calculate_roi(50000, 12000)
    assert result == 24
    