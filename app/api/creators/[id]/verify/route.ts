/**
 * Creator Verification API
 * POST /api/creators/[id]/verify
 * Submit verification documents (ID, bank, video)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, getPublicUrl } from "@/lib/minio"; // We'll create this helper

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const formData = await request.formData();

    // ID Document
    const idType = formData.get("idType") as string;
    const idNumber = formData.get("idNumber") as string;
    const idFront = formData.get("idFront") as File;
    const idBack = formData.get("idBack") as File | null;

    // Bank Details
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const ifscCode = formData.get("ifscCode") as string;
    const upiId = formData.get("upiId") as string | null;

    // Video Selfie
    const video = formData.get("video") as File | null;

    // Upload ID front to MinIO
    const frontBuffer = Buffer.from(await idFront.arrayBuffer());
    const frontUrl = await putObject(
      `verification/${id}/id-front-${Date.now()}`,
      frontBuffer,
      idFront.type
    );

    let backUrl: string | null = null;
    if (idBack) {
      const backBuffer = Buffer.from(await idBack.arrayBuffer());
      backUrl = await putObject(
        `verification/${id}/id-back-${Date.now()}`,
        backBuffer,
        idBack.type
      );
    }

    // Upload video if provided
    let videoUrl: string | null = null;
    if (video) {
      const videoBuffer = Buffer.from(await video.arrayBuffer());
      videoUrl = await putObject(
        `verification/${id}/video-${Date.now()}`,
        videoBuffer,
        video.type
      );
    }

    // Mask ID number (show last 4 digits)
    const maskedIdNumber =
      idNumber.length > 4
        ? "X".repeat(idNumber.length - 4) + idNumber.slice(-4)
        : idNumber;

    // Encrypt account number (simple base64 for MVP)
    const encryptedAccount = Buffer.from(accountNumber).toString("base64");

    // Upsert verification record
    const verification = await prisma.creatorVerification.upsert({
      where: { creatorId: id },
      update: {
        idType,
        idNumber: maskedIdNumber,
        idFrontUrl: frontUrl,
        idBackUrl: backUrl,
        bankName,
        accountNumber: encryptedAccount,
        ifscCode,
        upiId,
        videoUrl,
        status: "IN_REVIEW",
        updatedAt: new Date(),
      },
      create: {
        creatorId: id,
        idType,
        idNumber: maskedIdNumber,
        idFrontUrl: frontUrl,
        idBackUrl: backUrl,
        bankName,
        accountNumber: encryptedAccount,
        ifscCode,
        upiId,
        videoUrl,
        status: "IN_REVIEW",
      },
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}

// GET verification status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const verification = await prisma.creatorVerification.findUnique({
      where: { creatorId: id },
    });

    if (!verification) {
      return NextResponse.json(
        { status: "NOT_STARTED" },
        { status: 200 }
      );
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error("Verification fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
