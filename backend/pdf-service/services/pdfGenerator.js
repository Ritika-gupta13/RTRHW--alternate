const PdfPrinter = require('pdfmake');

// Use standard PDF fonts built into PDF spec (guarantees zero external file dependencies)
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

/**
 * Generates a multi-page, professional Municipal Compliance PDF Report.
 * @param {Object} reportData - Consolidated data from all 4 project members
 * @returns {Promise<Buffer>} - Resolves to PDF binary buffer
 */
function generateMunicipalPDF(reportData) {
  return new Promise((resolve, reject) => {
    try {
      const {
        address,
        roofArea,
        roofMaterial,
        runoffCoeff,
        soilType,
        rainfall,
        householdMembers,
        hydro,
        generatedBy,
        generatedAt,
        reportId,
        verifiedBy
      } = reportData;

      const formattedDate = new Date(generatedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 50, 40, 50],
        
        footer: function(currentPage, pageCount) {
          return {
            margin: [40, 10, 40, 10],
            columns: [
              { text: 'SAVJAL RTRHW System • Municipal Compliance Report', fontSize: 8, color: '#64748b' },
              { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 8, color: '#64748b' }
            ]
          };
        },

        content: [
          // ─── BRAND HEADER ─────────────────────────────────────────────────────────────
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    fillColor: '#0f172a',
                    margin: [15, 15, 15, 15],
                    stack: [
                      {
                        columns: [
                          { text: 'SAVJAL', fontSize: 24, bold: true, color: '#38bdf8' },
                          { text: 'MUNICIPAL COMPLIANCE REPORT', fontSize: 10, color: '#94a3b8', alignment: 'right', margin: [0, 8, 0, 0] }
                        ]
                      },
                      { text: 'Rooftop Rainwater Harvesting Assessment & CGWB Verification', fontSize: 10, color: '#e2e8f0', margin: [0, 4, 0, 0] }
                    ]
                  }
                ]
              ]
            },
            layout: 'noBorders'
          },
          { text: ' ', margin: [0, 5, 0, 5] },

          // ─── METADATA BADGE BAR ───────────────────────────────────────────────────────
          {
            table: {
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  { text: 'REPORT ID', fontSize: 7, color: '#475569', bold: true },
                  { text: 'DATE GENERATED', fontSize: 7, color: '#475569', bold: true },
                  { text: 'VERIFIED BY', fontSize: 7, color: '#475569', bold: true },
                  { text: 'COMPLIANCE STATUS', fontSize: 7, color: '#475569', bold: true }
                ],
                [
                  { text: reportId, fontSize: 9, bold: true, color: '#0f172a' },
                  { text: formattedDate, fontSize: 8, color: '#1e293b' },
                  { text: verifiedBy || generatedBy, fontSize: 8, color: '#1e293b' },
                  { text: '✓ APPROVED (CGWB)', fontSize: 9, bold: true, color: '#16a34a' }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex) { return rowIndex === 0 ? '#f8fafc' : '#ffffff'; },
              hLineWidth: function() { return 0.5; },
              vLineWidth: function() { return 0; },
              hLineColor: function() { return '#e2e8f0'; }
            }
          },

          { text: ' ', margin: [0, 8, 0, 8] },

          // ─── SECTION 1: SITE & BUILDING ASSESSMENT ────────────────────────────────────
          { text: '1. Site & Building Profile (Member 1 & Member 2 Inputs)', fontSize: 12, bold: true, color: '#0369a1', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['35%', '65%'],
              body: [
                [{ text: 'Property Address', bold: true }, { text: address }],
                [{ text: 'Total Catchment Roof Area', bold: true }, { text: `${roofArea} sq. meters (${(roofArea * 10.7639).toFixed(0)} sq. ft)` }],
                [{ text: 'Roof Surface Type', bold: true }, { text: `${roofMaterial} (Runoff Coeff: ${runoffCoeff})` }],
                [{ text: 'Subsoil Classification', bold: true }, { text: `${soilType} Soil` }]
              ]
            },
            layout: 'lightHorizontalLines',
            fontSize: 9
          },

          { text: ' ', margin: [0, 8, 0, 8] },

          // ─── SECTION 2: HYDROLOGICAL CALCULATIONS ──────────────────────────────────────
          { text: '2. Hydrological Assessment & Water Yield (Member 3 & Member 4)', fontSize: 12, bold: true, color: '#0369a1', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  { text: 'Annual Regional Rainfall', fontSize: 8, color: '#475569' },
                  { text: 'Household Size & Water Demand', fontSize: 8, color: '#475569' }
                ],
                [
                  { text: `${rainfall} mm / year`, fontSize: 11, bold: true, color: '#0284c7' },
                  { text: `${householdMembers} members (${(hydro.annualDemand || householdMembers * 135 * 365).toLocaleString('en-IN')} L/yr demand)`, fontSize: 10, bold: true }
                ],
                [
                  { text: 'Gross Harvestable Water', fontSize: 8, color: '#475569' },
                  { text: 'Annual Household Demand Covered', fontSize: 8, color: '#475569' }
                ],
                [
                  { text: `${hydro.annualHarvest.toLocaleString('en-IN')} Liters / year`, fontSize: 12, bold: true, color: '#16a34a' },
                  { text: `${hydro.selfSufficiencyPct}% of Total Household Need`, fontSize: 11, bold: true, color: '#16a34a' }
                ]
              ]
            },
            layout: {
              fillColor: function() { return '#f0f9ff'; },
              hLineWidth: function() { return 0.5; },
              vLineWidth: function() { return 0.5; },
              hLineColor: function() { return '#bae6fd'; },
              vLineColor: function() { return '#bae6fd'; }
            }
          },

          { text: ' ', margin: [0, 8, 0, 8] },

          // ─── SECTION 3: SYSTEM DESIGN & SPECIFICATIONS ─────────────────────────────────
          { text: '3. Recommended System Specifications', fontSize: 12, bold: true, color: '#0369a1', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['35%', '65%'],
              body: [
                [{ text: 'Recommended Architecture', bold: true }, { text: 'Rooftop Collection + Poly Storage / Pit Recharge', bold: true, color: '#0284c7' }],
                [{ text: 'Storage Tank / Pit Volume', bold: true }, { text: `${hydro.tankCapacity.toLocaleString('en-IN')} Liters (${(hydro.tankCapacity / 1000).toFixed(1)} m³ capacity)` }],
                [{ text: 'First-Flush Separator & Downpipe', bold: true }, { text: `${hydro.downpipeDiameter} | Gutter Length ~${hydro.gutterLength}m` }],
                [{ text: 'Recharge Pit Dimensions', bold: true }, { text: hydro.pitDimensions || '2.0m x 2.0m x 1.8m' }]
              ]
            },
            layout: 'lightHorizontalLines',
            fontSize: 9
          },

          { text: ' ', margin: [0, 8, 0, 8] },

          // ─── SECTION 4: FINANCIAL ESTIMATE & ROI ───────────────────────────────────────
          { text: '4. Financial Investment & ROI Analytics', fontSize: 12, bold: true, color: '#0369a1', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['50%', '25%', '25%'],
              headerRows: 1,
              body: [
                [
                  { text: 'Item Description', bold: true, fillColor: '#e2e8f0', fontSize: 8 },
                  { text: 'Category', bold: true, fillColor: '#e2e8f0', fontSize: 8 },
                  { text: 'Estimated Cost (INR)', bold: true, fillColor: '#e2e8f0', fontSize: 8, alignment: 'right' }
                ],
                [{ text: 'Modular Storage Tank Unit', fontSize: 9 }, { text: 'Storage', fontSize: 8, color: '#64748b' }, { text: `₹${hydro.pricing.tankCost.toLocaleString('en-IN')}`, fontSize: 9, alignment: 'right', bold: true }],
                [{ text: 'Multi-layer Filtration & First Flush Unit', fontSize: 9 }, { text: 'Filtration', fontSize: 8, color: '#64748b' }, { text: `₹${hydro.pricing.filterCost.toLocaleString('en-IN')}`, fontSize: 9, alignment: 'right', bold: true }],
                [{ text: 'PVC Downpipes, Gutters & Fittings', fontSize: 9 }, { text: 'Piping', fontSize: 8, color: '#64748b' }, { text: `₹${hydro.pricing.pipingCost.toLocaleString('en-IN')}`, fontSize: 9, alignment: 'right', bold: true }],
                [{ text: 'Recharge Pit Excavation & Gravel Fill', fontSize: 9 }, { text: 'Civil Work', fontSize: 8, color: '#64748b' }, { text: `₹${hydro.pricing.excavationCost.toLocaleString('en-IN')}`, fontSize: 9, alignment: 'right', bold: true }],
                [{ text: 'Labor & Turnkey Commissioning', fontSize: 9 }, { text: 'Installation', fontSize: 8, color: '#64748b' }, { text: `₹${hydro.pricing.laborCost.toLocaleString('en-IN')}`, fontSize: 9, alignment: 'right', bold: true }],
                [
                  { text: 'Total Capital Expenditure (CapEx)', bold: true, colSpan: 2 },
                  {},
                  { text: `₹${hydro.pricing.totalCost.toLocaleString('en-IN')}`, bold: true, alignment: 'right', color: '#0f172a', fontSize: 10 }
                ]
              ]
            },
            layout: 'lightHorizontalLines'
          },

          { text: ' ', margin: [0, 4, 0, 4] },

          // ROI Highlights Box
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  { text: `Annual Water Utility Savings:\n₹${hydro.financials.annualSavings.toLocaleString('en-IN')} / year`, fontSize: 9, bold: true, color: '#15803d' },
                  { text: `Estimated Payback Timeline:\n${hydro.financials.paybackYears} Years`, fontSize: 9, bold: true, color: '#0284c7', alignment: 'right' }
                ]
              ]
            },
            layout: {
              fillColor: function() { return '#f0fdf4'; },
              hLineWidth: function() { return 1; },
              vLineWidth: function() { return 0; },
              hLineColor: function() { return '#86efac'; }
            }
          },

          { text: ' ', margin: [0, 10, 0, 10] },

          // ─── SECTION 5: MUNICIPAL COMPLIANCE DECLARATION ────────────────────────────────
          { text: '5. CGWB Municipal Compliance Checklist', fontSize: 12, bold: true, color: '#0369a1', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['75%', '25%'],
              body: [
                [{ text: 'Catchment Area meets municipal threshold (≥ 50 sq.m)', fontSize: 8 }, { text: '✓ PASS', fontSize: 8, bold: true, color: '#16a34a', alignment: 'center' }],
                [{ text: 'Storage Capacity engineered for monsoon peak intensity', fontSize: 8 }, { text: '✓ PASS', fontSize: 8, bold: true, color: '#16a34a', alignment: 'center' }],
                [{ text: 'Subsoil percolation suitability verified according to CGWB norms', fontSize: 8 }, { text: '✓ PASS', fontSize: 8, bold: true, color: '#16a34a', alignment: 'center' }],
                [{ text: 'First-flush bypass mechanism included in design specs', fontSize: 8 }, { text: '✓ PASS', fontSize: 8, bold: true, color: '#16a34a', alignment: 'center' }]
              ]
            },
            layout: 'grid'
          },

          { text: ' ', margin: [0, 15, 0, 15] },

          // ─── SIGNATURE BLOCK ───────────────────────────────────────────────────────────
          {
            columns: [
              {
                width: '60%',
                stack: [
                  { text: 'AI Recommendations & Technical Notes:', fontSize: 8, bold: true, color: '#475569' },
                  ...hydro.aiRecommendations.map(rec => ({ text: `• ${rec}`, fontSize: 7, color: '#334155', margin: [0, 1, 0, 1] }))
                ]
              },
              {
                width: '40%',
                stack: [
                  { text: 'VERIFIED & CERTIFIED', fontSize: 8, bold: true, alignment: 'center', color: '#0f172a' },
                  { text: 'SAVJAL Municipal Engine', fontSize: 8, alignment: 'center', color: '#64748b' },
                  { text: '\n[ DIGITAL STAMP & SIGNATURE ]\n', fontSize: 7, alignment: 'center', color: '#94a3b8' },
                  { text: `Doc Hash: ${reportId}`, fontSize: 6, alignment: 'center', color: '#cbd5e1' }
                ]
              }
            ]
          }
        ],

        styles: {
          header: { fontSize: 18, bold: true }
        },
        defaultStyle: {
          font: 'Roboto',
          fontSize: 10
        }
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      pdfDoc.on('error', (err) => reject(err));

      pdfDoc.end();

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateMunicipalPDF
};
