import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ParticipantItem = ({ 
  participant,
  isCurrentUser = false,
  onPrivateMessage = () => {},
  onBlock = () => {},
  onReport = () => {},
  className = ""
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = () => {
    switch (participant?.status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (participant?.status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`group relative ${className}`}>
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        {/* Avatar with Status */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={participant?.avatar}
              alt={participant?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-background`} />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-foreground truncate">
              {participant?.name}
              {isCurrentUser && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
            </p>
            {participant?.role === 'creator' && (
              <Icon name="Crown" size={12} className="text-warning flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {getStatusText()}
          </p>
        </div>

        {/* Actions Button */}
        {!isCurrentUser && (
          <button
            onClick={() => setShowActions(!showActions)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-md transition-all"
          >
            <Icon name="MoreVertical" size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
      {/* Actions Menu */}
      {showActions && !isCurrentUser && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-modal z-50 min-w-[150px]">
          <div className="py-1">
            <button
              onClick={() => {
                onPrivateMessage(participant);
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
            >
              <Icon name="MessageCircle" size={14} />
              <span>Message</span>
            </button>
            <button
              onClick={() => {
                onBlock(participant);
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-warning"
            >
              <Icon name="UserX" size={14} />
              <span>Block</span>
            </button>
            <button
              onClick={() => {
                onReport(participant);
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-error"
            >
              <Icon name="Flag" size={14} />
              <span>Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ParticipantsList = ({ 
  participants = [],
  currentUserId = null,
  onPrivateMessage = () => {},
  onBlock = () => {},
  onReport = () => {},
  onInvite = () => {},
  canInvite = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants?.filter(participant =>
    participant?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const onlineCount = participants?.filter(p => p?.status === 'online')?.length;

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Participants ({participants?.length})
          </h3>
          {canInvite && (
            <Button
              variant="ghost"
              size="icon"
              iconName="UserPlus"
              onClick={onInvite}
              className="spring-bounce"
              aria-label="Invite participants"
            />
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {onlineCount} online • {participants?.length - onlineCount} offline
        </div>

        {/* Search */}
        {participants?.length > 5 && (
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}
      </div>
      {/* Participants List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredParticipants?.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {searchTerm ? 'No participants found' : 'No participants yet'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredParticipants?.sort((a, b) => {
                // Sort by: current user first, then by status, then by name
                if (a?.id === currentUserId) return -1;
                if (b?.id === currentUserId) return 1;
                
                const statusOrder = { online: 0, away: 1, busy: 2, offline: 3 };
                const statusDiff = statusOrder?.[a?.status] - statusOrder?.[b?.status];
                if (statusDiff !== 0) return statusDiff;
                
                return a?.name?.localeCompare(b?.name);
              })?.map((participant) => (
                <ParticipantItem
                  key={participant?.id}
                  participant={participant}
                  isCurrentUser={participant?.id === currentUserId}
                  onPrivateMessage={onPrivateMessage}
                  onBlock={onBlock}
                  onReport={onReport}
                />
              ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;