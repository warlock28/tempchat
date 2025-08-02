import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RoomConfiguration = ({ 
  currentConfig = {},
  onUpdateConfig = () => {},
  className = ""
}) => {
  const [config, setConfig] = useState({
    roomName: "TempChat Room #A1B2C3",
    maxParticipants: 10,
    currentDuration: 30,
    maxDurationExtension: 60,
    gamesEnabled: true,
    mediaSharingEnabled: true,
    voiceChatEnabled: true,
    fileUploadEnabled: true,
    pollsEnabled: true,
    drawingCanvasEnabled: true,
    iceBreakerEnabled: true,
    reactionAnimationsEnabled: true,
    ...currentConfig
  });

  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extensionMinutes, setExtensionMinutes] = useState(15);
  const [isExtending, setIsExtending] = useState(false);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdateConfig(newConfig);
  };

  const handleExtendRoom = async () => {
    setIsExtending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleConfigChange('currentDuration', config?.currentDuration + extensionMinutes);
      setShowExtendModal(false);
      setExtensionMinutes(15);
    } finally {
      setIsExtending(false);
    }
  };

  const getRemainingTime = () => {
    // Mock calculation - in real app this would be based on room creation time
    const remainingMinutes = config?.currentDuration - 15; // Assuming 15 minutes have passed
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTimeWarningLevel = () => {
    const remainingMinutes = config?.currentDuration - 15;
    if (remainingMinutes <= 5) return { level: 'critical', color: 'text-error', bgColor: 'bg-error/10' };
    if (remainingMinutes <= 15) return { level: 'warning', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { level: 'normal', color: 'text-success', bgColor: 'bg-success/10' };
  };

  const timeWarning = getTimeWarningLevel();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Room Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Room Status</h3>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${timeWarning?.bgColor}`}>
            <Icon name="Clock" size={16} className={`${timeWarning?.color} ${timeWarning?.level === 'critical' ? 'security-pulse' : ''}`} />
            <span className={`text-sm font-medium ${timeWarning?.color}`}>
              {getRemainingTime()} remaining
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="Users" size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">4 / {config?.maxParticipants}</div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="MessageSquare" size={24} className="mx-auto mb-2 text-success" />
            <div className="text-sm font-medium text-foreground">127</div>
            <div className="text-xs text-muted-foreground">Messages Sent</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="Upload" size={24} className="mx-auto mb-2 text-warning" />
            <div className="text-sm font-medium text-foreground">8</div>
            <div className="text-xs text-muted-foreground">Files Shared</div>
          </div>
        </div>
      </div>
      {/* Basic Configuration */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Basic Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Room Name"
            type="text"
            value={config?.roomName}
            onChange={(e) => handleConfigChange('roomName', e?.target?.value)}
            description="Visible to all participants"
          />
          
          <Input
            label="Max Participants"
            type="number"
            min="2"
            max="50"
            value={config?.maxParticipants}
            onChange={(e) => handleConfigChange('maxParticipants', parseInt(e?.target?.value))}
            description="Current: 4 participants"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <div>
              <div className="font-medium text-foreground">Room Duration</div>
              <div className="text-sm text-muted-foreground">
                {getRemainingTime()} remaining of {config?.currentDuration} minutes
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowExtendModal(true)}
            disabled={config?.currentDuration >= config?.maxDurationExtension}
          >
            Extend
          </Button>
        </div>
      </div>
      {/* Feature Toggles */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Features</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Gamepad2" size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-foreground">Mini Games</div>
                  <div className="text-sm text-muted-foreground">Trivia, word games, etc.</div>
                </div>
              </div>
              <Checkbox
                checked={config?.gamesEnabled}
                onChange={(e) => handleConfigChange('gamesEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Upload" size={20} className="text-success" />
                <div>
                  <div className="font-medium text-foreground">Media Sharing</div>
                  <div className="text-sm text-muted-foreground">Images, videos, files</div>
                </div>
              </div>
              <Checkbox
                checked={config?.mediaSharingEnabled}
                onChange={(e) => handleConfigChange('mediaSharingEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Mic" size={20} className="text-warning" />
                <div>
                  <div className="font-medium text-foreground">Voice Chat</div>
                  <div className="text-sm text-muted-foreground">Voice messages & calls</div>
                </div>
              </div>
              <Checkbox
                checked={config?.voiceChatEnabled}
                onChange={(e) => handleConfigChange('voiceChatEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="BarChart" size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-foreground">Polls & Voting</div>
                  <div className="text-sm text-muted-foreground">Quick polls and surveys</div>
                </div>
              </div>
              <Checkbox
                checked={config?.pollsEnabled}
                onChange={(e) => handleConfigChange('pollsEnabled', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Palette" size={20} className="text-success" />
                <div>
                  <div className="font-medium text-foreground">Drawing Canvas</div>
                  <div className="text-sm text-muted-foreground">Collaborative drawing</div>
                </div>
              </div>
              <Checkbox
                checked={config?.drawingCanvasEnabled}
                onChange={(e) => handleConfigChange('drawingCanvasEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Coffee" size={20} className="text-warning" />
                <div>
                  <div className="font-medium text-foreground">Ice Breakers</div>
                  <div className="text-sm text-muted-foreground">Conversation starters</div>
                </div>
              </div>
              <Checkbox
                checked={config?.iceBreakerEnabled}
                onChange={(e) => handleConfigChange('iceBreakerEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Heart" size={20} className="text-error" />
                <div>
                  <div className="font-medium text-foreground">Reaction Animations</div>
                  <div className="text-sm text-muted-foreground">Animated emoji reactions</div>
                </div>
              </div>
              <Checkbox
                checked={config?.reactionAnimationsEnabled}
                onChange={(e) => handleConfigChange('reactionAnimationsEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="FileUp" size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-foreground">File Upload</div>
                  <div className="text-sm text-muted-foreground">Document sharing</div>
                </div>
              </div>
              <Checkbox
                checked={config?.fileUploadEnabled}
                onChange={(e) => handleConfigChange('fileUploadEnabled', e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Extend Room Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowExtendModal(false)} />
          <div className="relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Extend Room Duration</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowExtendModal(false)}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Icon name="Clock" size={32} className="mx-auto mb-2 text-primary" />
                <div className="text-lg font-semibold text-foreground">
                  {getRemainingTime()} remaining
                </div>
                <div className="text-sm text-muted-foreground">
                  Current duration: {config?.currentDuration} minutes
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Extension Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45]?.map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setExtensionMinutes(minutes)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        extensionMinutes === minutes
                          ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                      disabled={config?.currentDuration + minutes > config?.maxDurationExtension}
                    >
                      +{minutes}m
                    </button>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  New duration: {config?.currentDuration + extensionMinutes} minutes
                  {config?.currentDuration + extensionMinutes > config?.maxDurationExtension && (
                    <span className="text-error block">Exceeds maximum duration limit</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowExtendModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleExtendRoom}
                  loading={isExtending}
                  disabled={config?.currentDuration + extensionMinutes > config?.maxDurationExtension}
                  className="flex-1"
                >
                  Extend Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomConfiguration;