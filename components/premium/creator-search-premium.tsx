/**
 * SUPER PREMIUM Creator Search Component
 * Bloomberg × McKinsey Design
 * Brand view: Search & filter creators with luxury aesthetics
 */

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  TrendingUp, 
  DollarSign,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for creators
const creators = [
  {
    id: "1",
    name: "Rahul Sharma",
    niche: "B2B SaaS",
    platform: "INSTAGRAM",
    followers: 85000,
    engagementRate: 8.7,
    price: "₹15,000",
    location: "Mumbai",
    recentCampaigns: 12,
    avatar: "/api/avatar/1",
  },
  {
    id: "2",
    name: "Priya Patel",
    niche: "Tech Reviews",
    platform: "YOUTUBE",
    followers: 120000,
    engagementRate: 6.2,
    price: "₹25,000",
    location: "Bangalore",
    recentCampaigns: 8,
    avatar: "/api/avatar/2",
  },
  // ... more creators
];

// FIXED: Use Globe as fallback instead of problematic icons
const getPlatformIcon = (platform: string) => {
  // All platforms use Globe to avoid import issues
  return <Globe size={16} style={{ color: "#92400e" }} />;
};

export default function CreatorSearchPremium() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform =
        selectedPlatform === "ALL" || creator.platform === selectedPlatform;
      return matchesSearch && matchesPlatform;
    });
  }, [searchTerm, selectedPlatform, budgetFilter]);

  const toggleCreatorSelection = (id: string) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#1a1a2e",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}>
            Premium Creator Search
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Find B2B creators with full-funnel attribution data
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Badge style={{ backgroundColor: "#92400e", color: "#F8F7F4", padding: "8px 16px" }}>
            {filteredCreators.length} Creators Found
          </Badge>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
          <Search size={18} style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
          }} />
          <Input
            placeholder="Search by name, niche, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: "40px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px 12px 12px 40px",
            }}
          />
        </div>
        <Button
          variant="outline"
          style={{
            borderColor: "#92400e",
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Filter size={16} /> Filters
        </Button>
        <Button
          variant="outline"
          style={{
            borderColor: "#92400e",
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SlidersHorizontal size={16} /> Sort By
        </Button>
      </motion.div>

      {/* Selected Creators Summary */}
      {selectedCreators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            backgroundColor: "#1a1a2e",
            color: "#F8F7F4",
            padding: "16px 24px",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Users size={20} />
            <span style={{ fontWeight: 600 }}>
              {selectedCreators.length} creators selected
            </span>
          </div>
          <Button
            style={{
              backgroundColor: "#92400e",
              color: "#F8F7F4",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add to Campaign
          </Button>
        </motion.div>
      )}

      {/* Creator Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "24px",
      }}>
        <AnimatePresence>
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              style={{ cursor: "pointer" }}
              onClick={() => toggleCreatorSelection(creator.id)}
            >
              <Card style={{
                borderLeft: selectedCreators.includes(creator.id)
                  ? "4px solid #92400e"
                  : "1px solid #e5e7eb",
                backgroundColor: selectedCreators.includes(creator.id)
                  ? "#F8F7F4"
                  : "#ffffff",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.2s",
              }}>
                <CardContent style={{ padding: "24px" }}>
                  {/* Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#1a1a2e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#F8F7F4",
                        fontWeight: 700,
                      }}>
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1a1a2e",
                          marginBottom: "4px",
                        }}>
                          {creator.name}
                        </h3>
                        <p style={{ fontSize: "14px", color: "#6b7280" }}>
                          {creator.niche}
                        </p>
                      </div>
                    </div>
                    {getPlatformIcon(creator.platform)}
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "16px",
                  }}>
                    <div style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: "#F8F7F4",
                      borderRadius: "8px",
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#1a1a2e",
                      }}>
                        {creator.followers.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#92400e",
                        marginTop: "4px",
                      }}>
                        Followers
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: "#F8F7F4",
                      borderRadius: "8px",
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#1a1a2e",
                      }}>
                        {creator.engagementRate}%
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#92400e",
                        marginTop: "4px",
                      }}>
                        Engagement
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center",
                      padding: "12px",
                      backgroundColor: "#F8F7F4",
                      borderRadius: "8px",
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#1a1a2e",
                      }}>
                        {creator.price}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#92400e",
                        marginTop: "4px",
                      }}>
                        Per Post
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#92400e",
                    }}>
                      <MapPin size={16} />
                      {creator.location}
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#92400e",
                    }}>
                      <TrendingUp size={16} />
                      {creator.recentCampaigns} campaigns
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCreators.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "64px 24px",
          }}
        >
          <Users size={64} style={{ color: "#d1d5db", marginBottom: "16px" }} />
          <h3 style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#1a1a2e",
            marginBottom: "8px",
          }}>
            No creators found
          </h3>
          <p style={{ fontSize: "16px", color: "#92400e" }}>
            Try adjusting your filters or search terms
          </p>
        </motion.div>
      )}
    </div>
  );
}
