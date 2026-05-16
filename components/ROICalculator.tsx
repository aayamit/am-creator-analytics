'use client';

import { useState } from 'react';

export default function ROICalculator() {
  const [budget, setBudget] = useState(1000000);
  const agencyFee = budget * 0.25;
  const saasFee = 50000;

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6">Calculate Your Savings</h3>
      <div className="mb-6">
        <label className="text-slate-300 block mb-2">Monthly Influencer Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">Agency Cost</p>
          <p className="text-red-400 text-xl font-bold">₹{agencyFee.toLocaleString('en-IN')}</p>
          <p className="text-slate-500 text-xs">Hidden 25% markup</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">With Our SaaS</p>
          <p className="text-green-400 text-xl font-bold">₹{saasFee.toLocaleString('en-IN')}</p>
          <p className="text-slate-500 text-xs">Flat monthly fee</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
        <p className="text-white font-bold">Monthly Savings: ₹{(agencyFee - saasFee).toLocaleString('en-IN')}</p>
        <p className="text-slate-300 text-sm">Reinvest this into campaigns to double your reach!</p>
      </div>
    </div>
  );
}
