/**
 * Campaign ROI Simulator
 * What-if analysis: adjust budget, CPM, conversion rate
 * Interactive sliders (native HTML) + projected results (Bloomberg × McKinsey)
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TrendingUp, IndianRupee, Users, MousePointerClick, BarChart3, Target } from "lucide-react";

interface ROIResult {
  budget: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  creatorCost: number;
  platformCost: number;
  totalCost: number;
  roi: number;
  costPerConversion: number;
  breakEvenConversions: number;
}

interface ROISimulatorProps {
  campaignId?: string;
  initialBudget?: number; // ₹
  onSimulate?: (result: ROIResult) => void;
}

export default function ROISimulator({
  campaignId,
  initialBudget = 50000,
  onSimulate,
}: ROISimulatorProps) {
  const [budget, setBudget] = useState(initialBudget);
  const [cpm, setCpm] = useState(150); // ₹ per 1000
  const [conversionRate, setConversionRate] = useState(2); // %
  const [avgOrderValue, setAvgOrderValue] = useState(500); // ₹
  const [commissionRate, setCommissionRate] = useState(10); // %

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/simulate/roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          budget,
          cpm,
          conversionRate,
          avgOrderValue,
          commissionRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data = await response.json();
      setResult(data.simulation);
      onSimulate?.(data.simulation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-IN").format(Math.round(n));
  const formatCurrency = (n: number) =>
    `₹${formatNumber(n)}`;

  // Range input styles
  const rangeStyle = {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#e5e7eb",
    outline: "none",
    marginTop: "8px",
  };

  return (
    <Card style={{ border: "1px solid #e5e7eb", backgroundColor: "#FFFFFF" }}>
      <CardHeader>
        <CardTitle
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#1a1a2e",
            fontSize: "16px",
          }}
        >
          <BarChart3 size={18} style={{ color: "#92400e" }} />
          ROI Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {/* Budget */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Budget</Label>
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: "13px" }}>
                ₹{formatNumber(budget)}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={rangeStyle}
            />
          </div>

          {/* CPM */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>CPM (Cost per 1000)</Label>
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: "13px" }}>
                ₹{cpm}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={cpm}
              onChange={(e) => setCpm(Number(e.target.value))}
              style={rangeStyle}
            />
          </div>

          {/* Conversion Rate */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Conversion Rate</Label>
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: "13px" }}>
                {conversionRate}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              style={rangeStyle}
            />
          </div>

          {/* AOV */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Avg Order Value</Label>
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: "13px" }}>
                ₹{formatNumber(avgOrderValue)}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              style={rangeStyle}
            />
          </div>

          {/* Commission */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Creator Commission</Label>
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: "13px" }}>
                {commissionRate}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              style={rangeStyle}
            />
          </div>
        </div>

        {/* Simulate Button */}
        <Button
          onClick={handleSimulate}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#1a1a2e",
            color: "#F8F7F4",
            marginBottom: "24px",
          }}
        >
          {loading ? "Simulating..." : "Run Simulation"}
        </Button>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#FEE2E2",
              border: "1px solid #FECACA",
              borderRadius: "6px",
              color: "#991B1B",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            Error: {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
            {/* ROI Badge */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Badge
                style={{
                  backgroundColor:
                    result.roi > 50
                      ? "#DCFCE7"
                      : result.roi > 0
                      ? "#FEF9C3"
                      : "#FEE2E2",
                  color:
                    result.roi > 50
                      ? "#166534"
                      : result.roi > 0
                      ? "#854D0E"
                      : "#991B1B",
                  padding: "8px 16px",
                  fontSize: "24px",
                  fontWeight: 700,
                  borderRadius: "8px",
                }}
              >
                ROI: {result.roi}%
              </Badge>
            </div>

            {/* Metric Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              <MetricCard
                icon={<IndianRupee size={16} />}
                label="Total Cost"
                value={formatCurrency(result.totalCost)}
                color="#1a1a2e"
              />
              <MetricCard
                icon={<TrendingUp size={16} />}
                label="Revenue"
                value={formatCurrency(result.revenue)}
                color="#16a34a"
              />
              <MetricCard
                icon={<Users size={16} />}
                label="Reach"
                value={formatNumber(result.reach)}
                color="#92400e"
              />
              <MetricCard
                icon={<MousePointerClick size={16} />}
                label="Conversions"
                value={formatNumber(result.conversions)}
                color="#2563eb"
              />
              <MetricCard
                icon={<Target size={16} />}
                label="Cost / Conv"
                value={formatCurrency(result.costPerConversion)}
                color="#dc2626"
              />
              <MetricCard
                icon={<BarChart3 size={16} />}
                label="Impressions"
                value={formatNumber(result.impressions)}
                color="#6b7280"
              />
            </div>

            {/* Break-even */}
            <p
              style={{
                margin: "16px 0 0 0",
                fontSize: "12px",
                color: "#92400e",
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              Break-even at {result.breakEvenConversions} conversions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#F8F7F4",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "4px",
          color: "#92400e",
        }}
      >
        {icon}
        <span style={{ fontSize: "11px", textTransform: "uppercase" as const }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
