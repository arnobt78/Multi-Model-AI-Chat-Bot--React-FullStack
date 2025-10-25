import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
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

    // Get events by provider for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const providerEvents = await prisma.event.findMany({
      where: {
        provider: { not: null },
        timestamp: {
          gte: sevenDaysAgo,
        },
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

    // Format provider stats
    const formattedProviderStats = Object.entries(providerStats).map(
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

    // Get events grouped by day for trends
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

    // Get detailed provider data
    const providerData: Record<string, any> = {};

    providerEvents.forEach((event) => {
      if (!event.provider) return;

      if (!providerData[event.provider]) {
        providerData[event.provider] = {
          totalCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          totalDuration: 0,
          timestamps: [] as string[],
        };
      }

      providerData[event.provider].totalCalls++;

      if (event.success) {
        providerData[event.provider].successfulCalls++;
      } else {
        providerData[event.provider].failedCalls++;
      }

      if (event.duration) {
        providerData[event.provider].totalDuration += event.duration;
      }

      providerData[event.provider].timestamps.push(
        event.timestamp.toISOString()
      );
    });

    const formattedProviderData = Object.entries(providerData).map(
      ([provider, data]) => ({
        provider,
        totalCalls: data.totalCalls,
        successfulCalls: data.successfulCalls,
        failedCalls: data.failedCalls,
        successRate: (data.successfulCalls / data.totalCalls) * 100,
        avgDuration:
          data.totalCalls > 0
            ? Math.round(data.totalDuration / data.totalCalls)
            : 0,
        timestamps: data.timestamps,
      })
    );

    return res.status(200).json({
      usage: {
        totalEvents,
        totalSessions,
        eventsByType,
        recentEvents,
        recentSessions: recentSessions.length,
      },
      insights: {
        providerStats: formattedProviderStats,
        dailyEvents,
      },
      providers: formattedProviderData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
