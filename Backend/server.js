// -----------------------------------------------
// Full-Stack Banking Stress Testing API (Backend)
// -----------------------------

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Bank Profile & Stress Test Calculations ----------------

const BANK_PROFILE = {
  bankName: "Demo Global Bank",
  tier1Capital: 120_000_000,       // Tier 1 Capital
  riskWeightedAssets: 1_000_000_000, // Total risk-weighted assets
  baselMinimumCAR: 10.5             // Basel minimum Capital Adequacy Ratio (%)
};

// Calculate credit loss based on unemployment shock (%)
function calculateCreditLoss(unemploymentShock) {
  return unemploymentShock * 0.02 * BANK_PROFILE.riskWeightedAssets;
}

// Calculate market loss based on GDP shock (%)
function calculateMarketLoss(gdpShock) {
  return Math.abs(gdpShock) * 0.015 * BANK_PROFILE.riskWeightedAssets;
}

// Calculate Capital Adequacy Ratio
function calculateCAR(capitalAfterStress) {
  return (capitalAfterStress / BANK_PROFILE.riskWeightedAssets) * 100;
}

// ---------------- API Endpoints ----------------

// Run Stress Test
app.post("/api/stress-test", (req, res) => {
  const { unemploymentShock = 3, gdpShock = -4 } = req.body;

  const creditLoss = calculateCreditLoss(unemploymentShock);
  const marketLoss = calculateMarketLoss(gdpShock);
  const totalLoss = creditLoss + marketLoss;

  const capitalAfterStress = BANK_PROFILE.tier1Capital - totalLoss;
  const car = calculateCAR(capitalAfterStress);

  res.json({
    scenario: "Severely Adverse",
    inputs: { unemploymentShock, gdpShock },
    losses: {
      creditLoss: Math.round(creditLoss),
      marketLoss: Math.round(marketLoss),
      totalLoss: Math.round(totalLoss)
    },
    capital: {
      beforeStress: BANK_PROFILE.tier1Capital,
      afterStress: Math.round(capitalAfterStress)
    },
    capitalAdequacyRatio: car.toFixed(2),
    baselMinimum: BANK_PROFILE.baselMinimumCAR,
    result: car >= BANK_PROFILE.baselMinimumCAR ? "PASS" : "FAIL"
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => 
  res.json({ status: "OK", service: "Stress Testing API" })
);

// Fetch latest US unemployment rate from FRED API
const FRED_API_KEY = process.env.FRED_API_KEY;

app.get("/api/unemployment", async (req, res) => {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    res.json({ unemploymentRate: parseFloat(data.observations[0].value) });
  } catch (error) {
    console.error("Error fetching unemployment data:", error);
    res.status(500).json({ error: "Failed to fetch unemployment data" });
  }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

