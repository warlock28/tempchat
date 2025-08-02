import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const RoomStatusHeader = ({ 
  roomId = null,
  roomName = "TempChat Room",
  participantCount = 1,
  expiresAt = null,
  isEncrypted = true,
  connectionStatus = "connected",
  userRole = "participant",
  onLeaveRoom = () => {},
  onRoomSettings = () => {},
  className = ""
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date()?.getTime();
      const expiry = new Date(expiresAt)?.getTime();
      const remaining = expiry - now;

      if (remaining <= 0) {
        setTimeRemaining(null);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
      setIsExpiring(remaining < 300000); // 5 minutes warning
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'WifiOff';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return null;
    
    const { hours, minutes, seconds } = timeRemaining;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <header className={`sticky top-0 z-100 bg-background/95 backdrop-blur-md border-b border-border ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left Section - Room Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={18} color="white" />
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              TempChat
            </span>
          </div>

          {/* Room Name & Participants */}
          {roomId && (
            <div className="flex items-center space-x-3 min-w-0">
              <div className="min-w-0">
                <h1 className="font-medium text-foreground truncate text-sm lg:text-base">
                  {roomName}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Users" size={12} />
                  <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Status & Controls */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Timer */}
          {timeRemaining && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-mono ${
              isExpiring ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Clock" size={12} />
              <span className={isExpiring ? 'security-pulse' : ''}>
                {formatTimeRemaining()}
              </span>
            </div>
          )}

          {/* Security Status */}
          {roomId && (
            <div className="hidden sm:flex items-center space-x-2">
              {/* Encryption Status */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
                isEncrypted ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
                <Icon 
                  name={isEncrypted ? "Shield" : "ShieldOff"} 
                  size={12} 
                  className={isEncrypted ? 'security-pulse' : ''}
                />
                <span className="hidden lg:inline">
                  {isEncrypted ? 'Encrypted' : 'Not Encrypted'}
                </span>
              </div>

              {/* Connection Status */}
              <div className={`flex items-center space-x-1 ${getConnectionStatusColor()}`}>
                <Icon name={getConnectionStatusIcon()} size={14} />
                <span className="hidden lg:inline text-xs capitalize">
                  {connectionStatus}
                </span>
              </div>
            </div>
          )}

          {/* Mobile Security Indicators */}
          {roomId && (
            <div className="flex sm:hidden items-center space-x-2">
              <Icon 
                name={isEncrypted ? "Shield" : "ShieldOff"} 
                size={16} 
                className={isEncrypted ? 'text-success security-pulse' : 'text-error'}
              />
              <Icon 
                name={getConnectionStatusIcon()} 
                size={16} 
                className={getConnectionStatusColor()}
              />
            </div>
          )}

          {/* Room Controls */}
          {roomId && (
            <div className="flex items-center space-x-1">
              {/* Settings (Creator only) */}
              {userRole === 'creator' && (
                <button
                  onClick={onRoomSettings}
                  className="p-2 hover:bg-muted rounded-md transition-colors spring-bounce"
                  aria-label="Room settings"
                >
                  <Icon name="Settings" size={16} className="text-muted-foreground" />
                </button>
              )}

              {/* Leave Room */}
              <button
                onClick={onLeaveRoom}
                className="p-2 hover:bg-error/10 rounded-md transition-colors spring-bounce text-muted-foreground hover:text-error"
                aria-label="Leave room"
              >
                <Icon name="LogOut" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Timer Bar */}
      {timeRemaining && (
        <div className="sm:hidden px-4 pb-2">
          <div className={`flex items-center justify-center space-x-2 py-1 px-3 rounded-md text-xs font-mono ${
            isExpiring ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Clock" size={12} />
            <span className={isExpiring ? 'security-pulse' : ''}>
              Room expires in {formatTimeRemaining()}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default RoomStatusHeader;