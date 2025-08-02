import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentRoomsList = ({ 
  onJoinRecentRoom = () => {},
  isLoading = false,
  className = ""
}) => {
  const [recentRooms, setRecentRooms] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});

  // Mock recent rooms data
  const mockRecentRooms = [
    {
      id: "ABC123DEF456GHI",
      name: "Project Alpha Discussion",
      lastAccessed: new Date(Date.now() - 300000), // 5 minutes ago
      expiresAt: new Date(Date.now() + 1800000), // 30 minutes from now
      participantCount: 4,
      isEncrypted: true,
      roomType: "private"
    },
    {
      id: "XYZ789UVW012QRS",
      name: "Team Standup",
      lastAccessed: new Date(Date.now() - 900000), // 15 minutes ago
      expiresAt: new Date(Date.now() + 600000), // 10 minutes from now
      participantCount: 7,
      isEncrypted: true,
      roomType: "work"
    },
    {
      id: "MNO345PQR678STU",
      name: "Gaming Session",
      lastAccessed: new Date(Date.now() - 1800000), // 30 minutes ago
      expiresAt: new Date(Date.now() + 300000), // 5 minutes from now
      participantCount: 2,
      isEncrypted: true,
      roomType: "social"
    }
  ];

  useEffect(() => {
    // Load recent rooms from localStorage or API
    const savedRooms = localStorage.getItem('tempChatRecentRooms');
    if (savedRooms) {
      try {
        const parsed = JSON.parse(savedRooms);
        setRecentRooms(parsed?.filter(room => new Date(room.expiresAt) > new Date()));
      } catch (err) {
        console.warn('Failed to parse recent rooms:', err);
        setRecentRooms(mockRecentRooms);
      }
    } else {
      setRecentRooms(mockRecentRooms);
    }
  }, []);

  useEffect(() => {
    // Update timers every second
    const interval = setInterval(() => {
      const newTimeRemaining = {};
      recentRooms?.forEach(room => {
        const remaining = new Date(room.expiresAt)?.getTime() - Date.now();
        if (remaining > 0) {
          const minutes = Math.floor(remaining / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          newTimeRemaining[room.id] = { minutes, seconds, total: remaining };
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [recentRooms]);

  const formatTimeRemaining = (roomId) => {
    const time = timeRemaining?.[roomId];
    if (!time) return 'Expired';
    
    if (time?.minutes > 0) {
      return `${time?.minutes}m ${time?.seconds}s`;
    }
    return `${time?.seconds}s`;
  };

  const getTimeColor = (roomId) => {
    const time = timeRemaining?.[roomId];
    if (!time) return 'text-error';
    if (time?.total < 300000) return 'text-error'; // Less than 5 minutes
    if (time?.total < 900000) return 'text-warning'; // Less than 15 minutes
    return 'text-success';
  };

  const getRoomTypeIcon = (type) => {
    switch (type) {
      case 'work': return 'Briefcase';
      case 'social': return 'Users';
      case 'private': return 'Lock';
      default: return 'MessageSquare';
    }
  };

  const handleJoinRoom = (room) => {
    if (timeRemaining?.[room?.id]?.total > 0) {
      onJoinRecentRoom(room?.id);
    }
  };

  const handleRemoveRoom = (roomId, e) => {
    e?.stopPropagation();
    const updatedRooms = recentRooms?.filter(room => room?.id !== roomId);
    setRecentRooms(updatedRooms);
    localStorage.setItem('tempChatRecentRooms', JSON.stringify(updatedRooms));
  };

  if (recentRooms?.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Rooms</h3>
        <span className="text-xs text-muted-foreground">
          {recentRooms?.length} room{recentRooms?.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {recentRooms?.map((room) => {
          const isExpired = !timeRemaining?.[room?.id] || timeRemaining?.[room?.id]?.total <= 0;
          const isExpiring = timeRemaining?.[room?.id]?.total < 300000; // Less than 5 minutes
          
          return (
            <div
              key={room?.id}
              className={`
                bg-card border border-border rounded-lg p-4 transition-all spring-bounce
                ${isExpired 
                  ? 'opacity-50 cursor-not-allowed' :'hover:bg-muted/50 cursor-pointer hover:border-primary/20'
                }
                ${isExpiring && !isExpired ? 'border-warning/30 bg-warning/5' : ''}
              `}
              onClick={() => !isExpired && handleJoinRoom(room)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {/* Room Type Icon */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isExpired ? 'bg-muted' : 'bg-primary/10'}
                  `}>
                    <Icon 
                      name={getRoomTypeIcon(room?.roomType)} 
                      size={18} 
                      className={isExpired ? 'text-muted-foreground' : 'text-primary'}
                    />
                  </div>

                  {/* Room Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground truncate text-sm">
                        {room?.name}
                      </h4>
                      {room?.isEncrypted && (
                        <Icon 
                          name="Shield" 
                          size={12} 
                          className="text-success security-pulse flex-shrink-0"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={10} />
                        <span>{room?.participantCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={10} />
                        <span className={getTimeColor(room?.id)}>
                          {isExpired ? 'Expired' : formatTimeRemaining(room?.id)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!isExpired && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ArrowRight"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleJoinRoom(room);
                      }}
                      disabled={isLoading}
                      className="spring-bounce"
                    >
                      Join
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    onClick={(e) => handleRemoveRoom(room?.id, e)}
                    className="w-8 h-8 text-muted-foreground hover:text-error"
                  />
                </div>
              </div>
              {/* Expiration Warning */}
              {isExpiring && !isExpired && (
                <div className="mt-3 flex items-center space-x-2 text-xs text-warning">
                  <Icon name="AlertTriangle" size={12} />
                  <span>Room expires soon - join now to continue</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Clear All Button */}
      {recentRooms?.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => {
            setRecentRooms([]);
            localStorage.removeItem('tempChatRecentRooms');
          }}
          iconName="Trash2"
          iconPosition="left"
          className="text-muted-foreground hover:text-error mt-4"
        >
          Clear All Recent Rooms
        </Button>
      )}
    </div>
  );
};

export default RecentRoomsList;