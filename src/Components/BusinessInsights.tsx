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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [timeAndTrends, setTimeAndTrends] = useState<TimeAndTrendsData | null>(
    null
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
        "📊 Business Insights: Running in dev mode - API not available"
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
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return (totalSize / 1024).toFixed(2); // KB
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "providers", label: "Provider Analytics", icon: MessageSquare },
    { id: "storage", label: "Storage & Performance", icon: Database },
    { id: "usage", label: "Usage Patterns", icon: TrendingUp },
    { id: "time-trends", label: "Time & Trends", icon: BarChart3 },
    { id: "engagement", label: "User Engagement", icon: Users },
    { id: "errors", label: "Error Monitoring", icon: AlertTriangle },
    { id: "performance", label: "Performance", icon: Gauge },
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
      <div className="insights-header">
        <div className="header-content">
          <button onClick={onBack} className="back-btn">
            ← Back to Chat
          </button>
          <div className="header-title">
            <Database className="header-icon" />
            <div>
              <h1>Business Insights Dashboard</h1>
              <p>Analytics & Performance Metrics</p>
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
        {activeTab === "overview" && (
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
        )}

        {activeTab === "providers" && (
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
        )}

        {activeTab === "storage" && (
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
        )}

        {activeTab === "usage" && (
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
        )}

        {activeTab === "time-trends" && (
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
              <h3>Today's Activity</h3>
              <p className="trend-value">
                {Object.values(timeAndTrends?.hourlyActivity || {}).reduce(
                  (a, b) => a + b,
                  0
                ) || 0}{" "}
                events
              </p>
            </div>

            <div className="trend-card">
              <Clock className="trend-icon" />
              <h3>Hourly Breakdown</h3>
              <div className="hourly-chart">
                {Array.from({ length: 24 }, (_, i) => {
                  const hourValue =
                    timeAndTrends?.hourlyActivity[i.toString()] || 0;
                  const maxValue = Math.max(
                    ...Object.values(timeAndTrends?.hourlyActivity || {}),
                    1
                  );
                  const barHeight = (hourValue / maxValue) * 200;

                  return (
                    <div key={i} className="hour-bar-container">
                      <div
                        className="hour-bar"
                        style={{
                          height: `${barHeight}px`,
                        }}
                      ></div>
                      <span className="hour-label">{hourValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "engagement" && (
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
        )}

        {activeTab === "errors" && (
          <div className="errors-grid">
            <div className="error-card">
              <AlertTriangle className="error-icon" />
              <h3>Total Errors</h3>
              <p className="error-value">{errorMonitoring?.totalErrors || 0}</p>
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
                  <p className="error-value">{count as number} errors</p>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "performance" && (
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
        )}
      </div>
    </div>
  );
};

export default BusinessInsights;
