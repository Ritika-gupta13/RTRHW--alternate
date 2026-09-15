from recommendations import generate_recommendations


def test_recommendation():

    result = generate_recommendations(
        roi=24,
        payback_years=4.17,
        annual_savings=12000
    )

    assert len(result) > 0
    assert "moderate financial benefits" in result[0]