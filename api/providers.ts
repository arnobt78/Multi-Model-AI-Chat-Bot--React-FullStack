import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "./_lib/prisma";
import { allowRequest, clientIp } from "./_lib/rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!allowRequest(`providers:${clientIp(req)}`, 40, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    // Get all events with providers
    const events = await prisma.event.findMany({
      where: {
        provider: { not: null },
        eventType: "api_call",
      },
      select: {
        provider: true,
        success: true,
        duration: true,
        timestamp: true,
      },
    });

    // Group by provider
    const providerData: Record<string, any> = {};

    events.forEach((event) => {
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

    // Format the data
    const formattedData = Object.entries(providerData).map(
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

    return res.status(200).json({ providers: formattedData });
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
