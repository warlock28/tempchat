import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ParticipantTile = ({ 
  participant, 
  isLocal = false, 
  isMuted = false, 
  isVideoEnabled = true,
  connectionQuality = "good",
  className = ""
}) => {
  const videoRef = useRef(null);

  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityBars = () => {
    switch (connectionQuality) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  return (
    <div className={`relative bg-muted rounded-lg overflow-hidden aspect-video ${className}`}>
      {/* Video Stream */}
      {isVideoEnabled ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isLocal}
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-semibold text-primary-foreground">
                {participant?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{participant?.name || 'Unknown'}</p>
          </div>
        </div>
      )}
      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
        {/* Top Status Bar */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          {/* Connection Quality */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 rounded-md">
            <div className="flex space-x-0.5">
              {[...Array(4)]?.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-sm ${
                    i < getQualityBars() ? getQualityColor() : 'bg-white/20'
                  }`}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
            <span className="text-xs text-white font-medium">
              {connectionQuality?.toUpperCase()}
            </span>
          </div>

          {/* Local Indicator */}
          {isLocal && (
            <div className="px-2 py-1 bg-primary/80 rounded-md">
              <span className="text-xs font-medium text-white">YOU</span>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">
              {participant?.name || 'Unknown User'}
            </span>
            {isMuted && (
              <Icon name="MicOff" size={14} className="text-error" />
            )}
          </div>

          {/* Screen Sharing Indicator */}
          {participant?.isScreenSharing && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/80 rounded-md">
              <Icon name="Monitor" size={12} className="text-white" />
              <span className="text-xs text-white">Sharing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WebRTCCallInterface = ({ 
  isCallActive = false,
  participants = [],
  localStream = null,
  onToggleMute = () => {},
  onToggleVideo = () => {},
  onToggleScreenShare = () => {},
  onEndCall = () => {},
  onStartCall = () => {},
  isMuted = false,
  isVideoEnabled = true,
  isScreenSharing = false,
  callDuration = 0,
  className = ""
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);

  const formatCallDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Mock participants data
  const mockParticipants = [
    {
      id: 'local',
      name: 'You',
      isLocal: true,
      isMuted: isMuted,
      isVideoEnabled: isVideoEnabled,
      connectionQuality: 'excellent',
      isScreenSharing: isScreenSharing
    },
    {
      id: '1',
      name: 'Sarah Johnson',
      isLocal: false,
      isMuted: false,
      isVideoEnabled: true,
      connectionQuality: 'good',
      isScreenSharing: false
    },
    {
      id: '2',
      name: 'Mike Chen',
      isLocal: false,
      isMuted: true,
      isVideoEnabled: false,
      connectionQuality: 'fair',
      isScreenSharing: false
    }
  ];

  if (!isCallActive) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 text-center space-y-4 ${className}`}>
        <div className="space-y-2">
          <Icon name="Phone" size={48} className="mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground">Start Voice/Video Call</h3>
          <p className="text-sm text-muted-foreground">
            Connect with room participants using secure WebRTC
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="default"
            size="lg"
            iconName="Phone"
            iconPosition="left"
            onClick={onStartCall}
            className="spring-bounce"
          >
            Voice Call
          </Button>
          <Button
            variant="outline"
            size="lg"
            iconName="Video"
            iconPosition="left"
            onClick={onStartCall}
            className="spring-bounce"
          >
            Video Call
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={12} className="text-success" />
          <span>End-to-end encrypted calls</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-200' : ''} ${className}`}>
      {/* Call Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Call Active - {formatCallDuration(callDuration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Users" size={12} />
            <span>{mockParticipants?.length} participants</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            iconName={showParticipants ? "EyeOff" : "Eye"}
            onClick={() => setShowParticipants(!showParticipants)}
            className="spring-bounce"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            onClick={toggleFullscreen}
            className="spring-bounce"
          />
        </div>
      </div>
      {/* Video Grid */}
      <div className="p-4 space-y-4">
        {/* Main Video Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockParticipants?.map((participant) => (
            <ParticipantTile
              key={participant?.id}
              participant={participant}
              isLocal={participant?.isLocal}
              isMuted={participant?.isMuted}
              isVideoEnabled={participant?.isVideoEnabled}
              connectionQuality={participant?.connectionQuality}
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => setSelectedParticipant(participant)}
            />
          ))}
        </div>

        {/* Screen Share Display */}
        {isScreenSharing && (
          <div className="bg-muted rounded-lg p-4 border-2 border-primary">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="Monitor" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Screen Sharing</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                onClick={onToggleScreenShare}
                className="spring-bounce"
              >
                Stop Sharing
              </Button>
            </div>
            <div className="aspect-video bg-background rounded border flex items-center justify-center">
              <div className="text-center space-y-2">
                <Icon name="Monitor" size={48} className="mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Your screen is being shared</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Call Controls */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Toggle */}
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="lg"
            iconName={isMuted ? "MicOff" : "Mic"}
            onClick={onToggleMute}
            className="spring-bounce"
            aria-label={isMuted ? "Unmute" : "Mute"}
          />

          {/* Video Toggle */}
          <Button
            variant={!isVideoEnabled ? "destructive" : "outline"}
            size="lg"
            iconName={isVideoEnabled ? "Video" : "VideoOff"}
            onClick={onToggleVideo}
            className="spring-bounce"
            aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          />

          {/* Screen Share Toggle */}
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            iconName="Monitor"
            onClick={onToggleScreenShare}
            className="spring-bounce"
            aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
          />

          {/* End Call */}
          <Button
            variant="destructive"
            size="lg"
            iconName="PhoneOff"
            onClick={onEndCall}
            className="spring-bounce bg-error hover:bg-error/90"
            aria-label="End call"
          />
        </div>

        {/* Audio Level Indicator */}
        {!isMuted && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Icon name="Mic" size={14} className="text-muted-foreground" />
            <div className="flex space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-4 rounded-sm transition-all duration-100 ${
                    i < audioLevel * 5 ? 'bg-success' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Audio Level</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebRTCCallInterface;