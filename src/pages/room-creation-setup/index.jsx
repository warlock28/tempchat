import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomStatusHeader from '../../components/ui/RoomStatusHeader';
import RoomBasicSettings from './components/RoomBasicSettings';
import SecurityOptions from './components/SecurityOptions';
import ParticipantSettings from './components/ParticipantSettings';
import AdvancedSettings from './components/AdvancedSettings';
import RoomCreationResult from './components/RoomCreationResult';
import { useAuth } from '../../contexts/AuthContext';
import roomService from '../../services/roomService';
import AuthModal from '../../components/auth/AuthModal';

const RoomCreationSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  
  // Form state
  const [currentStep, setCurrentStep] = useState('setup'); // 'setup' | 'result'
  const [isCreating, setIsCreating] = useState(false);
  
  // Room basic settings
  const [roomName, setRoomName] = useState('');
  const [duration, setDuration] = useState(30);
  
  // Security settings
  const [encryptionLevel, setEncryptionLevel] = useState('high');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  
  // Participant settings
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [roomType, setRoomType] = useState('games');
  
  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    colorScheme: 'default',
    profanityFilter: true,
    spamDetection: true,
    linkBlocking: false,
    imageModeration: false,
    anonymousMode: false,
    hideTypingIndicators: false,
    disableReadReceipts: false,
    preventScreenshots: false
  });
  
  // Created room data
  const [createdRoom, setCreatedRoom] = useState(null);
  const [error, setError] = useState(null);

  // Check auth before creating room
  const handleCreateRoom = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!roomName?.trim()) {
      setError('Room name is required');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      const roomData = {
        roomName: roomName?.trim(),
        roomType,
        encryptionLevel,
        isPasswordProtected,
        customPassword: isPasswordProtected ? customPassword : null,
        maxParticipants,
        duration,
        advancedSettings
      };

      const { data, error: createError } = await roomService?.createRoom(roomData);
      
      if (createError) throw createError;
      
      setCreatedRoom({
        roomId: data?.room_id,
        roomCode: data?.room_code,
        roomName: roomName?.trim(),
        roomLink: data?.room_link || `${window.location?.origin}/room-access-authentication?room=${data?.room_code}`,
        password: isPasswordProtected ? customPassword : data?.room_code,
        duration,
        maxParticipants,
        roomType,
        encryptionLevel,
        isPasswordProtected,
        advancedSettings,
        createdAt: new Date()?.toISOString(),
        expiresAt: data?.expires_at
      });
      
      setCurrentStep('result');
    } catch (err) {
      console.error('Failed to create room:', err);
      setError(err?.message || 'Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEnterRoom = () => {
    if (createdRoom) {
      navigate(`/main-chat-interface?room=${createdRoom?.roomId}`);
    }
  };

  const handleCreateAnother = () => {
    setCurrentStep('setup');
    setCreatedRoom(null);
    setRoomName('');
    setDuration(30);
    setEncryptionLevel('high');
    setIsPasswordProtected(false);
    setCustomPassword('');
    setMaxParticipants(5);
    setRoomType('games');
    setShowAdvanced(false);
    setError(null);
    setAdvancedSettings({
      colorScheme: 'default',
      profanityFilter: true,
      spamDetection: true,
      linkBlocking: false,
      imageModeration: false,
      anonymousMode: false,
      hideTypingIndicators: false,
      disableReadReceipts: false,
      preventScreenshots: false
    });
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const isFormValid = () => {
    if (!roomName?.trim()) return false;
    if (isPasswordProtected && customPassword && customPassword?.length < 8) return false;
    return true;
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icon name="Loader2" size={24} className="text-primary animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoomStatusHeader
        roomName="Room Creation"
        userRole="creator"
        connectionStatus="connected"
        isEncrypted={encryptionLevel === 'high'}
      />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {currentStep === 'setup' ? (
          <>
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Plus" size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Secure Room</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Set up your temporary, encrypted chat room with custom security preferences 
                and participant settings. All data will be automatically destroyed after the specified duration.
              </p>
            </div>

            {/* Creation Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Settings */}
              <div className="space-y-8">
                {/* Room Basic Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Icon name="MessageSquare" size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Basic Settings</h2>
                  </div>
                  <RoomBasicSettings
                    roomName={roomName}
                    onRoomNameChange={setRoomName}
                    duration={duration}
                    onDurationChange={setDuration}
                  />
                </div>

                {/* Participant Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Icon name="Users" size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Participants & Type</h2>
                  </div>
                  <ParticipantSettings
                    maxParticipants={maxParticipants}
                    onMaxParticipantsChange={setMaxParticipants}
                    roomType={roomType}
                    onRoomTypeChange={setRoomType}
                  />
                </div>
              </div>

              {/* Right Column - Security & Advanced */}
              <div className="space-y-8">
                {/* Security Options */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Icon name="Shield" size={20} className="text-primary security-pulse" />
                    <h2 className="text-lg font-semibold text-foreground">Security Options</h2>
                  </div>
                  <SecurityOptions
                    encryptionLevel={encryptionLevel}
                    onEncryptionLevelChange={setEncryptionLevel}
                    isPasswordProtected={isPasswordProtected}
                    onPasswordProtectionChange={setIsPasswordProtected}
                    customPassword={customPassword}
                    onCustomPasswordChange={setCustomPassword}
                  />
                </div>

                {/* Advanced Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <AdvancedSettings
                    isExpanded={showAdvanced}
                    onToggleExpanded={() => setShowAdvanced(!showAdvanced)}
                    settings={advancedSettings}
                    onSettingsChange={setAdvancedSettings}
                  />
                </div>
              </div>
            </div>

            {/* Create Room Button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={handleBackToDashboard}
                className="spring-bounce"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateRoom}
                disabled={!isFormValid() || isCreating}
                loading={isCreating}
                className="spring-bounce min-w-48"
              >
                {isCreating ? 'Creating Room...' : 'Create Secure Room'}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            )}

            {/* Form Validation Notice */}
            {!isFormValid() && roomName?.length > 0 && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <p className="text-sm text-warning">
                    {!roomName?.trim() && "Room name is required"}
                    {isPasswordProtected && customPassword && customPassword?.length < 8 && "Custom password must be at least 8 characters"}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Room Creation Result */
          (<RoomCreationResult
            roomData={createdRoom}
            onEnterRoom={handleEnterRoom}
            onCreateAnother={handleCreateAnother}
            onBackToDashboard={handleBackToDashboard}
          />)
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default RoomCreationSetup;