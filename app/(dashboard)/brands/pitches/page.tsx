/**
 * SUPER PREMIUM Brand Pitch Inbox
 * Bloomberg × McKinsey Design
 * Brands view pitches from creators
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Inbox,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  User,
  DollarSign,
  Calendar,
  Star,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Pitch {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  campaignTitle: string;
  description: string;
  deliverables: string[];
  price: number;
  timeline: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NEGOTIATING';
  submittedAt: string;
  engagementRate: number;
  followers: number;
}

const mockPitches: Pitch[] = [
  {
    id: "pitch-1",
    creatorName: "Alex Tech Reviews",
    creatorHandle: "@alextech",
    creatorAvatar: "AT",
    campaignTitle: "Summer Tech Launch Campaign",
    description: "I specialize in tech reviews and unboxing videos. With my 268K subscribers, I can create engaging content that showcases your product's key features.",
    deliverables: ["1x YouTube Video", "2x YouTube Shorts", "1x Instagram Post"],
    price: 2400,
    timeline: "2 weeks",
    status: 'PENDING',
    submittedAt: "2026-04-28",
    engagementRate: 5.8,
    followers: 268000
  },
  {
    id: "pitch-2",
    creatorName: "Finance Guru",
    creatorHandle: "@financeguru",
    creatorAvatar: "FG",
    campaignTitle: "Investment App Promotion",
    description: "My LinkedIn audience of 128K professionals is perfect for your investment platform. I'll create educational content that builds trust.",
    deliverables: ["2x LinkedIn Articles", "1x LinkedIn Video", "3x LinkedIn Posts"],
    price: 1800,
    timeline: "3 weeks",
    status: 'ACCEPTED',
    submittedAt: "2026-04-25",
    engagementRate: 6.2,
    followers: 128000
  },
  {
    id: "pitch-3",
    creatorName: "Travel Diaries",
    creatorHandle: "@traveldiaries",
    creatorAvatar: "TD",
    campaignTitle: "Resort Season Campaign",
    description: "My travel content reaches 520K followers across platforms. I can create stunning visual content for your resort.",
    deliverables: ["3x Instagram Posts", "5x Instagram Stories", "1x YouTube Vlog"],
    price: 3200,
    timeline: "4 weeks",
    status: 'NEGOTIATING',
    submittedAt: "2026-04-27",
    engagementRate: 4.5,
    followers: 520000
  }
];

export default function BrandPitchInbox() {
  const [pitches, setPitches] = useState<Pitch[]>(mockPitches);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);

  const filteredPitches = pitches.filter(pitch => {
    if (filterStatus === 'ALL') return true;
    return pitch.status === filterStatus;
  });

  const updateStatus = (id: string, newStatus: Pitch['status']) => {
    setPitches(prev => prev.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
    setSelectedPitch(null);
  };

  const statusColors = {
    'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'ACCEPTED': 'bg-green-50 text-green-700 border-green-200',
    'REJECTED': 'bg-red-50 text-red-700 border-red-200',
    'NEGOTIATING': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F4' }}>
      {/* Premium Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>
                Pitch Inbox
              </h1>
              <p className="text-sm mt-1" style={{ color: '#92400e' }}>
                Review pitches from creators
              </p>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
              <Inbox className="w-3 h-3 mr-1" />
              {filteredPitches.filter(p => p.status === 'PENDING').length} pending
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {['ALL', 'PENDING', 'ACCEPTED', 'NEGOTIATING', 'REJECTED'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "text-white" : ""}
              style={filterStatus === status ? { backgroundColor: '#1a1a2e' } : {}}
            >
              {status}
              {status !== 'ALL' && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#92400e', color: 'white' }}>
                  {pitches.filter(p => p.status === status).length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Pitch List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPitches.map((pitch, index) => (
              <motion.div
                key={pitch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2"
                  style={{ 
                    backgroundColor: '#ffffff',
                    borderColor: selectedPitch?.id === pitch.id ? '#92400e' : '#e5e7eb'
                  }}
                  onClick={() => setSelectedPitch(pitch)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: '#1a1a2e' }}
                        >
                          {pitch.creatorAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>
                              {pitch.creatorName}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {pitch.creatorHandle}
                            </Badge>
                            <Badge className={statusColors[pitch.status]}>
                              {pitch.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium mb-2" style={{ color: '#92400e' }}>
                            {pitch.campaignTitle}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {pitch.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm" style={{ color: '#92400e' }}>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {pitch.followers.toLocaleString()} followers
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {pitch.engagementRate}% engagement
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${pitch.price}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {pitch.timeline}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPitches.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2" style={{ color: '#1a1a2e' }}>
              No pitches found
            </h3>
            <p style={{ color: '#92400e' }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Pitch Detail Modal */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="border-0 shadow-2xl" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: '#1a1a2e' }}
                    >
                      {selectedPitch.creatorAvatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                        {selectedPitch.creatorName}
                      </h2>
                      <p style={{ color: '#92400e' }}>
                        {selectedPitch.creatorHandle}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedPitch(null)}>
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a2e' }}>
                    {selectedPitch.campaignTitle}
                  </h3>
                  <Badge className={statusColors[selectedPitch.status]}>
                    {selectedPitch.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: '#92400e' }}>
                    Pitch Description
                  </h4>
                  <p className="text-gray-700">{selectedPitch.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: '#92400e' }}>
                    Deliverables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPitch.deliverables.map(d => (
                      <Badge key={d} variant="outline">{d}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                      ${selectedPitch.price}
                    </p>
                    <p className="text-xs" style={{ color: '#92400e' }}>
                      Total Price
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                      {selectedPitch.timeline}
                    </p>
                    <p className="text-xs" style={{ color: '#92400e' }}>
                      Timeline
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
                      {selectedPitch.engagementRate}%
                    </p>
                    <p className="text-xs" style={{ color: '#92400e' }}>
                      Engagement
                    </p>
                  </div>
                </div>

                {selectedPitch.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 text-white"
                      style={{ backgroundColor: '#1a1a2e' }}
                      onClick={() => updateStatus(selectedPitch.id, 'ACCEPTED')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Pitch
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => updateStatus(selectedPitch.id, 'NEGOTIATING')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Negotiate
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateStatus(selectedPitch.id, 'REJECTED')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedPitch.status === 'NEGOTIATING' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" style={{ color: '#92400e' }} />
                      <span className="font-medium" style={{ color: '#1a1a2e' }}>
                        Negotiation Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      You can continue discussing terms with the creator.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
