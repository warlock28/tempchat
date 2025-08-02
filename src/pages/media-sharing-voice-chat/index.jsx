import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomStatusHeader from '../../components/ui/RoomStatusHeader';
import ContextualActionPanel from '../../components/ui/ContextualActionPanel';
import SecurityIndicatorSystem from '../../components/ui/SecurityIndicatorSystem';
import ProgressiveMediaControls from '../../components/ui/ProgressiveMediaControls';

// Import page-specific components
import FileUploadArea from './components/FileUploadArea';
import VoiceMessageRecorder from './components/VoiceMessageRecorder';
import WebRTCCallInterface from './components/WebRTCCallInterface';
import MediaGallery from './components/MediaGallery';
import AudioPlaybackControls from './components/AudioPlaybackControls';

const MediaSharingVoiceChat = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('upload');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Mock room data
  const roomData = {
    id: 'TEMP8X9Y',
    name: 'Project Discussion',
    participantCount: 3,
    expiresAt: new Date(Date.now() + 2700000), // 45 minutes from now
    isEncrypted: true,
    connectionStatus: 'connected',
    userRole: 'creator'
  };

  // Mock audio file for playback
  const mockAudioFile = {
    id: 'audio_1',
    name: 'Voice_Message_001.webm',
    sender: 'Sarah Johnson',
    url: '#',
    duration: 125,
    size: 512000
  };

  // Call timer effect
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Navigation handlers
  const handleNavigateToChat = () => navigate('/main-chat-interface');
  const handleNavigateToSettings = () => navigate('/room-management-settings');
  const handleLeaveRoom = () => navigate('/room-access-authentication');

  // Media handlers
  const handleFileSelect = (files) => {
    console.log('Files selected:', files);
  };

  const handleUploadProgress = (fileId, progress) => {
    setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
  };

  const handleRecordingComplete = (blob, duration) => {
    console.log('Recording complete:', { blob, duration });
  };

  const handleRecordingStart = () => {
    console.log('Recording started');
  };

  const handleRecordingStop = () => {
    console.log('Recording stopped');
  };

  // Call handlers
  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  // Audio playback handlers
  const handleAudioPlay = () => {
    setIsAudioPlaying(true);
  };

  const handleAudioPause = () => {
    setIsAudioPlaying(false);
  };

  const handleAudioSeek = (time) => {
    setAudioCurrentTime(time);
  };

  const handleMediaPlay = (mediaId, isPlaying) => {
    console.log('Media play:', { mediaId, isPlaying });
  };

  const handleMediaDownload = (mediaId) => {
    console.log('Download media:', mediaId);
  };

  const handleMediaDelete = (mediaId) => {
    console.log('Delete media:', mediaId);
  };

  const tabs = [
    { id: 'upload', label: 'File Upload', icon: 'Upload' },
    { id: 'voice', label: 'Voice Messages', icon: 'Mic' },
    { id: 'call', label: 'Voice/Video Call', icon: 'Phone' },
    { id: 'gallery', label: 'Media Gallery', icon: 'Image' },
    { id: 'playback', label: 'Audio Player', icon: 'Music' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Room Status Header */}
      <RoomStatusHeader
        roomId={roomData?.id}
        roomName={roomData?.name}
        participantCount={roomData?.participantCount}
        expiresAt={roomData?.expiresAt}
        isEncrypted={roomData?.isEncrypted}
        connectionStatus={roomData?.connectionStatus}
        userRole={roomData?.userRole}
        onLeaveRoom={handleLeaveRoom}
        onRoomSettings={handleNavigateToSettings}
      />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Page Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Media Sharing & Voice Chat</h1>
                  <p className="text-muted-foreground">
                    Secure file sharing, voice messaging, and WebRTC calling
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  iconName="MessageSquare"
                  iconPosition="left"
                  onClick={handleNavigateToChat}
                  className="spring-bounce"
                >
                  Back to Chat
                </Button>
              </div>

              {/* Security Status */}
              <div className="flex items-center space-x-4">
                <SecurityIndicatorSystem.SecurityBadge level="high" compact />
                <SecurityIndicatorSystem.ConnectionStatus 
                  status={roomData?.connectionStatus} 
                  showDetails 
                />
                <SecurityIndicatorSystem.ExpirationTimer 
                  expiresAt={roomData?.expiresAt}
                  showProgress
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors spring-bounce
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <FileUploadArea
                    onFileSelect={handleFileSelect}
                    onUploadProgress={handleUploadProgress}
                    maxFileSize={50 * 1024 * 1024}
                  />
                  
                  {/* Quick Media Controls */}
                  <ProgressiveMediaControls.MediaControlPanel
                    mode="compact"
                    voiceProps={{
                      isMuted,
                      onToggleMute: handleToggleMute,
                      compact: true
                    }}
                    videoProps={{
                      isVideoEnabled,
                      onToggleVideo: handleToggleVideo,
                      compact: true
                    }}
                  />
                </div>
              )}

              {activeTab === 'voice' && (
                <VoiceMessageRecorder
                  onRecordingComplete={handleRecordingComplete}
                  onRecordingStart={handleRecordingStart}
                  onRecordingStop={handleRecordingStop}
                  maxDuration={300}
                />
              )}

              {activeTab === 'call' && (
                <WebRTCCallInterface
                  isCallActive={isCallActive}
                  participants={[]}
                  onToggleMute={handleToggleMute}
                  onToggleVideo={handleToggleVideo}
                  onToggleScreenShare={handleToggleScreenShare}
                  onEndCall={handleEndCall}
                  onStartCall={handleStartCall}
                  isMuted={isMuted}
                  isVideoEnabled={isVideoEnabled}
                  isScreenSharing={isScreenSharing}
                  callDuration={callDuration}
                />
              )}

              {activeTab === 'gallery' && (
                <MediaGallery
                  mediaItems={[]}
                  onMediaPlay={handleMediaPlay}
                  onMediaDownload={handleMediaDownload}
                  onMediaDelete={handleMediaDelete}
                />
              )}

              {activeTab === 'playback' && (
                <AudioPlaybackControls
                  audioFile={mockAudioFile}
                  isPlaying={isAudioPlaying}
                  currentTime={audioCurrentTime}
                  duration={mockAudioFile?.duration}
                  volume={50}
                  playbackSpeed={1}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  onSeek={handleAudioSeek}
                  onVolumeChange={(volume) => console.log('Volume:', volume)}
                  onSpeedChange={(speed) => console.log('Speed:', speed)}
                  onDownload={() => handleMediaDownload(mockAudioFile?.id)}
                  onDelete={() => handleMediaDelete(mockAudioFile?.id)}
                  showWaveform={true}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Panel */}
            <ContextualActionPanel
              context="active"
              userRole={roomData?.userRole}
              roomState="active"
              onInviteUsers={() => console.log('Invite users')}
              onStartGame={() => console.log('Start game')}
              onShareMedia={() => setShowMediaControls(true)}
            />

            {/* Room Participants */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Participants</h3>
              <div className="space-y-3">
                {[
                  { id: '1', name: 'You', status: 'online', role: 'creator' },
                  { id: '2', name: 'Sarah Johnson', status: 'online', role: 'participant' },
                  { id: '3', name: 'Mike Chen', status: 'away', role: 'participant' }
                ]?.map((participant) => (
                  <div key={participant?.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {participant?.name?.charAt(0)}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                        participant?.status === 'online' ? 'bg-success' : 'bg-warning'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {participant?.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {participant?.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Session Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files Shared</span>
                  <span className="font-medium text-foreground">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voice Messages</span>
                  <span className="font-medium text-foreground">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Call Duration</span>
                  <span className="font-medium text-foreground">
                    {Math.floor(callDuration / 60)}:{(callDuration % 60)?.toString()?.padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Used</span>
                  <span className="font-medium text-foreground">24.5 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Media Controls Modal */}
      {showMediaControls && (
        <ProgressiveMediaControls.MediaControlPanel
          mode="overlay"
          isOpen={showMediaControls}
          onClose={() => setShowMediaControls(false)}
          voiceProps={{
            isMuted,
            onToggleMute: handleToggleMute,
            volume: 50,
            onVolumeChange: (volume) => console.log('Volume:', volume)
          }}
          videoProps={{
            isVideoEnabled,
            onToggleVideo: handleToggleVideo,
            isScreenSharing,
            onToggleScreenShare: handleToggleScreenShare,
            availableCameras: []
          }}
          fileProps={{
            onFileSelect: handleFileSelect,
            onDrop: handleFileSelect
          }}
        />
      )}
    </div>
  );
};

export default MediaSharingVoiceChat;