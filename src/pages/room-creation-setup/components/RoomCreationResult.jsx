import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { SecurityBadge } from '../../../components/ui/SecurityIndicatorSystem';

const RoomCreationResult = ({
  roomData,
  onEnterRoom,
  onCreateAnother,
  onBackToDashboard,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Generate QR code URL (using a mock QR service)
  useEffect(() => {
    if (roomData?.roomLink) {
      // In a real app, you'd use a QR code generation service
      const qrData = encodeURIComponent(roomData?.roomLink);
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`);
    }
  }, [roomData?.roomLink]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopyStatus({ ...copyStatus, [type]: 'copied' });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [type]: null });
      }, 2000);
    } catch (err) {
      setCopyStatus({ ...copyStatus, [type]: 'error' });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [type]: null });
      }, 2000);
    }
  };

  const shareRoom = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${roomData?.roomName} on TempChat`,
          text: `Join my secure temporary chat room: ${roomData?.roomName}`,
          url: roomData?.roomLink
        });
      } catch (err) {
        // Fallback to copy
        copyToClipboard(roomData?.roomLink, 'share');
      }
    } else {
      copyToClipboard(roomData?.roomLink, 'share');
    }
  };

  if (!roomData) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Room Created Successfully!</h2>
          <p className="text-muted-foreground">
            Your secure temporary chat room is ready for participants
          </p>
        </div>
      </div>
      {/* Room Details Card */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Room Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{roomData?.roomName}</h3>
            <SecurityBadge level={roomData?.encryptionLevel} compact />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium text-foreground">{roomData?.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-muted-foreground">Max participants:</span>
              <span className="font-medium text-foreground">{roomData?.maxParticipants}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} className="text-primary" />
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground capitalize">{roomData?.roomType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success security-pulse" />
              <span className="text-muted-foreground">Security:</span>
              <span className="font-medium text-success">End-to-end encrypted</span>
            </div>
          </div>
        </div>

        {/* Room Access Details */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-medium text-foreground">Room Access Information</h4>
          
          {/* Room Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Room Link</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm text-foreground break-all">
                {roomData?.roomLink}
              </div>
              <Button
                variant="outline"
                size="icon"
                iconName={copyStatus?.link === 'copied' ? 'Check' : copyStatus?.link === 'error' ? 'X' : 'Copy'}
                onClick={() => copyToClipboard(roomData?.roomLink, 'link')}
                className={`
                  ${copyStatus?.link === 'copied' ? 'text-success border-success' : ''}
                  ${copyStatus?.link === 'error' ? 'text-error border-error' : ''}
                `}
              />
            </div>
          </div>

          {/* Room Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Room Password</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm text-foreground">
                {showPassword ? roomData?.password : '•'?.repeat(roomData?.password?.length)}
              </div>
              <Button
                variant="outline"
                size="icon"
                iconName={showPassword ? 'EyeOff' : 'Eye'}
                onClick={() => setShowPassword(!showPassword)}
              />
              <Button
                variant="outline"
                size="icon"
                iconName={copyStatus?.password === 'copied' ? 'Check' : copyStatus?.password === 'error' ? 'X' : 'Copy'}
                onClick={() => copyToClipboard(roomData?.password, 'password')}
                className={`
                  ${copyStatus?.password === 'copied' ? 'text-success border-success' : ''}
                  ${copyStatus?.password === 'error' ? 'text-error border-error' : ''}
                `}
              />
            </div>
          </div>

          {/* Room ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Room ID</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm text-foreground">
                {roomData?.roomId}
              </div>
              <Button
                variant="outline"
                size="icon"
                iconName={copyStatus?.roomId === 'copied' ? 'Check' : copyStatus?.roomId === 'error' ? 'X' : 'Copy'}
                onClick={() => copyToClipboard(roomData?.roomId, 'roomId')}
                className={`
                  ${copyStatus?.roomId === 'copied' ? 'text-success border-success' : ''}
                  ${copyStatus?.roomId === 'error' ? 'text-error border-error' : ''}
                `}
              />
            </div>
          </div>
        </div>
      </div>
      {/* QR Code & Sharing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
          <h4 className="font-medium text-foreground">QR Code</h4>
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <img 
                src={qrCodeUrl} 
                alt="Room QR Code" 
                className="w-32 h-32"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-32 h-32 bg-muted rounded-lg items-center justify-center hidden">
                <Icon name="QrCode" size={48} className="text-muted-foreground" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Scan with mobile device to join quickly
          </p>
        </div>

        {/* Sharing Options */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h4 className="font-medium text-foreground">Share Room</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Share"
              iconPosition="left"
              onClick={shareRoom}
              className="justify-start"
            >
              Share via System Share
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Mail"
              iconPosition="left"
              onClick={() => {
                const subject = encodeURIComponent(`Join ${roomData?.roomName} on TempChat`);
                const body = encodeURIComponent(`Join my secure temporary chat room:\n\nRoom: ${roomData?.roomName}\nLink: ${roomData?.roomLink}\nPassword: ${roomData?.password}\n\nThis room will auto-delete after ${roomData?.duration} minutes.`);
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
              className="justify-start"
            >
              Share via Email
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => {
                const text = encodeURIComponent(`Join ${roomData?.roomName} on TempChat: ${roomData?.roomLink} Password: ${roomData?.password}`);
                window.open(`sms:?body=${text}`);
              }}
              className="justify-start"
            >
              Share via SMS
            </Button>
          </div>
        </div>
      </div>
      {/* Security Notice */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5 flex-shrink-0 security-pulse" />
          <div className="text-xs">
            <p className="font-medium text-primary mb-1">Security Reminder</p>
            <p className="text-muted-foreground">
              This room will automatically self-destruct after {roomData?.duration} minutes. 
              All messages, files, and participant data will be permanently deleted. 
              Share the password only with trusted participants.
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
          onClick={onEnterRoom}
          className="spring-bounce"
        >
          Enter Room Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={onCreateAnother}
          className="spring-bounce"
        >
          Create Another Room
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          iconName="Home"
          iconPosition="left"
          onClick={onBackToDashboard}
          className="spring-bounce"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default RoomCreationResult;