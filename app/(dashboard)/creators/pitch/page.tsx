/**
 * SUPER PREMIUM Creator Pitch Page
 * Bloomberg × McKinsey Design
 * Creators pitch themselves to brands
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  Send,
  DollarSign,
  Calendar,
  FileText,
  Instagram,
  Youtube,
  Linkedin,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  Lightbulb,
  Target,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  industry: string;
  logo: string;
  campaignTypes: string[];
}

interface PitchData {
  brandId: string;
  campaignTitle: string;
  description: string;
  deliverables: string[];
  price: number;
  timeline: string;
  previousWork: string[];
}

const mockBrands: Brand[] = [
  {
    id: "brand-1",
    name: "TechCorp",
    industry: "Technology",
    logo: "TC",
    campaignTypes: ["Product Launch", "Brand Awareness", "Tutorial"]
  },
  {
    id: "brand-2",
    name: "Fashion Forward",
    industry: "Fashion",
    logo: "FF",
    campaignTypes: ["Lookbook", "Unboxing", "Lifestyle"]
  },
  {
    id: "brand-3",
    name: "Finance Guru",
    industry: "Finance",
    logo: "FG",
    campaignTypes: ["Education", "Review", "Analysis"]
  }
];

const deliverableOptions = [
  "1x Instagram Post",
  "1x Instagram Story",
  "1x YouTube Video",
  "1x YouTube Short",
  "1x LinkedIn Article",
  "2x Instagram Stories",
  "1x TikTok Video",
  "1x Blog Post"
];

export default function CreatorPitchPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pitch, setPitch] = useState<PitchData>({
    brandId: "",
    campaignTitle: "",
    description: "",
    deliverables: [],
    price: 0,
    timeline: "",
    previousWork: []
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedBrand = mockBrands.find(b => b.id === pitch.brandId);

  const toggleDeliverable = (deliverable: string) => {
    setPitch(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter(d => d !== deliverable)
        : [...prev.deliverables, deliverable]
    }));
  };

  const handleSubmit = async () => {
    // Mock submission
    console.log("Pitch submitted:", pitch);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7F4' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-0 shadow-2xl" style={{ backgroundColor: '#ffffff' }}>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#92400e' }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Pitch Sent Successfully!
              </h2>
              <p className="mb-8" style={{ color: '#92400e' }}>
                Your pitch has been sent to <strong>{selectedBrand?.name}</strong>. 
                They typically respond within 48 hours.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full text-white"
                  style={{ backgroundColor: '#1a1a2e' }}
                  onClick={() => router.push('/creators/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSubmitted(false);
                    setPitch({
                      brandId: "",
                      campaignTitle: "",
                      description: "",
                      deliverables: [],
                      price: 0,
                      timeline: "",
                      previousWork: []
                    });
                    setStep(1);
                  }}
                >
                  Send Another Pitch
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F4' }}>
      {/* Premium Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                  Pitch to Brand
                </h1>
                <p className="text-sm" style={{ color: '#92400e' }}>
                  Create a compelling pitch to showcase your value
                </p>
              </div>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Step {step} of 3
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['Select Brand', 'Pitch Details', 'Review & Send'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step > i + 1 
                      ? 'text-white' 
                      : step === i + 1
                      ? 'border-2 border-amber-600 text-amber-600'
                      : 'border-2 border-gray-300 text-gray-400'
                  }`}
                  style={step > i + 1 ? { backgroundColor: '#1a1a2e' } : {}}
                >
                  {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= i + 1 ? 'font-medium' : ''
                }`} style={{ color: step >= i + 1 ? '#1a1a2e' : '#9ca3af' }}>
                  {label}
                </span>
                {i < 2 && <div className="w-16 h-0.5 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Brand */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <Users className="w-5 h-5" style={{ color: '#92400e' }} />
                  Select a Brand to Pitch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockBrands.map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => setPitch(prev => ({ ...prev, brandId: brand.id }))}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        pitch.brandId === brand.id
                          ? 'border-amber-600 shadow-lg'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                      style={{ backgroundColor: pitch.brandId === brand.id ? '#FFF7ED' : '#ffffff' }}
                    >
                      <div className="text-center">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
                          style={{ backgroundColor: '#1a1a2e' }}
                        >
                          {brand.logo}
                        </div>
                        <h3 className="font-bold text-lg mb-2" style={{ color: '#1a1a2e' }}>
                          {brand.name}
                        </h3>
                        <Badge variant="outline" className="mb-3">
                          {brand.industry}
                        </Badge>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {brand.campaignTypes.slice(0, 2).map(type => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!pitch.brandId}
                    className="text-white"
                    style={{ backgroundColor: '#1a1a2e' }}
                  >
                    Next Step
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Pitch Details */}
        {step === 2 && selectedBrand && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand Summary */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: '#1a1a2e' }}
                  >
                    {selectedBrand.logo}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#1a1a2e' }}>
                      {selectedBrand.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#92400e' }}>
                      {selectedBrand.industry}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Title */}
            <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <FileText className="w-5 h-5" style={{ color: '#92400e' }} />
                  Campaign Title
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Summer Collection Launch Campaign"
                  value={pitch.campaignTitle}
                  onChange={(e) => setPitch(prev => ({ ...prev, campaignTitle: e.target.value }))}
                  className="h-12 text-lg"
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <Lightbulb className="w-5 h-5" style={{ color: '#92400e' }} />
                  Pitch Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your creative vision for this campaign. What makes you the perfect creator for this brand?"
                  value={pitch.description}
                  onChange={(e) => setPitch(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="text-base"
                />
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <Target className="w-5 h-5" style={{ color: '#92400e' }} />
                  Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {deliverableOptions.map(deliverable => (
                    <button
                      key={deliverable}
                      onClick={() => toggleDeliverable(deliverable)}
                      className={`p-3 border-2 rounded-lg text-sm text-left transition-all ${
                        pitch.deliverables.includes(deliverable)
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{deliverable}</span>
                        {pitch.deliverables.includes(deliverable) && (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#92400e' }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                    <DollarSign className="w-5 h-5" style={{ color: '#92400e' }} />
                    Your Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="2400"
                      value={pitch.price || ''}
                      onChange={(e) => setPitch(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#92400e' }} />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., 2 weeks"
                    value={pitch.timeline}
                    onChange={(e) => setPitch(prev => ({ ...prev, timeline: e.target.value }))}
                    className="h-12"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!pitch.campaignTitle || !pitch.description || pitch.deliverables.length === 0}
                className="text-white"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                Review Pitch
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && selectedBrand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#92400e' }} />
                  Review Your Pitch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Brand */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2" style={{ color: '#92400e' }}>
                    Pitching To
                  </h4>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: '#1a1a2e' }}
                    >
                      {selectedBrand.logo}
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: '#1a1a2e' }}>
                        {selectedBrand.name}
                      </p>
                      <p className="text-sm" style={{ color: '#92400e' }}>
                        {selectedBrand.industry}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div>
                  <h4 className="text-sm font-medium mb-3" style={{ color: '#92400e' }}>
                    Campaign Details
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm" style={{ color: '#92400e' }}>
                        Title:
                      </span>
                      <p className="font-medium" style={{ color: '#1a1a2e' }}>
                        {pitch.campaignTitle}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm" style={{ color: '#92400e' }}>
                        Description:
                      </span>
                      <p className="font-medium" style={{ color: '#1a1a2e' }}>
                        {pitch.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="text-sm font-medium mb-3" style={{ color: '#92400e' }}>
                    Deliverables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pitch.deliverables.map(d => (
                      <Badge key={d} className="bg-amber-50 text-amber-700 border-amber-200">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price & Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm mb-1" style={{ color: '#92400e' }}>
                      Your Price
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                      ${pitch.price}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm mb-1" style={{ color: '#92400e' }}>
                      Timeline
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                      {pitch.timeline}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Edit Pitch
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="text-white"
                    style={{ backgroundColor: '#92400e' }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Pitch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
