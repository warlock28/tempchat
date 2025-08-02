import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomStatusHeader from '../../components/ui/RoomStatusHeader';
import ParticipantManagement from './components/ParticipantManagement';
import SecuritySettings from './components/SecuritySettings';
import RoomConfiguration from './components/RoomConfiguration';
import ActivityMonitor from './components/ActivityMonitor';
import EmergencyControls from './components/EmergencyControls';

const RoomManagementSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('participants');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mock room data
  const roomData = {
    roomId: "A1B2C3D4",
    roomName: "TempChat Room #A1B2C3",
    participantCount: 4,
    expiresAt: new Date(Date.now() + 1800000), // 30 minutes from now
    isEncrypted: true,
    connectionStatus: "connected",
    userRole: "creator"
  };

  const tabs = [
    { 
      id: 'participants', 
      label: 'Participants', 
      icon: 'Users',
      description: 'Manage users and moderation'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: 'Shield',
      description: 'Encryption and content filtering'
    },
    { 
      id: 'configuration', 
      label: 'Configuration', 
      icon: 'Settings',
      description: 'Room settings and features'
    },
    { 
      id: 'activity', 
      label: 'Activity', 
      icon: 'Activity',
      description: 'Performance and usage metrics'
    },
    { 
      id: 'emergency', 
      label: 'Emergency', 
      icon: 'AlertTriangle',
      description: 'Critical room controls'
    }
  ];

  const handleLeaveRoom = () => {
    navigate('/room-creation-setup');
  };

  const handleBackToChat = () => {
    navigate('/main-chat-interface');
  };

  const handleParticipantAction = (action, userId, data = null) => {
    console.log(`${action} action for user ${userId}:`, data);
    // In real app, this would make API calls
  };

  const handleSecurityUpdate = (newSettings) => {
    console.log('Security settings updated:', newSettings);
    // In real app, this would update room security settings
  };

  const handleConfigUpdate = (newConfig) => {
    console.log('Room configuration updated:', newConfig);
    // In real app, this would update room configuration
  };

  const handleEmergencyAction = (action, data = null) => {
    console.log(`Emergency action: ${action}`, data);
    // In real app, this would trigger emergency procedures
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'participants':
        return (
          <ParticipantManagement
            onMuteUser={(userId) => handleParticipantAction('mute', userId)}
            onKickUser={(userId) => handleParticipantAction('kick', userId)}
            onBlockUser={(userId) => handleParticipantAction('block', userId)}
            onReportUser={(userId, report) => handleParticipantAction('report', userId, report)}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            onUpdateSettings={handleSecurityUpdate}
          />
        );
      case 'configuration':
        return (
          <RoomConfiguration
            onUpdateConfig={handleConfigUpdate}
          />
        );
      case 'activity':
        return <ActivityMonitor />;
      case 'emergency':
        return (
          <EmergencyControls
            onTerminateRoom={() => handleEmergencyAction('terminate')}
            onEmergencyMute={() => handleEmergencyAction('mute-all')}
            onLockRoom={(reason) => handleEmergencyAction('lock', { reason })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoomStatusHeader
        roomId={roomData?.roomId}
        roomName={roomData?.roomName}
        participantCount={roomData?.participantCount}
        expiresAt={roomData?.expiresAt}
        isEncrypted={roomData?.isEncrypted}
        connectionStatus={roomData?.connectionStatus}
        userRole={roomData?.userRole}
        onLeaveRoom={handleLeaveRoom}
        onRoomSettings={() => {}}
      />
      {/* Navigation Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToChat}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to Chat</span>
              </button>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground font-medium">Room Management</span>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              iconName="Menu"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 space-y-2 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h2 className="font-semibold text-foreground">Management Tools</h2>
              
              <nav className="space-y-1">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => {
                      setActiveTab(tab?.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors spring-bounce ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={20} 
                      className={`mt-0.5 flex-shrink-0 ${
                        tab?.id === 'emergency' && activeTab !== tab?.id ? 'text-error' : ''
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-medium">{tab?.label}</div>
                      <div className={`text-xs mt-1 ${
                        activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        {tab?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-foreground">Quick Stats</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="text-foreground font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="text-foreground font-medium">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Files Shared</span>
                  <span className="text-foreground font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-success font-medium">15m 32s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-lg">
              {/* Tab Header */}
              <div className="border-b border-border p-4">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={tabs?.find(tab => tab?.id === activeTab)?.icon || 'Settings'} 
                    size={24} 
                    className={`${
                      activeTab === 'emergency' ? 'text-error' : 'text-primary'
                    }`}
                  />
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      {tabs?.find(tab => tab?.id === activeTab)?.label}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {tabs?.find(tab => tab?.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default RoomManagementSettings;