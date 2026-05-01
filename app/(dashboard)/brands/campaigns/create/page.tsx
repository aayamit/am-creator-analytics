/**
 * Brand Campaign Create Page - SUPER PREMIUM
 * Bloomberg × McKinsey Design
 * Uses Premium Creator Search component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PremiumCreatorSearch from "@/components/premium/creator-search-premium";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campignData, setCampaignData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    objectives: [] as string[],
    selectedCreators: [] as string[],
  });

  const handleCreatorsSelected = (creatorIds: string[]) => {
    setCampaignData(prev => ({ ...prev, selectedCreators: creatorIds }));
    setStep(4); // Go to review
  };

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>
              Create New Campaign
            </h1>
            <p className="text-sm mt-1" style={{ color: '#92400e' }}>
              Set up your campaign in 3 simple steps
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {["Basics", "Objectives", "Creators", "Review"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > i + 1
                    ? 'text-white'
                    : step === i + 1
                    ? 'border-2 border-amber-600 text-amber-600'
                    : 'border-2 border-gray-300 text-gray-400'
                }`}
                style={step > i + 1 ? { backgroundColor: '#1a1a2e' } : {}}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`ml-2 text-sm ${step >= i + 1 ? 'font-medium' : ''}`} 
                    style={{ color: step >= i + 1 ? '#1a1a2e' : '#9ca3af' }}>
                {label}
              </span>
              {i < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <FileText className="w-5 h-5" style={{ color: '#92400e' }} />
                  Campaign Basics
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a2e' }}>
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Summer SaaS Launch"
                    value={campignData.title}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a2e' }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your campaign goals and deliverables..."
                    value={campignData.description}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-amber-600 outline-none resize-none"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a2e' }}>
                      Budget ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="12000"
                        value={campignData.budget}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full h-12 pl-10 border-2 border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                        style={{ backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a2e' }}>
                      Timeline
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={campignData.startDate}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                        style={{ backgroundColor: '#ffffff' }}
                      />
                      <input
                        type="date"
                        value={campignData.endDate}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-amber-600 outline-none"
                        style={{ backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 text-white rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: '#1a1a2e' }}
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Objectives */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <Target className="w-5 h-5" style={{ color: '#92400e' }} />
                  Campaign Objectives
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm" style={{ color: '#92400e' }}>
                  Select all that apply to your campaign:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Brand Awareness",
                    "Lead Generation",
                    "Sales Conversion",
                    "Product Launch",
                    "Content Creation",
                    "Community Engagement",
                  ].map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => {
                        setCampaignData(prev => ({
                          ...prev,
                          objectives: prev.objectives.includes(obj)
                            ? prev.objectives.filter(o => o !== obj)
                            : [...prev.objectives, obj]
                        }));
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        campignData.objectives.includes(obj)
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: '#1a1a2e' }}>{obj}</span>
                        {campignData.objectives.includes(obj) && (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#92400e' }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg flex items-center gap-2"
                    style={{ color: '#1a1a2e' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 text-white rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: '#1a1a2e' }}
                  >
                    Next: Select Creators
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Select Creators (SUPER PREMIUM) */}
        {step === 3 && (
          <PremiumCreatorSearch
            onCreatorsSelected={handleCreatorsSelected}
            selectedCreators={campignData.selectedCreators}
          />
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>
                  Review Campaign
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#92400e' }}>
                    Campaign Details
                  </h3>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <p style={{ color: '#1a1a2e' }}>
                      <strong>Title:</strong> {campignData.title}
                    </p>
                    <p style={{ color: '#1a1a2e' }}>
                      <strong>Budget:</strong> ${campignData.budget}
                    </p>
                    <p style={{ color: '#1a1a2e' }}>
                      <strong>Duration:</strong> {campignData.startDate} to {campignData.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#92400e' }}>
                    Objectives
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {campignData.objectives.map(obj => (
                      <span key={obj} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#92400e' }}>
                    Selected Creators ({campignData.selectedCreators.length})
                  </h3>
                  <div className="space-y-2">
                    {campignData.selectedCreators.map(id => (
                      <div key={id} className="p-3 border rounded-lg flex items-center justify-between">
                        <span style={{ color: '#1a1a2e' }}>Creator {id}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg flex items-center gap-2"
                    style={{ color: '#1a1a2e' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Edit Creators
                  </button>
                  <button
                    onClick={() => {
                      console.log('Creating campaign:', campignData);
                      // router.push('/brands/campaigns');
                    }}
                    className="px-6 py-2 text-white rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: '#92400e' }}
                  >
                    Create Campaign
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Import icons (to avoid errors)
function FileText(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
function ChevronRight(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
function DollarSign(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
function Target(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
function CheckCircle2(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
function ArrowLeft(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">...</svg>;
}
