/**
 * UPI QR Generator Component
 * Generate QR codes for instant UPI payments
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, IndianRupee, Copy, Check } from "lucide-react";

interface UPIQRGeneratorProps {
  upiId?: string;
  amount?: number;
  payeeName?: string;
  onGenerated?: (qrCode: string, upiLink: string) => void;
}

export default function UPIQRGenerator({
  upiId: initialUpiId = "",
  amount: initialAmount,
  payeeName = "AM Creator Analytics",
  onGenerated,
}: UPIQRGeneratorProps) {
  const [upiId, setUpiId] = useState(initialUpiId);
  const [amount, setAmount] = useState(initialAmount?.toString() || "");
  const [note, setNote] = useState("Campaign payout");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/upi-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId,
          amount: parseFloat(amount),
          note,
          payeeName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate QR");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setUpiLink(data.upiLink);
      onGenerated?.(data.qrCode, data.upiLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const copyUpiLink = async () => {
    if (!upiLink) return;
    await navigator.clipboard.writeText(upiLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <QrCode size={18} style={{ color: "#92400e" }} />
          UPI QR Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* UPI ID */}
          <div>
            <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>UPI ID</Label>
            <Input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="creator@upi"
              style={{ marginTop: "4px" }}
            />
          </div>

          {/* Amount */}
          <div>
            <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Amount (₹)</Label>
            <div style={{ position: "relative", marginTop: "4px" }}>
              <IndianRupee
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#92400e",
                  opacity: 0.7,
                }}
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <Label style={{ color: "#1a1a2e", fontSize: "13px" }}>Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Campaign payout"
              style={{ marginTop: "4px" }}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateQR}
            disabled={loading || !upiId || !amount}
            style={{
              width: "100%",
              backgroundColor: "#1a1a2e",
              color: "#F8F7F4",
            }}
          >
            {loading ? "Generating..." : "Generate QR Code"}
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
              }}
            >
              Error: {error}
            </div>
          )}

          {/* QR Code Display */}
          {qrCode && (
            <div
              style={{
                textAlign: "center",
                padding: "16px",
                backgroundColor: "#F8F7F4",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <img
                src={qrCode}
                alt="UPI QR Code"
                style={{
                  maxWidth: "200px",
                  borderRadius: "8px",
                  border: "1px solid #1a1a2e20",
                }}
              />
              <p
                style={{
                  margin: "12px 0 0 0",
                  fontSize: "12px",
                  color: "#92400e",
                  opacity: 0.8,
                }}
              >
                Scan with any UPI app (G Pay, PhonePe, Paytm)
              </p>

              {/* UPI Link */}
              {upiLink && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <code
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #e5e7eb",
                      color: "#1a1a2e",
                      wordBreak: "break-all",
                    }}
                  >
                    {upiLink.slice(0, 50)}...
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyUpiLink}
                    style={{ color: "#92400e" }}
                  >
                    {copied ? (
                      <Check size={16} style={{ color: "#16a34a" }} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#F8F7F4",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                fontWeight: 600,
                color: "#1a1a2e",
              }}
            >
              💡 How to pay:
            </p>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "12px",
                color: "#92400e",
                lineHeight: 1.6,
              }}
            >
              <li>Open any UPI app (G Pay, PhonePe, Paytm)</li>
              <li>Scan QR code above</li>
              <li>Verify amount and payee name</li>
              <li>Complete payment instantly</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
