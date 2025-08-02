import React from 'react';
import Icon from '../../../components/AppIcon';

const ParticipantSettings = ({
  maxParticipants,
  onMaxParticipantsChange,
  roomType,
  onRoomTypeChange,
  className = ""
}) => {
  const participantLimits = [
    { value: 2, label: '2 people', description: 'Private conversation', icon: 'Users' },
    { value: 5, label: '5 people', description: 'Small group chat', icon: 'Users' },
    { value: 10, label: '10 people', description: 'Team discussion', icon: 'Users' },
    { value: 20, label: '20 people', description: 'Large group', icon: 'Users' },
    { value: 50, label: '50 people', description: 'Community chat', icon: 'Users' }
  ];

  const roomTypes = [
    {
      id: 'text',
      name: 'Text Only',
      description: 'Simple text messaging with emoji reactions',
      features: ['Text messages', 'Emoji reactions', 'File sharing', 'Typing indicators'],
      icon: 'MessageSquare',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      id: 'media',
      name: 'Media Enabled',
      description: 'Text plus voice messages and file sharing',
      features: ['All text features', 'Voice messages', 'Image sharing', 'Video sharing'],
      icon: 'Mic',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      id: 'games',
      name: 'Games & Activities',
      description: 'Interactive room with games and collaborative features',
      features: ['All media features', 'Mini-games', 'Polls & voting', 'Drawing canvas'],
      icon: 'Gamepad2',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      popular: true
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Participant Limit */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Maximum Participants</h3>
          <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
            <Icon name="Users" size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {maxParticipants} {maxParticipants === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {participantLimits?.map((limit) => (
            <button
              key={limit?.value}
              onClick={() => onMaxParticipantsChange(limit?.value)}
              className={`
                p-3 border rounded-lg text-center transition-all spring-bounce
                ${maxParticipants === limit?.value 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <Icon 
                name={limit?.icon} 
                size={20} 
                className={`mx-auto mb-2 ${maxParticipants === limit?.value ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <div className="text-sm font-medium text-foreground mb-1">
                {limit?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {limit?.description}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Performance Notice</p>
            <p>
              Larger groups may experience slower message delivery and increased bandwidth usage. 
              For optimal performance, consider smaller group sizes.
            </p>
          </div>
        </div>
      </div>
      {/* Room Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Room Type</h3>
          <div className="flex items-center space-x-2">
            {roomTypes?.find(type => type?.id === roomType)?.popular && (
              <span className="px-2 py-0.5 text-xs bg-success/10 text-success rounded-full">
                Popular
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {roomTypes?.map((type) => (
            <div
              key={type?.id}
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all spring-bounce
                ${roomType === type?.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => onRoomTypeChange(type?.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  p-3 rounded-lg ${type?.bgColor}
                  ${roomType === type?.id ? 'ring-2 ring-primary/20' : ''}
                `}>
                  <Icon name={type?.icon} size={24} className={type?.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${roomType === type?.id 
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                      }
                    `}>
                      {roomType === type?.id && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                    <h4 className="font-medium text-foreground">{type?.name}</h4>
                    {type?.popular && (
                      <span className="px-2 py-0.5 text-xs bg-success/10 text-success rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {type?.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {type?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Icon name="Check" size={12} className="text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Capacity Warning */}
      {maxParticipants > 20 && (
        <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-warning mb-1">High Capacity Warning</p>
            <p className="text-muted-foreground">
              Rooms with {maxParticipants} participants may experience performance issues. 
              Consider enabling moderation features and limiting media sharing for optimal experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantSettings;