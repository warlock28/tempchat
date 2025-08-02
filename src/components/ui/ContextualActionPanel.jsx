import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const ContextualActionPanel = ({
  context = "entry", // "entry", "active", "admin"
  userRole = "participant", // "creator", "participant", "guest"
  roomState = null, // null, "active", "expired"
  onCreateRoom = () => {},
  onJoinRoom = () => {},
  onInviteUsers = () => {},
  onManageRoom = () => {},
  onStartGame = () => {},
  onShareMedia = () => {},
  className = ""
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const handleJoinRoom = async () => {
    if (!joinCode?.trim()) return;
    
    setIsJoining(true);
    try {
      await onJoinRoom(joinCode);
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && joinCode?.trim()) {
      handleJoinRoom();
    }
  };

  // Entry Context - Room Creation/Joining
  if (context === "entry") {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 space-y-6 ${className}`}>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Join the Conversation
          </h2>
          <p className="text-sm text-muted-foreground">
            Create a secure temporary room or join an existing one
          </p>
        </div>
        <div className="space-y-4">
          {/* Create Room */}
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateRoom}
            className="spring-bounce"
          >
            Create New Room
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Join Room */}
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e?.target?.value?.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="text-center font-mono tracking-wider"
              maxLength={8}
            />
            
            <Button
              variant="outline"
              size="lg"
              fullWidth
              iconName="ArrowRight"
              iconPosition="right"
              onClick={handleJoinRoom}
              disabled={!joinCode?.trim() || isJoining}
              loading={isJoining}
              className="spring-bounce"
            >
              Join Room
            </Button>
          </div>

          {/* QR Scanner Option */}
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              iconName="QrCode"
              iconPosition="left"
              onClick={() => {/* QR scanner logic */}}
              className="text-muted-foreground hover:text-foreground"
            >
              Scan QR Code
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Context - Room Participation Tools
  if (context === "active" && roomState === "active") {
    return (
      <div className={`fixed bottom-4 left-4 right-4 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-card/95 backdrop-blur-md border border-border rounded-lg p-4 z-60 ${className}`}>
        <div className="flex items-center justify-between space-x-3">
          {/* Media Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="Camera"
              onClick={onShareMedia}
              className="spring-bounce"
              aria-label="Share camera"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Mic"
              onClick={() => {/* Toggle mic */}}
              className="spring-bounce"
              aria-label="Toggle microphone"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Share"
              onClick={onShareMedia}
              className="spring-bounce"
              aria-label="Share screen"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {userRole === 'creator' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => setShowInvite(!showInvite)}
                  className="spring-bounce hidden sm:flex"
                >
                  Invite
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="UserPlus"
                  onClick={() => setShowInvite(!showInvite)}
                  className="spring-bounce sm:hidden"
                  aria-label="Invite users"
                />
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Gamepad2"
              iconPosition="left"
              onClick={onStartGame}
              className="spring-bounce hidden sm:flex"
            >
              Games
            </Button>
            <Button
              variant="ghost"
              size="icon"
              iconName="Gamepad2"
              onClick={onStartGame}
              className="spring-bounce sm:hidden"
              aria-label="Start game"
            />
          </div>
        </div>

        {/* Invite Panel */}
        {showInvite && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 disclosure-expand">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Invite Others</span>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowInvite(false)}
                className="h-6 w-6"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                onClick={onInviteUsers}
                className="flex-1 spring-bounce"
              >
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="QrCode"
                iconPosition="left"
                onClick={() => {/* Show QR code */}}
                className="flex-1 spring-bounce"
              >
                QR Code
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Context - Room Management
  if (context === "admin" && userRole === 'creator') {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Room Management</h3>
          <Icon name="Settings" size={20} className="text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Room Settings */}
          <Button
            variant="outline"
            iconName="Settings"
            iconPosition="left"
            onClick={onManageRoom}
            className="justify-start spring-bounce"
          >
            Room Settings
          </Button>

          {/* Invite Management */}
          <Button
            variant="outline"
            iconName="UserPlus"
            iconPosition="left"
            onClick={onInviteUsers}
            className="justify-start spring-bounce"
          >
            Manage Invites
          </Button>

          {/* Media Controls */}
          <Button
            variant="outline"
            iconName="Camera"
            iconPosition="left"
            onClick={onShareMedia}
            className="justify-start spring-bounce"
          >
            Media Settings
          </Button>

          {/* Game Management */}
          <Button
            variant="outline"
            iconName="Gamepad2"
            iconPosition="left"
            onClick={onStartGame}
            className="justify-start spring-bounce"
          >
            Game Options
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Danger Zone</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              iconName="Clock"
              iconPosition="left"
              onClick={() => {/* Extend room time */}}
              className="w-full justify-start spring-bounce text-warning border-warning/20 hover:bg-warning/10"
            >
              Extend Room Time
            </Button>
            <Button
              variant="destructive"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => {/* Delete room */}}
              className="w-full justify-start spring-bounce"
            >
              Delete Room Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default empty state
  return null;
};

export default ContextualActionPanel;