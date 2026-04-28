"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadStage } from "@prisma/client";
import {
  Mail,
  DollarSign,
  User,
  GripVertical,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Presentation,
} from "lucide-react";

interface Lead {
  id: string;
  companyName: string | null;
  email: string | null;
  dealValue: number | null;
  currency: string | null;
  stage: LeadStage;
  creator: {
    id: string;
    displayName: string;
    niche: string | null;
  };
  campaign: {
    id: string;
    title: string;
  };
  convertedAt: string | null;
}

const STAGE_CONFIG = {
  [LeadStage.MQL]: {
    label: "MQL",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  [LeadStage.SQL]: {
    label: "SQL",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Clock,
  },
  [LeadStage.OPPORTUNITY]: {
    label: "Opportunity",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: TrendingUp,
  },
  [LeadStage.CLOSED_WON]: {
    label: "Closed Won",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  [LeadStage.CLOSED_LOST]: {
    label: "Closed Lost",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const STAGE_ORDER = [
  LeadStage.MQL,
  LeadStage.SQL,
  LeadStage.OPPORTUNITY,
  LeadStage.CLOSED_WON,
  LeadStage.CLOSED_LOST,
];

// Sortable Lead Card Component
function SortableLeadCard({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stageConfig = STAGE_CONFIG[lead.stage];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-grab active:cursor-grabbing"
    >
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-[#F8F7F4]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
              <div>
                <h4 className="font-medium text-sm text-[#3A3941]">
                  {lead.companyName || "Unnamed Lead"}
                </h4>
                {lead.email && (
                  <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                    <Mail className="h-3 w-3 mr-1" />
                    {lead.email}
                  </p>
                )}
              </div>
            </div>
            {lead.dealValue && (
              <span className="font-mono text-sm font-medium text-[#C19A5B]">
                ${lead.dealValue.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs text-muted-foreground ml-6">
            {lead.creator && (
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {lead.creator.displayName}
              </span>
            )}
            {lead.campaign && (
              <span className="flex items-center">
                <Presentation className="h-3 w-3 mr-1" />
                {lead.campaign.title}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({
  stage,
  leads,
}: {
  stage: LeadStage;
  leads: Lead[];
}) {
  const stageConfig = STAGE_CONFIG[stage];
  const Icon = stageConfig.icon;

  return (
    <div className="flex-1 min-w-[280px]">
      <Card className="border-border/50 bg-background/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-[#C19A5B]" />
              <span className="text-[#3A3941]">{stageConfig.label}</span>
            </div>
            <Badge variant="outline" className={stageConfig.color}>
              {leads.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SortableContext
            items={leads.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border/30 rounded-lg">
                No leads yet
              </div>
            ) : (
              leads.map((lead) => <SortableLeadCard key={lead.id} lead={lead} />)
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Kanban Board Component
export default function LeadKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Group leads by stage
  const leadsByStage = STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = leads.filter((lead) => lead.stage === stage);
      return acc;
    },
    {} as Record<LeadStage, Lead[]>
  );

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Determine new stage from the container (over.id is stage if dropping on column)
    let newStage: LeadStage | undefined;
    
    // Check if dropping on a column (stage) or another lead
    const overStage = Object.values(LeadStage).find(
      (stage) => stage === over.id
    );
    
    if (overStage) {
      newStage = overStage;
    } else {
      // Dropping on another lead - get that lead's stage
      const overLead = leads.find((l) => l.id === over.id);
      if (overLead) {
        newStage = overLead.stage;
      }
    }

    if (!newStage || newStage === lead.stage) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage! } : l))
    );

    // Send update to API
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!res.ok) {
        // Rollback on error
        fetchLeads();
      }
    } catch (error) {
      console.error("Failed to update lead stage:", error);
      fetchLeads(); // Refresh on error
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id);
    setActiveLead(lead || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            leads={leadsByStage[stage] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <Card className="border-border/50 shadow-lg bg-[#F8F7F4] w-[280px]">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm text-[#3A3941]">
                {activeLead.companyName || "Unnamed Lead"}
              </h4>
              {activeLead.email && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeLead.email}
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
