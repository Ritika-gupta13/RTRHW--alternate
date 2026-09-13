const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { generateMunicipalPDF } = require('../services/pdfGenerator');
const { calculateHydrology } = require('../services/hydrologicalEngine');

/**
 * POST /api/report/generate
 * Protected route — requires valid JWT token.
 * Accepts consolidated assessment JSON from all members,
 * runs server-side hydrology calculations,
 * generates a Municipal Compliance PDF via pdfmake,
 * and returns it as a downloadable binary stream.
 */
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const {
      address,
      roofArea,
      roofMaterial,
      runoffCoeff,
      rainfall,
      householdMembers,
      soilType,
      polygonPoints,
      generatedBy
    } = req.body;

    // ─── Validate required fields ───────────────────────────
    if (!roofArea && !rainfall) {
      return res.status(400).json({
        error: true,
        message: 'Missing required fields. At minimum, roofArea and rainfall are needed.'
      });
    }

    // ─── Run server-side hydrological calculations ──────────
    const hydro = calculateHydrology(
      roofArea || 145,
      rainfall || 950,
      runoffCoeff || 0.85,
      householdMembers || 4,
      soilType || 'Loamy'
    );

    // ─── Assemble consolidated data object (all members) ────
    const reportData = {
      // Member 1 data: Property & UI
      address: address || 'Jaipur, Rajasthan',
      polygonPoints: polygonPoints || [],

      // Member 2 data: Roof & Soil
      roofArea: roofArea || 145,
      roofMaterial: roofMaterial || 'Reinforced Concrete Flat Slab',
      runoffCoeff: runoffCoeff || 0.85,
      soilType: soilType || 'Loamy',

      // Member 3 data: Rainfall & Household
      rainfall: rainfall || 950,
      householdMembers: householdMembers || 4,

      // Member 4 data: Hydrology calculations (server-verified)
      hydro,

      // Report metadata
      generatedBy: generatedBy || req.user.name || 'SAVJAL System',
      generatedAt: new Date().toISOString(),
      reportId: `SVJ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      verifiedBy: req.user.email
    };

    console.log(`📄 Generating PDF report ${reportData.reportId} for ${req.user.email}`);

    // ─── Generate PDF binary stream ─────────────────────────
    const pdfBuffer = await generateMunicipalPDF(reportData);

    // ─── Send PDF as downloadable binary ────────────────────
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="SAVJAL_Municipal_Report_${reportData.reportId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);

    return res.send(pdfBuffer);

  } catch (err) {
    console.error('❌ PDF Generation Error:', err.message);
    return res.status(500).json({
      error: true,
      message: 'Failed to generate PDF report.',
      detail: err.message
    });
  }
});

module.exports = router;
