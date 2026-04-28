"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@amcreatoranalytics.com",
    subtext: "We'll respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
    subtext: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Innovation Drive",
    subtext: "Palo Alto, CA 94301",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Monday - Friday",
    subtext: "9:00 AM - 6:00 PM EST",
  },
];

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact AM Creator Analytics",
  description: "Get in touch with our team for sales, support, or partnerships.",
  mainEntity: {
    "@type": "Organization",
    name: "AM Creator Analytics",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@amcreatoranalytics.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@amcreatoranalytics.com",
      },
    ],
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setSubmitMessage(data.message || "Thank you! We'll respond within 24 hours.");
        setFormData({ name: "", email: "", subject: "", type: "", message: "" });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={contactPageSchema} />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're a brand looking for enterprise solutions or a creator
              needing support — we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-foreground font-heading mb-8">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 border-border/50 bg-card">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-foreground">{info.details}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {info.subtext}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground font-heading mb-8">
                Send Us a Message
              </h2>
              <Card className="p-8 border-border/50 bg-card">
                {submitStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground">{submitMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Smith"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Enterprise Inquiry"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type</Label>
                      <select
                        id="type"
                        name="type"
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                        required
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="">Select a type...</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Creator Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Press / Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center space-x-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">{submitMessage}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground font-heading mb-4">
            Visit Our Office
          </h2>
          <p className="text-muted-foreground mb-8">
            123 Innovation Drive, Palo Alto, CA 94301
          </p>
          <div className="bg-card border border-border rounded-lg h-64 flex items-center justify-center">
            <p className="text-muted-foreground">
              Map integration coming soon
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
