import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Users,
  Activity,
  Database,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertTriangle,
  Gauge,
  Timer,
} from "lucide-react";
import "./BusinessInsights.css";

interface UsageStats {
  totalEvents: number;
  totalSessions: number;
  eventsByType: { eventType: string; _count: number }[];
  recentEvents: number;
  recentSessions: number;
}

interface ProviderData {
  provider: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  avgDuration: number;
  timestamps: string[];
}

interface InsightsData {
  providerStats: {
    provider: string;
    totalCalls: number;
    successRate: number;
    avgDuration: number;
  }[];
  dailyEvents: Record<string, number>;
}

interface TimeAndTrendsData {
  hourlyActivity: Record<string, number>;
  dailyEvents: Record<string, number>;
  peakHour: string;
}

interface UserEngagementData {
  avgEventsPerSession: number;
  avgSessionDuration: number;
  totalConversations: number;
}

interface ErrorMonitoringData {
  totalErrors: number;
  errorsByProvider: Record<string, number>;
  successRate: number;
}

interface PerformanceData {
  fastRequests: number;
  normalRequests: number;
  slowRequests: number;
  minDuration: number;
  maxDuration: number;
  medianDuration: number;
}

interface BusinessInsightsProps {
  onBack: () => void;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("app-overview");
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [timeAndTrends, setTimeAndTrends] = useState<TimeAndTrendsData | null>(
    null,
  );
  const [userEngagement, setUserEngagement] =
    useState<UserEngagementData | null>(null);
  const [errorMonitoring, setErrorMonitoring] =
    useState<ErrorMonitoringData | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // In development, skip API call and show empty state
    if (import.meta.env.DEV) {
      console.log(
        "📊 Business Insights: Running in dev mode - API not available",
      );
      setLoading(false);
      return;
    }

