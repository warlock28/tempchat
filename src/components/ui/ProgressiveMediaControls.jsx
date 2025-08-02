import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const MediaControlButton = ({ 
  icon, 
  label, 
  isActive = false, 
  isDisabled = false,
  onClick = () => {},
  variant = "ghost",
  size = "default",
  className = ""
}) => {
  return (
    <Button
      variant={isActive ? "default" : variant}
      size={size}
      iconName={icon}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        spring-bounce relative
        ${isActive ? 'bg-primary text-primary-foreground' : ''}
        ${className}
      `}
      aria-label={label}
    >
      {size !== "icon" && <span className="ml-2">{label}</span>}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
      )}
    </Button>
  );
};

const VoiceControls = ({ 
  isMuted = false,
  isDeafened = false,
  onToggleMute = () => {},
  onToggleDeafen = () => {},
  volume = 50,
  onVolumeChange = () => {},
  compact = false,
  className = ""
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <MediaControlButton
          icon={isMuted ? "MicOff" : "Mic"}
          label={isMuted ? "Unmute" : "Mute"}
          isActive={!isMuted}
          onClick={onToggleMute}
          size="icon"
          variant={isMuted ? "destructive" : "ghost"}
        />
        <MediaControlButton
          icon={isDeafened ? "VolumeX" : "Volume2"}
          label={isDeafened ? "Undeafen" : "Deafen"}
          isActive={!isDeafened}
          onClick={onToggleDeafen}
          size="icon"
          variant={isDeafened ? "destructive" : "ghost"}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Voice Controls</h3>
        <div className="flex items-center space-x-2">
          <MediaControlButton
            icon={isMuted ? "MicOff" : "Mic"}
            label={isMuted ? "Unmute" : "Mute"}
            isActive={!isMuted}
            onClick={onToggleMute}
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
          />
          <MediaControlButton
            icon={isDeafened ? "VolumeX" : "Volume2"}
            label={isDeafened ? "Undeafen" : "Deafen"}
            isActive={!isDeafened}
            onClick={onToggleDeafen}
            size="sm"
            variant={isDeafened ? "destructive" : "outline"}
          />
        </div>
      </div>
      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Volume</span>
          <span>{volume}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e?.target?.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            disabled={isDeafened}
          />
        </div>
      </div>
    </div>
  );
};

const VideoControls = ({ 
  isVideoEnabled = false,
  isScreenSharing = false,
  onToggleVideo = () => {},
  onToggleScreenShare = () => {},
  onSelectCamera = () => {},
  availableCameras = [],
  compact = false,
  className = ""
}) => {
  const [showCameraSelect, setShowCameraSelect] = useState(false);

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <MediaControlButton
          icon={isVideoEnabled ? "Video" : "VideoOff"}
          label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          isActive={isVideoEnabled}
          onClick={onToggleVideo}
          size="icon"
          variant={!isVideoEnabled ? "destructive" : "ghost"}
        />
        <MediaControlButton
          icon={isScreenSharing ? "MonitorSpeaker" : "Monitor"}
          label={isScreenSharing ? "Stop sharing" : "Share screen"}
          isActive={isScreenSharing}
          onClick={onToggleScreenShare}
          size="icon"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Video Controls</h3>
        <div className="flex items-center space-x-2">
          <MediaControlButton
            icon={isVideoEnabled ? "Video" : "VideoOff"}
            label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            isActive={isVideoEnabled}
            onClick={onToggleVideo}
            size="sm"
            variant={!isVideoEnabled ? "destructive" : "outline"}
          />
          <MediaControlButton
            icon={isScreenSharing ? "MonitorSpeaker" : "Monitor"}
            label={isScreenSharing ? "Stop sharing" : "Share screen"}
            isActive={isScreenSharing}
            onClick={onToggleScreenShare}
            size="sm"
          />
        </div>
      </div>
      {/* Camera Selection */}
      {availableCameras?.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Camera</label>
          <select 
            className="w-full p-2 bg-input border border-border rounded-md text-sm"
            onChange={(e) => onSelectCamera(e?.target?.value)}
          >
            {availableCameras?.map((camera, index) => (
              <option key={camera?.deviceId || index} value={camera?.deviceId}>
                {camera?.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const FileUploadZone = ({ 
  onFileSelect = () => {},
  onDrop = () => {},
  acceptedTypes = "image/*,video/*,audio/*,.pdf,.doc,.docx",
  maxSize = 50 * 1024 * 1024, // 50MB
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      if (file?.size > maxSize) {
        console.warn(`File ${file?.name} is too large`);
        return false;
      }
      return true;
    });

    if (validFiles?.length > 0) {
      onFileSelect(validFiles);
      onDrop(validFiles);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-foreground">Share Files</h3>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors spring-bounce
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Icon 
            name={isDragOver ? "Upload" : "FileUp"} 
            size={32} 
            className={`mx-auto ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Images, videos, audio, documents up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Camera"
          iconPosition="left"
          onClick={() => {/* Open camera */}}
          className="spring-bounce"
        >
          Take Photo
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Paperclip"
          iconPosition="left"
          onClick={() => fileInputRef?.current?.click()}
          className="spring-bounce"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};

const MediaControlPanel = ({ 
  mode = "overlay", // "overlay", "sidebar", "compact"
  isOpen = false,
  onClose = () => {},
  voiceProps = {},
  videoProps = {},
  fileProps = {},
  className = ""
}) => {
  if (mode === "compact") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <VoiceControls {...voiceProps} compact />
        <VideoControls {...videoProps} compact />
        <Button
          variant="ghost"
          size="icon"
          iconName="Paperclip"
          onClick={() => {/* Open file dialog */}}
          className="spring-bounce"
          aria-label="Share files"
        />
      </div>
    );
  }

  if (mode === "overlay") {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className={`
          relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full max-h-[80vh] overflow-y-auto
          ${className}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Media Controls</h2>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
              className="spring-bounce"
            />
          </div>
          
          <div className="p-4 space-y-6">
            <VoiceControls {...voiceProps} />
            <VideoControls {...videoProps} />
            <FileUploadZone {...fileProps} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === "sidebar") {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Media</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
              className="spring-bounce"
            />
          )}
        </div>
        
        <VoiceControls {...voiceProps} />
        <VideoControls {...videoProps} />
        <FileUploadZone {...fileProps} />
      </div>
    );
  }

  return null;
};

// Main export
const ProgressiveMediaControls = {
  MediaControlPanel,
  VoiceControls,
  VideoControls,
  FileUploadZone,
  MediaControlButton
};

export default ProgressiveMediaControls;
export { MediaControlPanel, VoiceControls, VideoControls, FileUploadZone, MediaControlButton };