import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ActivityMonitor = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [timeRange, setTimeRange] = useState('1h');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 4,
    messagesPerMinute: 12,
    memoryUsage: 45,
    connectionQuality: 98
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: Math.max(1, prev?.activeUsers + Math.floor(Math.random() * 3) - 1),
        messagesPerMinute: Math.max(0, prev?.messagesPerMinute + Math.floor(Math.random() * 5) - 2),
        memoryUsage: Math.min(100, Math.max(20, prev?.memoryUsage + Math.floor(Math.random() * 6) - 3)),
        connectionQuality: Math.min(100, Math.max(80, prev?.connectionQuality + Math.floor(Math.random() * 4) - 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for charts
  const messageActivityData = [
    { time: '14:00', messages: 8, users: 3 },
    { time: '14:05', messages: 12, users: 4 },
    { time: '14:10', messages: 15, users: 4 },
    { time: '14:15', messages: 23, users: 5 },
    { time: '14:20', messages: 18, users: 4 },
    { time: '14:25', messages: 25, users: 6 },
    { time: '14:30', messages: 20, users: 5 },
    { time: '14:35', messages: 12, users: 4 }
  ];

  const connectionStatsData = [
    { time: '14:00', latency: 45, quality: 98 },
    { time: '14:05', latency: 52, quality: 96 },
    { time: '14:10', latency: 38, quality: 99 },
    { time: '14:15', latency: 41, quality: 98 },
    { time: '14:20', latency: 48, quality: 97 },
    { time: '14:25', latency: 35, quality: 99 },
    { time: '14:30', latency: 43, quality: 98 },
    { time: '14:35', latency: 39, quality: 99 }
  ];

  const performanceData = [
    { metric: 'CPU Usage', value: 32, max: 100, color: '#10B981' },
    { metric: 'Memory', value: realTimeData?.memoryUsage, max: 100, color: '#F59E0B' },
    { metric: 'Network', value: 78, max: 100, color: '#2563EB' },
    { metric: 'Storage', value: 15, max: 100, color: '#8B5CF6' }
  ];

  const mediaUsageData = [
    { name: 'Images', value: 45, color: '#10B981' },
    { name: 'Videos', value: 25, color: '#2563EB' },
    { name: 'Audio', value: 20, color: '#F59E0B' },
    { name: 'Documents', value: 10, color: '#8B5CF6' }
  ];

  const getStatusColor = (value, thresholds = { good: 80, warning: 60 }) => {
    if (value >= thresholds?.good) return 'text-success';
    if (value >= thresholds?.warning) return 'text-warning';
    return 'text-error';
  };

  const tabs = [
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'connections', label: 'Connections', icon: 'Wifi' },
    { id: 'performance', label: 'Performance', icon: 'Activity' },
    { id: 'media', label: 'Media', icon: 'Image' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="Users" size={24} className="mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-foreground">{realTimeData?.activeUsers}</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="MessageSquare" size={24} className="mx-auto mb-2 text-success" />
          <div className="text-2xl font-bold text-foreground">{realTimeData?.messagesPerMinute}</div>
          <div className="text-sm text-muted-foreground">Messages/Min</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="HardDrive" size={24} className={`mx-auto mb-2 ${getStatusColor(100 - realTimeData?.memoryUsage)}`} />
          <div className="text-2xl font-bold text-foreground">{realTimeData?.memoryUsage}%</div>
          <div className="text-sm text-muted-foreground">Memory Usage</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Icon name="Wifi" size={24} className={`mx-auto mb-2 ${getStatusColor(realTimeData?.connectionQuality)}`} />
          <div className="text-2xl font-bold text-foreground">{realTimeData?.connectionQuality}%</div>
          <div className="text-sm text-muted-foreground">Connection Quality</div>
        </div>
      </div>
      {/* Chart Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm"
            >
              <option value="15m">Last 15 minutes</option>
              <option value="1h">Last hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Chart Display */}
      <div className="bg-card border border-border rounded-lg p-4">
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Message Activity</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={messageActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#2563EB" 
                    fill="#2563EB" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connection Statistics</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={connectionStatsData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">System Performance</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="metric" type="category" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Media Usage Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mediaUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mediaUsageData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaUsageData?.map((item) => (
                <div key={item?.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm text-foreground">{item?.name}</span>
                  <span className="text-sm text-muted-foreground">{item?.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-4">Connection Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Latency</span>
              <span className="text-sm font-medium text-foreground">42ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Packet Loss</span>
              <span className="text-sm font-medium text-success">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bandwidth Usage</span>
              <span className="text-sm font-medium text-foreground">2.3 MB/s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reconnections</span>
              <span className="text-sm font-medium text-foreground">0</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-4">Resource Usage</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Memory Allocated</span>
              <span className="text-sm font-medium text-foreground">128 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Storage Used</span>
              <span className="text-sm font-medium text-foreground">45 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Connections</span>
              <span className="text-sm font-medium text-foreground">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium text-success">15m 32s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;