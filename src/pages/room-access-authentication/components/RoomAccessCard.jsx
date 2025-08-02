import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RoomAccessCard = ({ 
  onJoinRoom = () => {},
  isLoading = false,
  error = null,
  className = ""
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const formatRoomCode = (value) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value?.replace(/[^A-Z0-9]/g, '')?.toUpperCase();
    
    // Format as XXX-XXX-XXX-XXX-XXX (15 characters with dashes)
    const formatted = cleaned?.match(/.{1,3}/g)?.join('-') || cleaned;
    
    // Limit to 15 characters plus 4 dashes
    return formatted?.substring(0, 19);
  };

  const handleRoomCodeChange = (e) => {
    const formatted = formatRoomCode(e?.target?.value);
    setRoomCode(formatted);
    
    // Real-time validation
    if (formatted?.replace(/-/g, '')?.length === 15) {
      setIsValidating(true);
      setTimeout(() => setIsValidating(false), 500);
    }
  };

  const handleJoinRoom = () => {
    const cleanCode = roomCode?.replace(/-/g, '');
    if (cleanCode?.length === 15) {
      onJoinRoom(cleanCode);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && isValidCode()) {
      handleJoinRoom();
    }
  };

  const isValidCode = () => {
    const cleanCode = roomCode?.replace(/-/g, '');
    return cleanCode?.length === 15;
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-6 lg:p-8 shadow-lg ${className}`}>
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Join Room
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Enter the 15-digit room code to access the secure chat
        </p>
      </div>
      <div className="space-y-6">
        {/* Room Code Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            Room Access Code
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="XXX-XXX-XXX-XXX-XXX"
              value={roomCode}
              onChange={handleRoomCodeChange}
              onKeyPress={handleKeyPress}
              className="text-center font-mono text-lg tracking-wider pr-12"
              maxLength={19}
              error={error}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
              disabled={isLoading}
            >
              <Icon 
                name={showPassword ? "EyeOff" : "Eye"} 
                size={18} 
                className="text-muted-foreground hover:text-foreground"
              />
            </button>
          </div>
          
          {/* Validation Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            {isValidating ? (
              <>
                <Icon name="Loader2" size={12} className="text-warning animate-spin" />
                <span className="text-warning">Validating code...</span>
              </>
            ) : isValidCode() ? (
              <>
                <Icon name="CheckCircle" size={12} className="text-success" />
                <span className="text-success">Valid format</span>
              </>
            ) : roomCode?.length > 0 ? (
              <>
                <Icon name="AlertCircle" size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  {15 - roomCode?.replace(/-/g, '')?.length} characters remaining
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Join Button */}
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={handleJoinRoom}
          disabled={!isValidCode() || isLoading}
          loading={isLoading}
          iconName="ArrowRight"
          iconPosition="right"
          className="spring-bounce"
        >
          {isLoading ? 'Connecting...' : 'Join Room'}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-error flex-shrink-0" />
            <span className="text-error text-sm">{error}</span>
          </div>
        )}

        {/* Security Indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} className="text-success security-pulse" />
          <span>End-to-end encrypted connection</span>
        </div>
      </div>
    </div>
  );
};

export default RoomAccessCard;