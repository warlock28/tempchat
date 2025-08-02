import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const AchievementNotification = ({ 
  achievement = null,
  onClose = () => {},
  duration = 4000,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievement, duration, onClose]);

  if (!achievement || !isVisible) return null;

  const getAchievementIcon = () => {
    switch (achievement?.type) {
      case 'first_message': return 'MessageCircle';
      case 'game_winner': return 'Trophy';
      case 'social_butterfly': return 'Users';
      case 'file_sharer': return 'Share';
      case 'voice_master': return 'Mic';
      case 'emoji_lover': return 'Smile';
      case 'poll_creator': return 'BarChart3';
      case 'room_creator': return 'Crown';
      default: return 'Award';
    }
  };

  const getAchievementColor = () => {
    switch (achievement?.rarity) {
      case 'common': return 'text-muted-foreground';
      case 'rare': return 'text-primary';
      case 'epic': return 'text-accent';
      case 'legendary': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getBadgeColor = () => {
    switch (achievement?.rarity) {
      case 'common': return 'bg-muted';
      case 'rare': return 'bg-primary/10 border-primary/20';
      case 'epic': return 'bg-accent/10 border-accent/20';
      case 'legendary': return 'bg-warning/10 border-warning/20';
      default: return 'bg-success/10 border-success/20';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-200 max-w-sm w-full
      transform transition-all duration-300 ease-out
      ${isLeaving 
        ? 'translate-x-full opacity-0' :'translate-x-0 opacity-100'
      }
      ${className}
    `}>
      <div className={`
        bg-card border-2 rounded-lg shadow-modal p-4
        ${getBadgeColor()}
        spring-bounce
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${getBadgeColor()}
            `}>
              <Icon 
                name={getAchievementIcon()} 
                size={16} 
                className={getAchievementColor()}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Achievement Unlocked
              </p>
              <p className={`text-xs font-medium ${getAchievementColor()}`}>
                {achievement?.rarity?.toUpperCase()}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsLeaving(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">
            {achievement?.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {achievement?.description}
          </p>
        </div>

        {/* Progress/Reward */}
        {achievement?.reward && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Gift" size={12} className="text-accent" />
              <span className="text-xs text-muted-foreground">
                Reward: {achievement?.reward}
              </span>
            </div>
          </div>
        )}

        {/* Celebration Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-1 h-1 bg-warning rounded-full animate-ping" />
          <div className="absolute top-4 right-6 w-1 h-1 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-6 w-1 h-1 bg-success rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;