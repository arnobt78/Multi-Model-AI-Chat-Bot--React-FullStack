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

    // ===== TIME & TRENDS DATA =====
    // Group events by hour for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEvents = await prisma.event.findMany({
      where: {
        timestamp: { gte: todayStart },
      },
      select: { timestamp: true },
    });

    const hourlyActivity: Record<string, number> = {};
    todayEvents.forEach((event) => {
      const hour = event.timestamp.getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    // ===== USER ENGAGEMENT DATA =====
    // Calculate average conversation length (events per session)
    const sessionsWithEvents = await prisma.event.groupBy({
      by: ["sessionId"],
      _count: { sessionId: true },
    });

    const eventCounts = sessionsWithEvents.map((s) => s._count.sessionId);
    const avgEventsPerSession = eventCounts.length > 0 
      ? Math.round(eventCounts.reduce((a, b) => a + b, 0) / eventCounts.length)
      : 0;

    // Session duration (estimate based on first/last event per session)
    const sessionDurations: Record<string, any> = {};
    const allEvents = await prisma.event.findMany({
      orderBy: { timestamp: "asc" },
      select: { sessionId: true, timestamp: true },
    });

    allEvents.forEach((event) => {
      if (!sessionDurations[event.sessionId]) {
        sessionDurations[event.sessionId] = {
          first: event.timestamp,
          last: event.timestamp,
        };
      } else {
        if (event.timestamp < sessionDurations[event.sessionId].first) {
          sessionDurations[event.sessionId].first = event.timestamp;
        }
        if (event.timestamp > sessionDurations[event.sessionId].last) {
          sessionDurations[event.sessionId].last = event.timestamp;
        }
      }
    });

    const durations = Object.values(sessionDurations).map((s: any) => 
      (s.last - s.first) / 1000 / 60 // Convert to minutes
    );
    const avgSessionDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    // ===== ERROR MONITORING DATA =====
    const failedEvents = providerEvents.filter((e) => !e.success);
    const errorsByProvider: Record<string, number> = {};
    failedEvents.forEach((event) => {
      if (event.provider) {
        errorsByProvider[event.provider] = (errorsByProvider[event.provider] || 0) + 1;
      }
    });

    // ===== PERFORMANCE DATA =====
    const durationsArray = providerEvents
      .filter((e) => e.duration !== null)
      .map((e) => e.duration as number)
      .sort((a, b) => a - b);

    const performance = {
      fastRequests: durationsArray.filter((d) => d < 1000).length,
      normalRequests: durationsArray.filter((d) => d >= 1000 && d < 3000).length,
      slowRequests: durationsArray.filter((d) => d >= 3000).length,
      minDuration: durationsArray.length > 0 ? durationsArray[0] : 0,
      maxDuration: durationsArray.length > 0 ? durationsArray[durationsArray.length - 1] : 0,
      medianDuration: durationsArray.length > 0 
        ? durationsArray[Math.floor(durationsArray.length / 2)] 
        : 0,
    };

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
      timeAndTrends: {
        hourlyActivity,
        dailyEvents,
        peakHour: Object.entries(hourlyActivity).reduce((a, b) => 
          hourlyActivity[a[0]] > hourlyActivity[b[0]] ? a : b, ["0", 0])[0],
      },
      userEngagement: {
        avgEventsPerSession: avgEventsPerSession,
        avgSessionDuration: avgSessionDuration,
        totalConversations: sessionsWithEvents.length,
      },
      errorMonitoring: {
        totalErrors: failedEvents.length,
        errorsByProvider,
        successRate: totalEvents > 0 ? ((totalEvents - failedEvents.length) / totalEvents) * 100 : 0,
      },
      performance,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
