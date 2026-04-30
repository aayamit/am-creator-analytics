/**
 * LTV Calculator
 * Calculates Lifetime Value of a creator
 * Formula: LTV = (Avg Monthly Spend × Gross Margin) / Monthly Churn Rate
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LTVCalculator() {
  const [monthlySpend, setMonthlySpend] = useState(50000); // ₹50K
  const [grossMargin, setGrossMargin] = useState(30); // 30%
  const [churnRate, setChurnRate] = useState(5); // 5% monthly
  const [ltv, setLtv] = useState(0);

  const calculateLTV = () => {
    const marginDecimal = grossMargin / 100;
    const churnDecimal = churnRate / 100;
    
    if (churnDecimal === 0) {
      setLtv(0);
      return;
    }

    const ltvValue = (monthlySpend * marginDecimal) / churnDecimal;
    setLtv(Math.round(ltvValue));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: '#1a1a2e' }}>LTV Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Monthly Spend */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1a1a2e' }}>
              Avg Monthly Spend (₹)
            </label>
            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Gross Margin */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1a1a2e' }}>
              Gross Margin (%)
            </label>
            <input
              type="number"
              value={grossMargin}
              onChange={(e) => setGrossMargin(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Churn Rate */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1a1a2e' }}>
              Monthly Churn Rate (%)
            </label>
            <input
              type="number"
              value={churnRate}
              onChange={(e) => setChurnRate(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <Button onClick={calculateLTV} className="w-full" style={{ backgroundColor: '#1a1a2e' }}>
            Calculate LTV
          </Button>

          {ltv > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded" style={{ backgroundColor: '#F8F7F4' }}>
              <p className="text-sm text-gray-600">Lifetime Value (LTV)</p>
              <p className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>
                ₹{ltv.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                = (₹{monthlySpend.toLocaleString()} × {grossMargin}%) / {churnRate}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This creator is worth ₹{ltv.toLocaleString()} over their lifetime.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