    try {
      // Use single dashboard endpoint for better performance
      const dashboardRes = await fetch("/api/dashboard");

      if (!dashboardRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboard = await dashboardRes.json();

      // Set data from single response
      setUsageStats(dashboard.usage);
      setInsightsData(dashboard.insights);
      setProviderData(dashboard.providers || []);
      setTimeAndTrends(dashboard.timeAndTrends);
      setUserEngagement(dashboard.userEngagement);
      setErrorMonitoring(dashboard.errorMonitoring);
      setPerformance(dashboard.performance);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageUsage = () => {
    let totalSize = 0;
    for (let key in localStorage) {
      // Prefer Object.prototype.hasOwnProperty.call (eslint no-prototype-builtins)
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage[key].length;
      }
    }
    return (totalSize / 1024).toFixed(2); // KB
  };

  // Three consolidated tabs (former 8 panels merged — content preserved)
  const tabs = [
    { id: "app-overview", label: "Application Overview", icon: Activity },
    { id: "provider-usage", label: "Provider & Usage", icon: MessageSquare },
    { id: "system-health", label: "System Health", icon: Gauge },
  ];

  if (loading) {
    return (
      <div className="business-insights-container">
        <div className="loading-state">
          <Activity className="loading-icon" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="business-insights-container">
      <div className="start-page-bg">
        <img src="/chatbot.svg" alt="Chatbot" className="bg-chatbot-icon" />
      </div>

      <div className="insights-header">
        <div className="header-content">
          <button onClick={onBack} className="back-btn">
            ← Back to Chat
          </button>
          <div className="header-title">
            <Database className="header-icon" />
            <div>
              <h1>Application Insights</h1>
              <p>
                Analytics, Usage, Trends, Engagement, Errors, & Performance
                Metrics
              </p>
            </div>
          </div>
        </div>
        <button onClick={fetchData} className="refresh-btn">
          <Activity size={20} />
          Refresh
        </button>
      </div>

      <div className="tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="tab-content">
        {activeTab === "app-overview" && (
          <div className="insights-panel">
            <h2 className="insights-section-title">Overview</h2>
            <div className="overview-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <MessageSquare className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Total Events</h3>
                  <p className="stat-value">{usageStats?.totalEvents || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Users className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Total Sessions</h3>
                  <p className="stat-value">{usageStats?.totalSessions || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Zap className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Recent Events (24h)</h3>
                  <p className="stat-value">{usageStats?.recentEvents || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Activity className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Active Sessions</h3>
                  <p className="stat-value">{usageStats?.recentSessions || 0}</p>
                </div>
              </div>

              <div className="stat-card wide">
                <div className="stat-icon-wrapper">
                  <Database className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Storage Used</h3>
                  <p className="stat-value">{getStorageUsage()} KB</p>
                </div>
              </div>

              <div className="stat-card wide">
                <div className="stat-icon-wrapper">
                  <Clock className="stat-icon" />
                </div>
                <div className="stat-info">
                  <h3>Uptime Indicator</h3>
                  <p className="stat-value">100%</p>
                </div>
              </div>
            </div>

            <h2 className="insights-section-title">User Engagement</h2>
            <div className="engagement-grid">
              <div className="engagement-card">
                <Users className="engagement-icon" />
                <h3>Avg Events per Session</h3>
                <p className="engagement-value">
                  {userEngagement?.avgEventsPerSession || 0}
                </p>
              </div>

              <div className="engagement-card">
                <Timer className="engagement-icon" />
                <h3>Avg Session Duration</h3>
                <p className="engagement-value">
                  {userEngagement?.avgSessionDuration || 0} minutes
                </p>
              </div>

              <div className="engagement-card">
                <MessageSquare className="engagement-icon" />
                <h3>Total Conversations</h3>
                <p className="engagement-value">
                  {userEngagement?.totalConversations || 0}
                </p>
              </div>
            </div>

            <h2 className="insights-section-title">Time & Trends</h2>
            <div className="time-trends-grid">
              <div className="trend-card">
                <BarChart3 className="trend-icon" />
                <h3>Peak Activity Hour</h3>
                <p className="trend-value">
                  {timeAndTrends?.peakHour
                    ? `${timeAndTrends.peakHour}:00 - ${
                        parseInt(timeAndTrends.peakHour) + 1
                      }:00`
                    : "N/A"}
                </p>
              </div>

              <div className="trend-card">
                <TrendingUp className="trend-icon" />
                <h3>{"Today's Activity"}</h3>
                <p className="trend-value">
                  {Object.values(timeAndTrends?.hourlyActivity || {}).reduce(
                    (a, b) => a + b,
                    0,
                  ) || 0}{" "}
                  events
                </p>
              </div>

              <div className="trend-card trend-card-chart">
                <Clock className="trend-icon" />
                <h3>Hourly Breakdown</h3>
                <div className="hourly-chart" role="img" aria-label="Hourly event counts">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hourValue =
                      timeAndTrends?.hourlyActivity[i.toString()] || 0;
                    const maxValue = Math.max(
                      ...Object.values(timeAndTrends?.hourlyActivity || {}),
                      1,
                    );
                    const barHeight = Math.max(
                      (hourValue / maxValue) * 200,
                      hourValue > 0 ? 8 : 3,
                    );
                    const tip = `Hour ${i}:00–${i + 1}:00 — ${hourValue} event${
                      hourValue === 1 ? "" : "s"
                    }`;

                    return (
                      <div
                        key={i}
                        className="hour-bar-container"
                        tabIndex={0}
                        title={tip}
                      >
                        <span
                          className={`hour-bar-value${
                            hourValue === 0 ? " is-zero" : ""
                          }`}
                        >
                          {hourValue}
                        </span>
                        <div
                          className="hour-bar"
                          style={{ height: `${barHeight}px` }}
                        />
                        <span className="hour-label">{i}</span>
                        <div className="hour-tooltip" role="tooltip">
                          {tip}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "provider-usage" && (
          <div className="insights-panel">
            <h2 className="insights-section-title">Provider Analytics</h2>
            <div className="providers-grid">
              {providerData.length > 0 ? (
                providerData.map((provider) => (
                  <div key={provider.provider} className="provider-card">
                    <div className="provider-header">
                      <h3>{provider.provider}</h3>
                      <span
                        className={`badge ${
                          provider.successRate > 90 ? "success" : "warning"
                        }`}
                      >
                        {provider.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="provider-stats">
                      <div className="provider-stat">
                        <span className="label">Total Calls:</span>
                        <span className="value">{provider.totalCalls}</span>
                      </div>
                      <div className="provider-stat">
                        <CheckCircle size={16} className="icon-success" />
                        <span className="label">Successful:</span>
                        <span className="value">{provider.successfulCalls}</span>
                      </div>
                      <div className="provider-stat">
                        <XCircle size={16} className="icon-error" />
                        <span className="label">Failed:</span>
                        <span className="value">{provider.failedCalls}</span>
                      </div>
                      <div className="provider-stat">
                        <Clock size={16} className="icon-info" />
                        <span className="label">Avg Duration:</span>
                        <span className="value">{provider.avgDuration}ms</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <p>No provider data available yet</p>
                </div>
              )}
            </div>

            <h2 className="insights-section-title">Usage Patterns</h2>
            <div className="usage-grid">
              {insightsData?.providerStats?.map((stat) => (
                <div key={stat.provider} className="usage-card">
                  <h3>{stat.provider}</h3>
                  <div className="usage-stats">
                    <div className="usage-stat">
                      <span className="label">Total Calls:</span>
                      <span className="value">{stat.totalCalls}</span>
                    </div>
                    <div className="usage-stat">
                      <span className="label">Success Rate:</span>
                      <span className="value">
                        {stat.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="usage-stat">
                      <span className="label">Avg Duration:</span>
                      <span className="value">{stat.avgDuration}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="insights-section-title">Storage & Performance</h2>
            <div className="storage-grid">
              <div className="storage-card">
                <Database className="storage-icon" />
                <h3>Local Storage</h3>
                <p className="storage-amount">{getStorageUsage()} KB</p>
                <div className="storage-bar">
                  <div className="storage-fill"></div>
                </div>
              </div>

              <div className="storage-card">
                <MessageSquare className="storage-icon" />
                <h3>Total Messages</h3>
                <p className="storage-amount">{usageStats?.totalEvents || 0}</p>
              </div>

              <div className="storage-card">
                <Users className="storage-icon" />
                <h3>Total Sessions</h3>
                <p className="storage-amount">{usageStats?.totalSessions || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system-health" && (
          <div className="insights-panel">
            <h2 className="insights-section-title">Error Monitoring</h2>
            <div className="errors-grid">
              <div className="error-card">
                <AlertTriangle className="error-icon" />
                <h3>Total Errors</h3>
                <p className="error-value">
                  {errorMonitoring?.totalErrors || 0}
                </p>
              </div>

              <div className="error-card">
                <CheckCircle className="error-icon success-icon" />
                <h3>Overall Success Rate</h3>
                <p className="error-value">
                  {errorMonitoring?.successRate.toFixed(1) || 0}%
                </p>
              </div>

              {Object.entries(errorMonitoring?.errorsByProvider || {}).map(
                ([provider, count]) => (
                  <div key={provider} className="error-card">
                    <XCircle className="error-icon" />
                    <h3>{provider}</h3>
                    <p className="error-value">
                      {count as number}{" "}
                      {(count as number) === 1 ? "error" : "errors"}
                    </p>
                  </div>
                ),
              )}
            </div>

            <h2 className="insights-section-title">Performance</h2>
            <div className="performance-grid">
              <div className="performance-card">
                <Zap className="performance-icon fast-icon" />
                <h3>Fast Requests (&lt;1s)</h3>
                <p className="performance-value">
                  {performance?.fastRequests || 0}
                </p>
              </div>

              <div className="performance-card">
                <Clock className="performance-icon normal-icon" />
                <h3>Normal Requests (1-3s)</h3>
                <p className="performance-value">
                  {performance?.normalRequests || 0}
                </p>
              </div>

              <div className="performance-card">
                <AlertTriangle className="performance-icon slow-icon" />
                <h3>Slow Requests (&gt;3s)</h3>
                <p className="performance-value">
                  {performance?.slowRequests || 0}
                </p>
              </div>

              <div className="performance-card">
                <Gauge className="performance-icon" />
                <h3>Min Duration</h3>
                <p className="performance-value">
                  {performance?.minDuration || 0}ms
                </p>
              </div>

              <div className="performance-card">
                <Gauge className="performance-icon" />
                <h3>Median Duration</h3>
                <p className="performance-value">
                  {performance?.medianDuration || 0}ms
                </p>
              </div>

              <div className="performance-card">
                <Gauge className="performance-icon" />
                <h3>Max Duration</h3>
                <p className="performance-value">
                  {performance?.maxDuration || 0}ms
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInsights;
