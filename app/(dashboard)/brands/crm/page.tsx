"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nango from "@nangohq/frontend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  Cloud,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import LeadKanban from "@/components/leads/lead-kanban";

interface CrmConnection {
  id: string;
  type: "SALESFORCE" | "HUBSPOT";
  accessToken: string; // Nango connection_id
  lastSync: string | null;
  syncErrors: any;
  syncStatus?: {
    id: string;
    status: string;
    latest_action: string;
  };
}

export default function BrandCrmPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<CrmConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [nango, setNango] = useState<Nango | null>(null);

  useEffect(() => {
    // Initialize Nango frontend SDK
    const nangoInstance = new Nango({
      host: process.env.NEXT_PUBLIC_NANGO_BASE_URL || "http://localhost:3003",
    });
    setNango(nangoInstance);
    
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/crm/connections");
      const data = await res.json();
      if (data.connections) {
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Failed to fetch CRM connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (crmType: "salesforce" | "hubspot") => {
    if (!nango) {
      alert("Nango SDK not initialized. Please refresh the page.");
      return;
    }

    setConnecting(crmType);
    try {
      // Generate a unique connection ID
      const connectionId = `${crmType}-${Date.now()}`;

      // Trigger Nango OAuth flow (opens popup)
      await nango.auth(crmType, connectionId);

      // After successful OAuth, save the connection to our backend
      const callbackRes = await fetch("/api/crm/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          connectionId, 
          providerConfigKey: crmType 
        }),
      });

      const callbackData = await callbackRes.json();

      if (callbackData.success) {
        // Refresh connections list
        await fetchConnections();
      } else {
        throw new Error(callbackData.error || "Failed to save connection");
      }
    } catch (error: any) {
      console.error("Failed to connect CRM:", error);
      alert(`Failed to connect to ${crmType}: ${error.message}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleSync = async (connectionId: string) => {
    setSyncing(connectionId);
    try {
      const res = await fetch("/api/crm/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, syncType: "all" }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh connections to show updated sync status
        await fetchConnections();
      }
    } catch (error) {
      console.error("Failed to sync CRM:", error);
    } finally {
      setSyncing(null);
    }
  };

  const handleDelete = async (connectionId: string) => {
    if (!confirm("Are you sure you want to delete this CRM connection?")) {
      return;
    }

    try {
      const res = await fetch(`/api/crm/connections?id=${connectionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchConnections();
      }
    } catch (error) {
      console.error("Failed to delete connection:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      "SUCCESS": { color: "bg-green-100 text-green-800", text: "Connected" },
      "RUNNING": { color: "bg-blue-100 text-blue-800", text: "Syncing..." },
      "STOPPED": { color: "bg-gray-100 text-gray-800", text: "Stopped" },
      "PAUSED": { color: "bg-yellow-100 text-yellow-800", text: "Paused" },
    };
    const config = statusMap[status] || { color: "bg-gray-100 text-gray-800", text: status };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your CRM via Nango (self-hosted, open-source) to sync leads and track pipeline revenue
        </p>
      </div>

      {/* Nango Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Cloud className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Nango Self-Hosted</h3>
              <p className="text-sm text-blue-700 mt-1">
                AM Creator Analytics uses Nango (open-source) for CRM integrations. 
                This eliminates third-party SaaS costs while maintaining full data privacy.
              </p>
              <a
                href="https://docs.nango.dev/self-hosting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center mt-2"
              >
                Self-hosting docs
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Connect a CRM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => handleConnect("salesforce")}
              disabled={connecting === "salesforce"}
            >
              <div className="p-2 rounded-lg bg-blue-50">
                <Cloud className="h-6 w-6 text-blue-500" />
              </div>
              <span>{connecting === "salesforce" ? "Connecting..." : "Connect Salesforce"}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => handleConnect("hubspot")}
              disabled={connecting === "hubspot"}
            >
              <div className="p-2 rounded-lg bg-orange-50">
                <Cloud className="h-6 w-6 text-orange-500" />
              </div>
              <span>{connecting === "hubspot" ? "Connecting..." : "Connect HubSpot"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Connected CRMs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : connections.length === 0 ? (
            <p className="text-muted-foreground">No CRM connections yet. Connect one above.</p>
          ) : (
            <div className="space-y-4">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${conn.type === "SALESFORCE" ? "bg-blue-50" : "bg-orange-50"}`}>
                      <Cloud className={`h-6 w-6 ${conn.type === "SALESFORCE" ? "text-blue-500" : "text-orange-500"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{conn.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Connection ID: {conn.accessToken}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {conn.lastSync ? new Date(conn.lastSync).toLocaleString() : "Never"}
                      </p>
                      {conn.syncStatus && getStatusBadge(conn.syncStatus.status)}
                      {conn.syncErrors && (
                        <p className="text-sm text-red-500 mt-1">
                          <AlertCircle className="inline h-4 w-4 mr-1" />
                          Sync errors detected
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(conn.id)}
                      disabled={syncing === conn.id}
                    >
                      {syncing === conn.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(conn.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Pipeline Kanban */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#C19A5B]" />
            <span>Lead Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeadKanban />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Plug className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-medium">About CRM Integrations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Connecting your CRM allows AM Creator Analytics to:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Sync leads generated from creator campaigns</li>
                <li>Track pipeline revenue (MQL → SQL → Closed Won)</li>
                <li>Preserve attribution data even when contacts merge in your CRM</li>
                <li>Generate accurate ROI reports for your campaigns</li>
                <li><strong>Zero ongoing SaaS costs</strong> with self-hosted Nango</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
