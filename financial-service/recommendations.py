def generate_recommendations(roi, payback_years, annual_savings):

    recommendations = []

    if roi >= 30:
        recommendations.append(
            "The system has strong financial potential."
        )
    elif roi >= 15:
        recommendations.append(
            "The system offers moderate financial benefits."
        )
    else:
        recommendations.append(
            "Consider reducing installation cost or increasing water utilization."
        )

    if payback_years <= 3:
        recommendations.append(
            "The installation cost can be recovered relatively quickly."
        )
    elif payback_years <= 5:
        recommendations.append(
            "The system has a reasonable payback period."
        )
    else:
        recommendations.append(
            "A longer payback period indicates that cost optimization may be useful."
        )

    if annual_savings >= 10000:
        recommendations.append(
            "The estimated annual savings are significant."
        )

    return recommendations