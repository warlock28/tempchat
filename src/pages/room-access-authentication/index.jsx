import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomAccessCard from './components/RoomAccessCard';
import AlternativeAccessMethods from './components/AlternativeAccessMethods';
import RecentRoomsList from './components/RecentRoomsList';
import SecurityInfoSidebar from './components/SecurityInfoSidebar';
import { useAuth } from '../../contexts/AuthContext';
import roomService from '../../services/roomService';
import AuthModal from '../../components/auth/AuthModal';

const RoomAccessAuthentication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  useEffect(() => {
    // Check for invitation link parameters
    const inviteCode = searchParams?.get('room');
    if (inviteCode && inviteCode?.length >= 15) {
      handleJoinRoom(inviteCode);
    }

    // Simulate connection status
    setConnectionStatus('connected');
  }, [searchParams, user]);

  const handleJoinRoom = async (roomCode, password = null) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setConnectionStatus('connecting');

    try {
      const { data, error: joinError } = await roomService?.joinRoom(roomCode, password);
      
      if (joinError) throw joinError;
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to join room');
      }

      // Save to recent rooms
      const recentRooms = JSON.parse(localStorage.getItem('tempChatRecentRooms') || '[]');
      const roomData = {
        id: data?.room_id,
        roomCode: roomCode?.toUpperCase(),
        name: data?.room_name || 'Secure Chat Room',
        lastAccessed: new Date(),
        isEncrypted: true
      };

      const updatedRooms = [roomData, ...recentRooms?.filter(r => r?.id !== data?.room_id)]?.slice(0, 5);
      localStorage.setItem('tempChatRecentRooms', JSON.stringify(updatedRooms));

      setConnectionStatus('connected');
      
      // Navigate to main chat interface
      navigate('/main-chat-interface', { 
        state: { 
          roomId: data?.room_id,
          roomName: data?.room_name,
          isEncrypted: true 
        } 
      });

    } catch (err) {
      console.error('Join room error:', err);
      setError(err?.message || 'Failed to join room. Please check the room code and try again.');
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Mock QR code scanning result - in real app, this would use camera
      const mockQRCode = 'ABC123DEF456GHI';
      await handleJoinRoom(mockQRCode);
    } catch (err) {
      setError('Failed to scan QR code. Please try again.');
    }
  };

  const handleInvitationLink = async (roomCode) => {
    await handleJoinRoom(roomCode);
  };

  const handleJoinRecentRoom = async (roomId, roomCode) => {
    await handleJoinRoom(roomCode);
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
    <>
      <Helmet>
        <title>Join Room - TempChat | Secure Temporary Chat</title>
        <meta name="description" content="Join a secure temporary chat room with end-to-end encryption. Enter your room code or scan QR code for instant access." />
        <meta name="keywords" content="secure chat, temporary chat, encrypted messaging, room access, privacy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Global Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={18} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">TempChat</h1>
                  <p className="text-xs text-muted-foreground">Secure • Temporary • Private</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/room-creation-setup')}
                  iconName="Plus"
                  iconPosition="left"
                  className="spring-bounce"
                >
                  Create Room
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/room-management-settings')}
                  iconName="Settings"
                  iconPosition="left"
                  className="spring-bounce"
                >
                  Settings
                </Button>
                
                {/* Auth Status */}
                {user ? (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-full">
                    <Icon name="User" size={14} className="text-success" />
                    <span className="text-xs text-success font-medium">Authenticated</span>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    iconName="LogIn"
                    iconPosition="left"
                    className="spring-bounce"
                  >
                    Sign In
                  </Button>
                )}
              </nav>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Menu"
                  className="spring-bounce"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Main Access Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Room Access Card */}
              <RoomAccessCard
                onJoinRoom={handleJoinRoom}
                isLoading={isLoading}
                error={error}
              />

              {/* Alternative Access Methods */}
              <AlternativeAccessMethods
                onQRScan={handleQRScan}
                onInvitationLink={handleInvitationLink}
                isLoading={isLoading}
              />

              {/* Recent Rooms List */}
              <RecentRoomsList
                onJoinRecentRoom={handleJoinRecentRoom}
                isLoading={isLoading}
              />

              {/* Mobile Security Info */}
              <div className="lg:hidden">
                <SecurityInfoSidebar />
              </div>
            </div>

            {/* Right Column - Security Information (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <SecurityInfoSidebar />
              </div>
            </div>
          </div>
        </main>

        {/* Connection Status Indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className={`
            flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium
            ${connectionStatus === 'connected' ?'bg-success/10 text-success border border-success/20' 
              : connectionStatus === 'connecting' ?'bg-warning/10 text-warning border border-warning/20' :'bg-error/10 text-error border border-error/20'
            }
          `}>
            <Icon 
              name={connectionStatus === 'connected' ? 'Wifi' : connectionStatus === 'connecting' ? 'Loader2' : 'WifiOff'} 
              size={12} 
              className={connectionStatus === 'connecting' ? 'animate-spin' : ''}
            />
            <span className="capitalize">{connectionStatus}</span>
          </div>
        </div>

        {/* Quick Actions FAB (Mobile) */}
        <div className="fixed bottom-4 left-4 md:hidden z-40">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate('/room-creation-setup')}
            iconName="Plus"
            className="w-12 h-12 rounded-full shadow-lg spring-bounce"
            aria-label="Create new room"
          />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-150 flex items-center justify-center">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-sm mx-4">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={24} className="text-primary animate-spin" />
                <div>
                  <h3 className="font-semibold text-foreground">Connecting to Room</h3>
                  <p className="text-sm text-muted-foreground">
                    Establishing secure connection...
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Shield" size={12} className="text-success" />
                  <span>Encrypting connection</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Key" size={12} className="text-success" />
                  <span>Exchanging keys</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Lock" size={12} className="text-success" />
                  <span>Securing session</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default RoomAccessAuthentication;