import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "./_lib/prisma";
import { allowRequest, clientIp } from "./_lib/rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!allowRequest(`usage:${clientIp(req)}`, 40, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    // Get total events count
    const totalEvents = await prisma.event.count();

    // Get total sessions
    const totalSessions = await prisma.session.count();

    // Get events by type
    const eventsByType = await prisma.event.groupBy({
      by: ["eventType"],
      _count: true,
    });

    // Get events in last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentEvents = await prisma.event.count({
      where: {
        timestamp: {
          gte: yesterday,
        },
      },
    });

    // Get unique sessions in last 24 hours
    const recentSessions = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: yesterday,
        },
      },
      distinct: ["sessionId"],
    });

    return res.status(200).json({
      totalEvents,
      totalSessions,
      eventsByType,
      recentEvents,
      recentSessions: recentSessions.length,
    });
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
