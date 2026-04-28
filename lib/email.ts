import { Resend } from "resend";
import { createElement } from "react";
import { Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Link } from "@react-email/components";

// Lazy initialization of Resend
let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set. Email sending will be disabled.");
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const resend = getResend();
    
    if (!resend) {
      console.warn("Resend not initialized. Skipping email send.");
      return { success: false, error: "Email service not configured" };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "AM Creator Analytics <noreply@amcreatoranalytics.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

// Email verification template
export function VerificationEmail({ name, verificationUrl }: { name: string; verificationUrl: string }) {
  return createElement(
    Html,
    null,
    createElement(Head, null),
    createElement(
      Body,
      { style: { backgroundColor: "#F8F7F4", fontFamily: "Inter, sans-serif" } },
      createElement(
        Container,
        { style: { maxWidth: "600px", margin: "0 auto", padding: "20px" } },
        createElement(
          Section,
          { style: { backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", textAlign: "center" } },
          createElement(Heading, { style: { color: "#3A3941", fontSize: "24px", marginBottom: "20px" } }, "Verify Your Email"),
          createElement(Text, { style: { color: "#666666", fontSize: "16px", marginBottom: "30px" } }, `Hi ${name},`),
          createElement(Text, { style: { color: "#666666", fontSize: "14px", marginBottom: "30px" } }, "Please verify your email address to activate your AM Creator Analytics account."),
          createElement(
            Button,
            { href: verificationUrl, style: { backgroundColor: "#C19A5B", color: "#ffffff", padding: "12px 30px", borderRadius: "6px", textDecoration: "none", fontSize: "16px", fontWeight: "600" } },
            "Verify Email"
          ),
          createElement(Text, { style: { color: "#999999", fontSize: "12px", marginTop: "30px" } }, "This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.")
        )
      )
    )
  );
}

// Password reset email template
export function PasswordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  return createElement(
    Html,
    null,
    createElement(Head, null),
    createElement(
      Body,
      { style: { backgroundColor: "#F8F7F4", fontFamily: "Inter, sans-serif" } },
      createElement(
        Container,
        { style: { maxWidth: "600px", margin: "0 auto", padding: "20px" } },
        createElement(
          Section,
          { style: { backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", textAlign: "center" } },
          createElement(Heading, { style: { color: "#3A3941", fontSize: "24px", marginBottom: "20px" } }, "Reset Your Password"),
          createElement(Text, { style: { color: "#666666", fontSize: "16px", marginBottom: "30px" } }, `Hi ${name},`),
          createElement(Text, { style: { color: "#666666", fontSize: "14px", marginBottom: "30px" } }, "Click the button below to reset your password. This link expires in 1 hour."),
          createElement(
            Button,
            { href: resetUrl, style: { backgroundColor: "#C19A5B", color: "#ffffff", padding: "12px 30px", borderRadius: "6px", textDecoration: "none", fontSize: "16px", fontWeight: "600" } },
            "Reset Password"
          ),
          createElement(Text, { style: { color: "#999999", fontSize: "12px", marginTop: "30px" } }, "If you didn't request a password reset, you can safely ignore this email.")
        )
      )
    )
  );
}

// Welcome email template
export function WelcomeEmail({ name }: { name: string }) {
  return createElement(
    Html,
    null,
    createElement(Head, null),
    createElement(
      Body,
      { style: { backgroundColor: "#F8F7F4", fontFamily: "Inter, sans-serif" } },
      createElement(
        Container,
        { style: { maxWidth: "600px", margin: "0 auto", padding: "20px" } },
        createElement(
          Section,
          { style: { backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", textAlign: "center" } },
          createElement(Heading, { style: { color: "#3A3941", fontSize: "24px", marginBottom: "20px" } }, "Welcome to AM Creator Analytics! 🎉"),
          createElement(Text, { style: { color: "#666666", fontSize: "16px", marginBottom: "20px" } }, `Hi ${name},`),
          createElement(Text, { style: { color: "#666666", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" } }, "Your email has been verified! You now have full access to AM Creator Analytics. Start by exploring creator discovery or setting up your media kit."),
          createElement(
            Button,
            { href: `${process.env.NEXTAUTH_URL}/dashboard`, style: { backgroundColor: "#C19A5B", color: "#ffffff", padding: "12px 30px", borderRadius: "6px", textDecoration: "none", fontSize: "16px", fontWeight: "600" } },
            "Go to Dashboard"
          )
        )
      )
    )
  );
}
