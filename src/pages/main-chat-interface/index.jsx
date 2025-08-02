import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomStatusHeader from '../../components/ui/RoomStatusHeader';
import ContextualActionPanel from '../../components/ui/ContextualActionPanel';
import SecurityIndicatorSystem from '../../components/ui/SecurityIndicatorSystem';
import ProgressiveMediaControls from '../../components/ui/ProgressiveMediaControls';
import { useAuth } from '../../contexts/AuthContext';
import roomService from '../../services/roomService';
import AuthModal from '../../components/auth/AuthModal';

// Import page components
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import ParticipantsList from './components/ParticipantsList';
import TypingIndicator from './components/TypingIndicator';
import QuickPoll from './components/QuickPoll';
import MiniGameLauncher from './components/MiniGameLauncher';
import AchievementNotification from './components/AchievementNotification';

const MainChatInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState] = useState({});
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [userTypingTimeout, setUserTypingTimeout] = useState(null);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  // Room and message state
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPoll, setCurrentPoll] = useState(null);

  // Get room ID from URL params or location state
  const roomId = searchParams?.get('room') || location?.state?.roomId;

  // Initialize room data
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!roomId) {
      navigate('/room-access-authentication');
      return;
    }

    initializeRoom();
  }, [user, roomId]);

  const initializeRoom = async () => {
    if (!roomId || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Get room details
      const { data: room, error: roomError } = await roomService?.getRoomDetails(roomId);
      if (roomError) throw roomError;

      setRoomData(room);
      setParticipants(room?.participants?.filter(p => p?.is_active) || []);

      // Get room messages
      const { data: messageData, error: messagesError } = await roomService?.getRoomMessages(roomId);
      if (messagesError) throw messagesError;

      setMessages(messageData || []);

      // Subscribe to real-time updates
      const unsubscribeMessages = roomService?.subscribeToRoomMessages(roomId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      const unsubscribeParticipants = roomService?.subscribeToRoomParticipants(roomId, () => {
        // Refresh participants when changes occur
        roomService?.getRoomDetails(roomId)?.then(({ data }) => {
          if (data) {
            setParticipants(data?.participants?.filter(p => p?.is_active) || []);
          }
        });
      });

      return () => {
        unsubscribeMessages?.();
        unsubscribeParticipants?.();
      };
    } catch (err) {
      console.error('Error initializing room:', err);
      setError(err?.message || 'Failed to load room data');
      
      // Redirect to room access if room not found
      if (err?.message?.includes('not found') || err?.message?.includes('expired')) {
        navigate('/room-access-authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (messageData) => {
    if (!roomId || !user) return;

    try {
      const { data, error } = await roomService?.sendMessage(roomId, messageData);
      if (error) throw error;

      // Message will be added via real-time subscription
      // Trigger achievement for first message
      if (messages?.filter(m => m?.sender_id === user?.id)?.length === 0) {
        setTimeout(() => {
          setCurrentAchievement({
            type: 'first_message',
            title: 'First Steps',
            description: 'Sent your first message in TempChat',
            rarity: 'common',
            reward: '10 XP'
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle file uploads
  const handleFileUpload = (files) => {
    files?.forEach(file => {
      const messageData = {
        type: file?.type?.startsWith('image/') ? 'image' : 'file',
        content: `Shared ${file?.name}`,
        attachmentUrl: URL.createObjectURL(file),
        attachmentMetadata: {
          name: file?.name,
          size: file?.size,
          type: file?.type
        }
      };
      handleSendMessage(messageData);
    });
  };

  // Handle voice recording
  const handleVoiceRecord = (action) => {
    if (action === 'stop') {
      const messageData = {
        type: 'voice',
        content: '',
        attachmentMetadata: {
          duration: Math.floor(Math.random() * 60),
          type: 'voice'
        }
      };
      handleSendMessage(messageData);
    }
  };

  // Handle typing indicators
  const handleTyping = (isTyping) => {
    if (isTyping) {
      // Clear existing timeout
      if (userTypingTimeout) {
        clearTimeout(userTypingTimeout);
      }

      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        setTypingUsers(prev => prev?.filter(user => user?.id !== profile?.id));
      }, 3000);

      setUserTypingTimeout(timeout);
    }
  };

  // Handle message reactions
  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev?.map(msg => {
      if (msg?.id === messageId) {
        const reactions = msg?.reactions || [];
        const existingReaction = reactions?.find(r => r?.emoji === emoji);
        
        if (existingReaction) {
          existingReaction.count += 1;
        } else {
          reactions?.push({ emoji, count: 1 });
        }
        
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  // Handle poll creation
  const handleCreatePoll = (pollData) => {
    setCurrentPoll({
      ...pollData,
      id: Date.now(),
      userVote: undefined,
      totalVotes: 0
    });

    // Trigger achievement
    setTimeout(() => {
      setCurrentAchievement({
        type: 'poll_creator',
        title: 'Poll Master',
        description: 'Created your first quick poll',
        rarity: 'rare',
        reward: '25 XP'
      });
    }, 1000);
  };

  // Handle poll voting
  const handlePollVote = (optionId) => {
    if (currentPoll && currentPoll?.userVote === undefined) {
      setCurrentPoll(prev => ({
        ...prev,
        userVote: optionId,
        totalVotes: prev?.totalVotes + 1,
        options: prev?.options?.map(opt => 
          opt?.id === optionId 
            ? { ...opt, votes: opt?.votes + 1 }
            : opt
        )
      }));
    }
  };

  // Handle game actions
  const handleGameAction = (action, data) => {
    switch (action) {
      case 'answer':
        setGameState(prev => ({
          ...prev,
          score: (prev?.score || 0) + (data === 2 ? 10 : 0), // Correct answer is index 2
          questionNumber: (prev?.questionNumber || 1) + 1
        }));
        break;
      case 'next':
        // Load next question logic would go here
        break;
      default:
        break;
    }
  };

  // Handle leaving room
  const handleLeaveRoom = async () => {
    if (roomId) {
      await roomService?.leaveRoom(roomId);
    }
    navigate('/room-access-authentication');
  };

  // Show loading while checking auth or loading room
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icon name="Loader2" size={24} className="text-primary animate-spin" />
          <span className="text-muted-foreground">
            {authLoading ? 'Loading...' : 'Connecting to room...'}
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !roomData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="AlertTriangle" size={48} className="text-error mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Room Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="default"
            onClick={() => navigate('/room-access-authentication')}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Room Access
          </Button>
        </div>
      </div>
    );
  }

  const currentUser = participants?.find(p => p?.user_id === user?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Room Status Header */}
      <RoomStatusHeader
        roomId={roomData?.room_code || 'Loading...'}
        roomName={roomData?.room_name || 'Secure Chat Room'}
        participantCount={participants?.length || 0}
        expiresAt={roomData?.expires_at ? new Date(roomData.expires_at) : null}
        isEncrypted={roomData?.encryption_level === 'high'}
        connectionStatus="connected"
        userRole={currentUser?.role || 'participant'}
        onLeaveRoom={handleLeaveRoom}
        onRoomSettings={() => navigate('/room-management-settings')}
      />
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map((message, index) => {
              const isOwnMessage = message?.sender_id === user?.id;
              const showAvatar = !isOwnMessage && (
                index === 0 || 
                messages?.[index - 1]?.sender_id !== message?.sender_id
              );

              return (
                <MessageBubble
                  key={message?.id}
                  message={{
                    ...message,
                    sender: message?.sender || {
                      id: message?.sender_id,
                      name: 'Unknown User',
                      avatar: null
                    },
                    timestamp: new Date(message?.created_at),
                    delivered: true,
                    read: true
                  }}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                  onReaction={handleReaction}
                  onReply={(msg) => console.log('Reply to:', msg)}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          <TypingIndicator typingUsers={typingUsers} />

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onVoiceRecord={handleVoiceRecord}
            onTyping={handleTyping}
          />
        </div>

        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 lg:relative lg:w-80
          fixed inset-y-0 right-0 w-80 bg-background border-l border-border
          transition-transform duration-300 ease-in-out z-50
          flex flex-col
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Room Info</h2>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setIsSidebarOpen(false)}
                className="spring-bounce"
              />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Security Status */}
            <div className="space-y-3">
              <SecurityIndicatorSystem.SecurityBadge level={roomData?.encryption_level || 'high'} />
              <div className="flex items-center justify-between">
                <SecurityIndicatorSystem.ConnectionStatus 
                  status="connected" 
                  showDetails={false} 
                />
                <SecurityIndicatorSystem.ExpirationTimer 
                  expiresAt={roomData?.expires_at ? new Date(roomData.expires_at) : null}
                  showProgress={true}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Participants */}
            <ParticipantsList
              participants={participants?.map(p => ({
                id: p?.user_id,
                name: p?.user?.full_name || 'Unknown User',
                avatar: p?.user?.avatar_url,
                status: p?.is_active ? 'online' : 'offline',
                role: p?.role
              }))}
              currentUserId={user?.id}
              onPrivateMessage={(user) => console.log('Private message to:', user)}
              onBlock={(user) => console.log('Block user:', user)}
              onReport={(user) => console.log('Report user:', user)}
              onInvite={() => console.log('Invite users')}
              canInvite={currentUser?.role === 'admin'}
            />

            {/* Quick Poll */}
            <QuickPoll
              poll={currentPoll}
              onCreatePoll={handleCreatePoll}
              onVote={handlePollVote}
              onClosePoll={() => setCurrentPoll(null)}
              canCreatePoll={true}
            />

            {/* Mini Games */}
            <MiniGameLauncher
              activeGame={activeGame}
              onLaunchGame={setActiveGame}
              onCloseGame={() => setActiveGame(null)}
              gameState={gameState}
              onGameAction={handleGameAction}
            />
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`
          lg:hidden fixed bottom-4 right-4 z-40
          w-12 h-12 bg-primary text-primary-foreground rounded-full
          flex items-center justify-center shadow-lg spring-bounce
          ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <Icon name="Users" size={20} />
      </button>
      {/* Contextual Action Panel */}
      <ContextualActionPanel
        context="active"
        userRole={currentUser?.role || 'participant'}
        roomState="active"
        onInviteUsers={() => console.log('Invite users')}
        onStartGame={() => setActiveGame('trivia')}
        onShareMedia={() => setShowMediaControls(true)}
      />
      {/* Media Controls Modal */}
      <ProgressiveMediaControls.MediaControlPanel
        mode="overlay"
        isOpen={showMediaControls}
        onClose={() => setShowMediaControls(false)}
        voiceProps={{
          isMuted: false,
          isDeafened: false,
          volume: 75,
          onToggleMute: () => console.log('Toggle mute'),
          onToggleDeafen: () => console.log('Toggle deafen'),
          onVolumeChange: (vol) => console.log('Volume:', vol)
        }}
        videoProps={{
          isVideoEnabled: false,
          isScreenSharing: false,
          onToggleVideo: () => console.log('Toggle video'),
          onToggleScreenShare: () => console.log('Toggle screen share'),
          availableCameras: [
            { deviceId: 'camera1', label: 'Built-in Camera' },
            { deviceId: 'camera2', label: 'External Webcam' }
          ]
        }}
        fileProps={{
          onFileSelect: handleFileUpload,
          onDrop: handleFileUpload
        }}
      />
      {/* Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
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

export default MainChatInterface;