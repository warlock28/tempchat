import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ 
  currentSettings = {},
  onUpdateSettings = () => {},
  className = ""
}) => {
  const [settings, setSettings] = useState({
    encryptionEnabled: true,
    contentModerationEnabled: true,
    spamDetectionLevel: 75,
    profanityFilterEnabled: true,
    linkScanningEnabled: true,
    fileUploadRestricted: false,
    anonymousParticipation: true,
    messageHistoryEnabled: false,
    screenshotPrevention: true,
    ...currentSettings
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const securityLevel = () => {
    const enabledFeatures = Object.values(settings)?.filter(Boolean)?.length;
    const totalFeatures = Object.keys(settings)?.length;
    const percentage = (enabledFeatures / totalFeatures) * 100;
    
    if (percentage >= 80) return { level: 'High', color: 'text-success', bgColor: 'bg-success/10' };
    if (percentage >= 60) return { level: 'Medium', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { level: 'Low', color: 'text-error', bgColor: 'bg-error/10' };
  };

  const security = securityLevel();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Security Overview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Security Overview</h3>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${security?.bgColor}`}>
            <Icon name="Shield" size={16} className={`${security?.color} security-pulse`} />
            <span className={`text-sm font-medium ${security?.color}`}>
              {security?.level} Security
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="Lock" size={24} className="mx-auto mb-2 text-success" />
            <div className="text-sm font-medium text-foreground">End-to-End Encryption</div>
            <div className="text-xs text-muted-foreground">AES-256-GCM</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="Eye" size={24} className="mx-auto mb-2 text-warning" />
            <div className="text-sm font-medium text-foreground">Content Moderation</div>
            <div className="text-xs text-muted-foreground">AI-Powered Detection</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Icon name="Clock" size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Auto-Destruction</div>
            <div className="text-xs text-muted-foreground">Zero Data Retention</div>
          </div>
        </div>
      </div>
      {/* Core Security Settings */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Core Security</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} className="text-success" />
              <div>
                <div className="font-medium text-foreground">End-to-End Encryption</div>
                <div className="text-sm text-muted-foreground">All messages encrypted with AES-256-GCM</div>
              </div>
            </div>
            <Checkbox
              checked={settings?.encryptionEnabled}
              onChange={(e) => handleSettingChange('encryptionEnabled', e?.target?.checked)}
              disabled
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="UserCheck" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-foreground">Anonymous Participation</div>
                <div className="text-sm text-muted-foreground">Allow users to join without registration</div>
              </div>
            </div>
            <Checkbox
              checked={settings?.anonymousParticipation}
              onChange={(e) => handleSettingChange('anonymousParticipation', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Camera" size={20} className="text-warning" />
              <div>
                <div className="font-medium text-foreground">Screenshot Prevention</div>
                <div className="text-sm text-muted-foreground">Prevent screenshots and screen recording</div>
              </div>
            </div>
            <Checkbox
              checked={settings?.screenshotPrevention}
              onChange={(e) => handleSettingChange('screenshotPrevention', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Content Moderation */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Content Moderation</h4>
          <Button
            variant="ghost"
            size="sm"
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Advanced
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Eye" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-foreground">Content Moderation</div>
                <div className="text-sm text-muted-foreground">AI-powered content filtering</div>
              </div>
            </div>
            <Checkbox
              checked={settings?.contentModerationEnabled}
              onChange={(e) => handleSettingChange('contentModerationEnabled', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="MessageSquareX" size={20} className="text-warning" />
              <div>
                <div className="font-medium text-foreground">Profanity Filter</div>
                <div className="text-sm text-muted-foreground">Block inappropriate language</div>
              </div>
            </div>
            <Checkbox
              checked={settings?.profanityFilterEnabled}
              onChange={(e) => handleSettingChange('profanityFilterEnabled', e?.target?.checked)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-error" />
                <div>
                  <div className="font-medium text-foreground">Spam Detection</div>
                  <div className="text-sm text-muted-foreground">Sensitivity: {settings?.spamDetectionLevel}%</div>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">{settings?.spamDetectionLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.spamDetectionLevel}
              onChange={(e) => handleSettingChange('spamDetectionLevel', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Permissive</span>
              <span>Strict</span>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="pt-4 border-t border-border space-y-4 disclosure-expand">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Link" size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-foreground">Link Scanning</div>
                  <div className="text-sm text-muted-foreground">Scan shared links for malware</div>
                </div>
              </div>
              <Checkbox
                checked={settings?.linkScanningEnabled}
                onChange={(e) => handleSettingChange('linkScanningEnabled', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Upload" size={20} className="text-warning" />
                <div>
                  <div className="font-medium text-foreground">Restrict File Uploads</div>
                  <div className="text-sm text-muted-foreground">Only allow images and documents</div>
                </div>
              </div>
              <Checkbox
                checked={settings?.fileUploadRestricted}
                onChange={(e) => handleSettingChange('fileUploadRestricted', e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="History" size={20} className="text-error" />
                <div>
                  <div className="font-medium text-foreground">Message History</div>
                  <div className="text-sm text-muted-foreground">Store messages until room expires</div>
                </div>
              </div>
              <Checkbox
                checked={settings?.messageHistoryEnabled}
                onChange={(e) => handleSettingChange('messageHistoryEnabled', e?.target?.checked)}
              />
            </div>
          </div>
        )}
      </div>
      {/* Security Audit Log */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-4">Recent Security Events</h4>
        
        <div className="space-y-3">
          {[
            {
              id: 1,
              type: "warning",
              icon: "AlertTriangle",
              message: "Spam message detected and blocked",
              user: "Anonymous User",
              timestamp: new Date(Date.now() - 300000)
            },
            {
              id: 2,
              type: "success",
              icon: "Shield",
              message: "End-to-end encryption established",
              user: "System",
              timestamp: new Date(Date.now() - 1800000)
            },
            {
              id: 3,
              type: "info",
              icon: "UserCheck",
              message: "New participant joined anonymously",
              user: "System",
              timestamp: new Date(Date.now() - 2400000)
            }
          ]?.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon 
                name={event.icon} 
                size={16} 
                className={`mt-0.5 ${
                  event.type === 'warning' ? 'text-warning' :
                  event.type === 'success' ? 'text-success' : 'text-primary'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{event.message}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                  <span>{event.user}</span>
                  <span>•</span>
                  <span>{event.timestamp?.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;