import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

function App() {
  const [scenario, setScenario] = useState({ unemploymentShock: 0, gdpShock: -4 });
  const [results, setResults] = useState(null);
  const [latestUnemployment, setLatestUnemployment] = useState(null);

  // Optional: Fetch latest US unemployment rate
  useEffect(() => {
    async function fetchUnemployment() {
      try {
        const res = await fetch("http://localhost:4000/api/unemployment");
        const data = await res.json();
        setLatestUnemployment(parseFloat(data.unemploymentRate) || 0);
      } catch {
        setLatestUnemployment(0); // fallback if API not available
      }
    }
    fetchUnemployment();
  }, []);

  const handleRunTest = async () => {
    const adjustedScenario = {
      ...scenario,
      unemploymentShock: latestUnemployment + scenario.unemploymentShock
    };

    const res = await fetch("http://localhost:4000/api/stress-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adjustedScenario)
    });

    const data = await res.json();
    setResults(data);
  };

  const dataForChart = results
    ? [
        { name: "Before Stress", Capital: results.capital.beforeStress },
        { name: "After Stress", Capital: results.capital.afterStress }
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: 32 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h1>Executive Stress Testing Dashboard</h1>
        </header>

        {/* Latest Unemployment */}
        {latestUnemployment !== null && (
          <div style={cardStyle}>
            <strong>Latest US Unemployment Rate (FRED):</strong>{" "}
            {latestUnemployment}%
          </div>
        )}

        {/* Scenario Inputs */}
        <div style={cardStyle}>
          <h2>Scenario Inputs</h2>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <div>
              <label>Additional Unemployment Shock (%)</label>
              <input
                type="number"
                value={scenario.unemploymentShock}
                min={0}
                max={20}
                onChange={e =>
                  setScenario({
                    ...scenario,
                    unemploymentShock: Number(e.target.value)
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label>GDP Shock (%)</label>
              <input
                type="number"
                value={scenario.gdpShock}
                min={-10}
                max={0}
                onChange={e =>
                  setScenario({
                    ...scenario,
                    gdpShock: Number(e.target.value)
                  })
                }
                style={inputStyle}
              />
            </div>

            <button onClick={handleRunTest} style={buttonStyle}>
              Run Stress Test
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div style={cardStyle}>
            <h2>Stress Test Results</h2>

            <p>
              <strong>CAR:</strong> {results.capitalAdequacyRatio}%
            </p>
            <p>
              <strong>Basel Minimum:</strong> {results.baselMinimum}%
            </p>
            <p
              style={{
                fontWeight: "bold",
                color: results.result === "PASS" ? "green" : "red"
              }}
            >
              Result: {results.result}
            </p>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dataForChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <ReferenceLine
                  y={results.baselMinimum * 1_000_000}
                  stroke="red"
                  strokeDasharray="3 3"
                />
                <Bar dataKey="Capital" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 40,
            color: "#777",
            fontSize: 14
          }}
        >
          Built as a learning project by a former Mainframe
          Developer transitioning to Full-Stack Engineering
        </footer>
      </div>
    </div>
  );
}

// ---------------- Styles ----------------
const cardStyle = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  marginBottom: 24,
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const inputStyle = {
  display: "block",
  marginTop: 6,
  padding: 8,
  width: 120
};

const buttonStyle = {
  padding: "10px 20px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

export default App;
