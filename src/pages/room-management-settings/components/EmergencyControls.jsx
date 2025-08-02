import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmergencyControls = ({ 
  onTerminateRoom = () => {},
  onEmergencyMute = () => {},
  onLockRoom = () => {},
  className = ""
}) => {
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockReason, setLockReason] = useState('');

  const handleTerminateRoom = async () => {
    if (confirmationText !== 'DELETE ROOM') return;
    
    setIsTerminating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onTerminateRoom();
      setShowTerminateModal(false);
    } finally {
      setIsTerminating(false);
      setConfirmationText('');
    }
  };

  const handleEmergencyMute = () => {
    onEmergencyMute();
  };

  const handleLockRoom = () => {
    onLockRoom(lockReason);
    setShowLockModal(false);
    setLockReason('');
  };

  const emergencyActions = [
    {
      id: 'mute-all',
      title: 'Emergency Mute All',
      description: 'Instantly mute all participants except room creator',
      icon: 'VolumeX',
      color: 'warning',
      action: handleEmergencyMute
    },
    {
      id: 'lock-room',
      title: 'Lock Room',
      description: 'Prevent new participants from joining',
      icon: 'Lock',
      color: 'warning',
      action: () => setShowLockModal(true)
    },
    {
      id: 'terminate',
      title: 'Terminate Room',
      description: 'Immediately destroy room and all data',
      icon: 'AlertTriangle',
      color: 'destructive',
      action: () => setShowTerminateModal(true)
    }
  ];

  const getActionButtonProps = (color) => {
    switch (color) {
      case 'warning':
        return { variant: 'outline', className: 'border-warning text-warning hover:bg-warning/10' };
      case 'destructive':
        return { variant: 'destructive' };
      default:
        return { variant: 'outline' };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Warning Banner */}
      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-error mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-error">Emergency Controls</h3>
            <p className="text-sm text-error/80 mt-1">
              These actions are irreversible and should only be used in emergency situations. 
              All actions are logged and cannot be undone.
            </p>
          </div>
        </div>
      </div>
      {/* Emergency Actions */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Available Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyActions?.map((action) => (
            <div key={action?.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  action?.color === 'warning' ? 'bg-warning/10' :
                  action?.color === 'destructive' ? 'bg-error/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={action?.icon} 
                    size={20} 
                    className={
                      action?.color === 'warning' ? 'text-warning' :
                      action?.color === 'destructive' ? 'text-error' : 'text-foreground'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-foreground">{action?.title}</h5>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{action?.description}</p>
              
              <Button
                {...getActionButtonProps(action?.color)}
                size="sm"
                fullWidth
                onClick={action?.action}
                className="spring-bounce"
              >
                {action?.title}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Emergency Actions Log */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-4">Emergency Action Log</h4>
        
        <div className="space-y-3">
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Shield" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No emergency actions have been taken in this room.</p>
          </div>
        </div>
      </div>
      {/* Lock Room Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowLockModal(false)} />
          <div className="relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={20} className="text-warning" />
                <h3 className="text-lg font-semibold text-foreground">Lock Room</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowLockModal(false)}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <p className="text-sm text-warning">
                  Locking the room will prevent new participants from joining. 
                  Current participants will remain connected.
                </p>
              </div>

              <Input
                label="Reason for locking (optional)"
                type="text"
                placeholder="e.g., Inappropriate behavior detected"
                value={lockReason}
                onChange={(e) => setLockReason(e?.target?.value)}
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLockModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLockRoom}
                  className="flex-1 border-warning text-warning hover:bg-warning/10"
                >
                  Lock Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Terminate Room Modal */}
      {showTerminateModal && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowTerminateModal(false)} />
          <div className="relative bg-card border border-error/20 rounded-lg shadow-modal max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={20} className="text-error" />
                <h3 className="text-lg font-semibold text-foreground">Terminate Room</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowTerminateModal(false)}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <span className="font-medium text-error">Danger Zone</span>
                </div>
                <p className="text-sm text-error">
                  This action will immediately terminate the room and permanently delete all data including:
                </p>
                <ul className="text-sm text-error space-y-1 ml-4">
                  <li>• All chat messages and media</li>
                  <li>• Participant information</li>
                  <li>• Room configuration</li>
                  <li>• Activity logs</li>
                </ul>
                <p className="text-sm text-error font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label={`Type "DELETE ROOM" to confirm`}
                  type="text"
                  placeholder="DELETE ROOM"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e?.target?.value)}
                  error={confirmationText && confirmationText !== 'DELETE ROOM' ? 'Please type exactly "DELETE ROOM"' : ''}
                />
                
                <div className="text-xs text-muted-foreground">
                  All 4 participants will be immediately disconnected and the room will be destroyed.
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTerminateModal(false);
                    setConfirmationText('');
                  }}
                  className="flex-1"
                  disabled={isTerminating}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleTerminateRoom}
                  disabled={confirmationText !== 'DELETE ROOM' || isTerminating}
                  loading={isTerminating}
                  className="flex-1"
                >
                  {isTerminating ? 'Terminating...' : 'Terminate Room'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyControls;