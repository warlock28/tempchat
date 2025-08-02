import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ParticipantManagement = ({ 
  participants = [],
  onMuteUser = () => {},
  onKickUser = () => {},
  onBlockUser = () => {},
  onReportUser = () => {},
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Mock participants data
  const mockParticipants = [
    {
      id: 1,
      username: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "online",
      joinedAt: new Date(Date.now() - 1800000),
      role: "creator",
      isMuted: false,
      messageCount: 45,
      lastActivity: new Date(Date.now() - 120000)
    },
    {
      id: 2,
      username: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      status: "online",
      joinedAt: new Date(Date.now() - 1200000),
      role: "participant",
      isMuted: false,
      messageCount: 23,
      lastActivity: new Date(Date.now() - 30000)
    },
    {
      id: 3,
      username: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "away",
      joinedAt: new Date(Date.now() - 900000),
      role: "participant",
      isMuted: true,
      messageCount: 12,
      lastActivity: new Date(Date.now() - 300000)
    },
    {
      id: 4,
      username: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "offline",
      joinedAt: new Date(Date.now() - 600000),
      role: "participant",
      isMuted: false,
      messageCount: 8,
      lastActivity: new Date(Date.now() - 600000)
    }
  ];

  const filteredParticipants = mockParticipants?.filter(participant =>
    participant?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date?.toLocaleDateString();
  };

  const handleBulkAction = (action) => {
    selectedUsers?.forEach(userId => {
      const user = mockParticipants?.find(p => p?.id === userId);
      if (user && action === 'mute') onMuteUser(userId);
      if (user && action === 'kick') onKickUser(userId);
    });
    setSelectedUsers([]);
  };

  const handleReportSubmit = () => {
    if (reportingUser && reportReason) {
      onReportUser(reportingUser?.id, {
        reason: reportReason,
        description: reportDescription,
        timestamp: new Date()
      });
      setShowReportModal(false);
      setReportingUser(null);
      setReportReason('');
      setReportDescription('');
    }
  };

  const reportReasons = [
    "Spam or unwanted content",
    "Harassment or bullying", 
    "Inappropriate language",
    "Sharing inappropriate media",
    "Impersonation",
    "Other"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Bulk Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Participants</h3>
            <p className="text-sm text-muted-foreground">
              {filteredParticipants?.length} active participants
            </p>
          </div>
          
          {selectedUsers?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedUsers?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="VolumeX"
                onClick={() => handleBulkAction('mute')}
              >
                Mute All
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="UserX"
                onClick={() => handleBulkAction('kick')}
              >
                Kick All
              </Button>
            </div>
          )}
        </div>

        <Input
          type="search"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="max-w-md"
        />
      </div>
      {/* Participants List */}
      <div className="space-y-3">
        {filteredParticipants?.map((participant) => (
          <div
            key={participant?.id}
            className="bg-card border border-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Checkbox
                  checked={selectedUsers?.includes(participant?.id)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedUsers([...selectedUsers, participant?.id]);
                    } else {
                      setSelectedUsers(selectedUsers?.filter(id => id !== participant?.id));
                    }
                  }}
                />
                
                <div className="relative flex-shrink-0">
                  <img
                    src={participant?.avatar}
                    alt={participant?.username}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(participant?.status)}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground truncate">
                      {participant?.username}
                    </h4>
                    {participant?.role === 'creator' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Icon name="Crown" size={12} className="mr-1" />
                        Creator
                      </span>
                    )}
                    {participant?.isMuted && (
                      <Icon name="VolumeX" size={14} className="text-error" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <span>Joined {formatTimeAgo(participant?.joinedAt)}</span>
                    <span>{participant?.messageCount} messages</span>
                    <span>Last active {formatTimeAgo(participant?.lastActivity)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {participant?.role !== 'creator' && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName={participant?.isMuted ? "Volume2" : "VolumeX"}
                    onClick={() => onMuteUser(participant?.id)}
                    className={participant?.isMuted ? "text-success" : "text-warning"}
                    aria-label={participant?.isMuted ? "Unmute user" : "Mute user"}
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Flag"
                    onClick={() => {
                      setReportingUser(participant);
                      setShowReportModal(true);
                    }}
                    className="text-warning"
                    aria-label="Report user"
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="UserX"
                    onClick={() => onKickUser(participant?.id)}
                    className="text-error"
                    aria-label="Kick user"
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Ban"
                    onClick={() => onBlockUser(participant?.id)}
                    className="text-destructive"
                    aria-label="Block user"
                  />
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            {participant?.role !== 'creator' && (
              <div className="flex sm:hidden space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName={participant?.isMuted ? "Volume2" : "VolumeX"}
                  iconPosition="left"
                  onClick={() => onMuteUser(participant?.id)}
                  className="flex-1"
                >
                  {participant?.isMuted ? "Unmute" : "Mute"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Flag"
                  iconPosition="left"
                  onClick={() => {
                    setReportingUser(participant);
                    setShowReportModal(true);
                  }}
                  className="flex-1"
                >
                  Report
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="UserX"
                  iconPosition="left"
                  onClick={() => onKickUser(participant?.id)}
                  className="flex-1"
                >
                  Kick
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Report Modal */}
      {showReportModal && reportingUser && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Report User</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowReportModal(false)}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={reportingUser?.avatar}
                  alt={reportingUser?.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
                <div>
                  <h4 className="font-medium text-foreground">{reportingUser?.username}</h4>
                  <p className="text-sm text-muted-foreground">Select a reason for reporting</p>
                </div>
              </div>

              <div className="space-y-2">
                {reportReasons?.map((reason) => (
                  <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e?.target?.value)}
                      className="text-primary"
                    />
                    <span className="text-sm text-foreground">{reason}</span>
                  </label>
                ))}
              </div>

              <Input
                type="text"
                label="Additional details (optional)"
                placeholder="Provide more context..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e?.target?.value)}
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReportSubmit}
                  disabled={!reportReason}
                  className="flex-1"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManagement;