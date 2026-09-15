const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5003;

// Mock database for local rainwater harvesting installers
const installers = [
    { name: "EcoRain Water Solutions", contact: "+91-9876543210", rating: 4.8 },
    { name: "Jal Shakti Harvesting Co.", contact: "+91-9123456789", rating: 4.6 },
    { name: "AquaRecharge Engineers", contact: "+91-9988776655", rating: 4.9 }
];

// Helper function to classify soil based on coordinates (Mock Logic)
function getSoilClassification(lat, lon) {
    const sum = Math.abs(parseFloat(lat)) + Math.abs(parseFloat(lon));
    if (sum % 3 < 1) return { type: "Clayey", warning: "High risk of waterlogging! Ensure proper drainage channels." };
    if (sum % 3 < 2) return { type: "Loamy", warning: "Ideal soil for artificial recharge pits." };
    return { type: "Sandy", warning: "High absorption capacity; monitor groundwater percolation rates." };
}

// Microservice API Endpoint
app.post('/api/gis/analyze', async (req, res) => {
    try {
        let { latitude, longitude, address, pincode } = req.body;

        // 1. Dual-method Location Engine: Reverse Geocoding via Nominatim if needed
        if ((!latitude || !longitude) && (address || pincode)) {
            const query = address || pincode;
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
            
            const geoResponse = await axios.get(geoUrl, {
                headers: { 'User-Agent': 'SavJal-GIS-Service/1.0' }
            });

            if (geoResponse.data && geoResponse.data.length > 0) {
                latitude = parseFloat(geoResponse.data[0].lat);
                longitude = parseFloat(geoResponse.data[0].lon);
            } else {
                return res.status(400).json({ status: "error", message: "Location could not be geocoded." });
            }
        }

        if (!latitude || !longitude) {
            return res.status(400).json({ status: "error", message: "Latitude and Longitude (or address/pincode) are required." });
        }

        // 2. Fetch Historical Annual Rainfall Data via Open-Meteo API
        const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2023-01-01&end_date=2023-12-31&daily=rain_sum&timezone=auto`;
        const weatherResponse = await axios.get(weatherUrl);
        
        const rainArray = weatherResponse.data.daily.rain_sum || [];
        const annualRainfallMm = rainArray.reduce((acc, curr) => acc + (curr || 0), 0);

        // 3. Soil Classification & Safety Warning
        const soilInfo = getSoilClassification(latitude, longitude);

        // 4. Construct Final Response Payload
        return res.status(200).json({
            status: "success",
            location: {
                latitude,
                longitude
            },
            environmentalData: {
                annualRainfallMm: parseFloat(annualRainfallMm.toFixed(2)),
                soilType: soilInfo.type,
                safetyWarning: soilInfo.warning
            },
            installers: installers
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to process GIS data.",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`SavJal GIS Service running on http://localhost:${PORT}`);
});