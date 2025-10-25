import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get events by provider
    const providerEvents = await prisma.event.findMany({
      where: {
        provider: { not: null },
      },
      select: {
        provider: true,
        success: true,
        duration: true,
        timestamp: true,
      },
    });

    // Calculate provider statistics
    const providerStats: Record<string, any> = {};

    providerEvents.forEach((event) => {
      if (!event.provider) return;

      if (!providerStats[event.provider]) {
        providerStats[event.provider] = {
          totalCalls: 0,
          successCount: 0,
          totalDuration: 0,
        };
      }

      providerStats[event.provider].totalCalls++;
      if (event.success) {
        providerStats[event.provider].successCount++;
      }
      if (event.duration) {
        providerStats[event.provider].totalDuration += event.duration;
      }
    });

    // Calculate success rates and avg duration
    const formattedStats = Object.entries(providerStats).map(
      ([provider, stats]) => ({
        provider,
        totalCalls: stats.totalCalls,
        successRate: (stats.successCount / stats.totalCalls) * 100,
        avgDuration:
          stats.totalCalls > 0
            ? Math.round(stats.totalDuration / stats.totalCalls)
            : 0,
      })
    );

    // Get events grouped by hour for trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const hourlyEvents = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        timestamp: true,
        eventType: true,
        provider: true,
      },
    });

    // Group by date
    const dailyEvents: Record<string, number> = {};
    hourlyEvents.forEach((event) => {
      const date = event.timestamp.toISOString().split("T")[0];
      dailyEvents[date] = (dailyEvents[date] || 0) + 1;
    });

    return res.status(200).json({
      providerStats: formattedStats,
      dailyEvents,
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
