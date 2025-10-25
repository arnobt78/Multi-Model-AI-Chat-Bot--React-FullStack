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

interface BusinessInsightsProps {
  onBack: () => void;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error("Error fetching data:", error);
      // In dev mode, show empty state gracefully
      if (import.meta.env.DEV) {
        console.log(
          "📊 Business Insights: Running in dev mode - API not available"
        );
      }
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
      </div>
    </div>
  );
};

export default BusinessInsights;
