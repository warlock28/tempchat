import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const RoomBasicSettings = ({
  roomName,
  onRoomNameChange,
  duration,
  onDurationChange,
  className = ""
}) => {
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getDurationColor = (minutes) => {
    if (minutes <= 15) return 'text-success';
    if (minutes <= 30) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Room Name Input */}
      <div className="space-y-2">
        <Input
          label="Room Name"
          type="text"
          placeholder="Enter a memorable room name"
          value={roomName}
          onChange={(e) => onRoomNameChange(e?.target?.value)}
          description="Choose a name that helps participants identify the room"
          maxLength={50}
          required
        />
        <div className="text-xs text-muted-foreground text-right">
          {roomName?.length}/50 characters
        </div>
      </div>
      {/* Duration Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Room Duration
          </label>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-md bg-muted ${getDurationColor(duration)}`}>
            <Icon name="Clock" size={14} />
            <span className="text-sm font-mono">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>5 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Duration Presets */}
          <div className="grid grid-cols-4 gap-2">
            {[5, 15, 30, 60]?.map((preset) => (
              <button
                key={preset}
                onClick={() => onDurationChange(preset)}
                className={`
                  px-3 py-2 text-xs rounded-md border transition-colors spring-bounce
                  ${duration === preset 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }
                `}
              >
                {formatDuration(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Auto-Destruction Notice</p>
            <p>
              Your room and all messages will be permanently deleted when the timer expires. 
              This ensures complete privacy and zero data retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBasicSettings;