import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AlternativeAccessMethods = ({ 
  onQRScan = () => {},
  onInvitationLink = () => {},
  isLoading = false,
  className = ""
}) => {
  const [inviteLink, setInviteLink] = useState('');
  const [isValidLink, setIsValidLink] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const validateInviteLink = (link) => {
    // Mock validation for TempChat invitation links
    const tempChatPattern = /^https:\/\/(tempchat\.app|localhost:\d+)\/join\/[A-Z0-9]{15}$/i;
    return tempChatPattern?.test(link);
  };

  const handleInviteLinkChange = (e) => {
    const link = e?.target?.value?.trim();
    setInviteLink(link);
    setIsValidLink(validateInviteLink(link));
  };

  const handleInviteLinkSubmit = () => {
    if (isValidLink) {
      // Extract room code from link
      const roomCode = inviteLink?.split('/')?.pop();
      onInvitationLink(roomCode);
    }
  };

  const handleQRScan = async () => {
    setIsScanning(true);
    try {
      // Mock QR scanner activation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would activate camera and scan QR code
      onQRScan();
    } finally {
      setIsScanning(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      if (validateInviteLink(text)) {
        setInviteLink(text);
        setIsValidLink(true);
      }
    } catch (err) {
      console.warn('Failed to read clipboard:', err);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium">
            Alternative Methods
          </span>
        </div>
      </div>

      {/* QR Code Scanner */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Scan QR Code</h3>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleQRScan}
          disabled={isLoading || isScanning}
          loading={isScanning}
          iconName="QrCode"
          iconPosition="left"
          className="spring-bounce"
        >
          {isScanning ? 'Opening Camera...' : 'Scan QR Code'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Point your camera at the room's QR code to join instantly
        </p>
      </div>

      {/* Invitation Link */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Invitation Link</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePasteFromClipboard}
            iconName="Clipboard"
            iconPosition="left"
            className="text-xs"
          >
            Paste
          </Button>
        </div>
        
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://tempchat.app/join/..."
            value={inviteLink}
            onChange={handleInviteLinkChange}
            className="text-sm"
            disabled={isLoading}
          />
          
          {/* Link Validation */}
          {inviteLink && (
            <div className="flex items-center space-x-2 text-xs">
              {isValidLink ? (
                <>
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span className="text-success">Valid invitation link</span>
                </>
              ) : (
                <>
                  <Icon name="AlertCircle" size={12} className="text-error" />
                  <span className="text-error">Invalid link format</span>
                </>
              )}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="default"
          fullWidth
          onClick={handleInviteLinkSubmit}
          disabled={!isValidLink || isLoading}
          iconName="ExternalLink"
          iconPosition="right"
          className="spring-bounce"
        >
          Join via Link
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Need Help?</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Room codes are 15 characters long</li>
              <li>• QR codes contain the same access information</li>
              <li>• Invitation links expire with the room</li>
              <li>• All methods provide the same security level</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeAccessMethods;