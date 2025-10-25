import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId, eventType, provider, success, duration, metadata } =
      req.body;

    // Validate required fields
    if (!sessionId || !eventType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create event record
    const event = await prisma.event.create({
      data: {
        sessionId,
        eventType,
        provider: provider || null,
        success: success !== undefined ? success : true,
        duration: duration || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return res.status(200).json({ success: true, id: event.id });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
