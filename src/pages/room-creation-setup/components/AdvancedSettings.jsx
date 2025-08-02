import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedSettings = ({
  isExpanded,
  onToggleExpanded,
  settings,
  onSettingsChange,
  className = ""
}) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState(settings?.colorScheme || 'default');

  const colorSchemes = [
    { id: 'default', name: 'Default', primary: '#2563EB', secondary: '#64748B', preview: 'bg-blue-500' },
    { id: 'forest', name: 'Forest', primary: '#059669', secondary: '#6B7280', preview: 'bg-emerald-500' },
    { id: 'sunset', name: 'Sunset', primary: '#EA580C', secondary: '#78716C', preview: 'bg-orange-500' },
    { id: 'ocean', name: 'Ocean', primary: '#0891B2', secondary: '#64748B', preview: 'bg-cyan-500' },
    { id: 'purple', name: 'Purple', primary: '#7C3AED', secondary: '#6B7280', preview: 'bg-violet-500' },
    { id: 'rose', name: 'Rose', primary: '#E11D48', secondary: '#78716C', preview: 'bg-rose-500' }
  ];

  const moderationOptions = [
    {
      id: 'profanityFilter',
      label: 'Profanity Filter',
      description: 'Automatically filter inappropriate language',
      icon: 'Shield'
    },
    {
      id: 'spamDetection',
      label: 'Spam Detection',
      description: 'Prevent rapid message flooding and spam',
      icon: 'AlertTriangle'
    },
    {
      id: 'linkBlocking',
      label: 'Link Blocking',
      description: 'Block external links for security',
      icon: 'Link'
    },
    {
      id: 'imageModeration',
      label: 'Image Moderation',
      description: 'Scan uploaded images for inappropriate content',
      icon: 'Image'
    }
  ];

  const privacyOptions = [
    {
      id: 'anonymousMode',
      label: 'Anonymous Participation',
      description: 'Allow users to join without providing names',
      icon: 'UserX'
    },
    {
      id: 'hideTypingIndicators',
      label: 'Hide Typing Indicators',
      description: 'Disable "user is typing" notifications',
      icon: 'EyeOff'
    },
    {
      id: 'disableReadReceipts',
      label: 'Disable Read Receipts',
      description: 'Hide message read status from other users',
      icon: 'Eye'
    },
    {
      id: 'preventScreenshots',
      label: 'Screenshot Prevention',
      description: 'Attempt to prevent screenshots (limited effectiveness)',
      icon: 'Camera'
    }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleColorSchemeChange = (schemeId) => {
    setSelectedColorScheme(schemeId);
    handleSettingChange('colorScheme', schemeId);
  };

  if (!isExpanded) {
    return (
      <div className={`${className}`}>
        <button
          onClick={onToggleExpanded}
          className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors spring-bounce"
        >
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <div className="text-left">
              <h3 className="font-medium text-foreground">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">Customize appearance and moderation</p>
            </div>
          </div>
          <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">Advanced Settings</h3>
        </div>
        <button
          onClick={onToggleExpanded}
          className="p-2 hover:bg-muted rounded-md transition-colors spring-bounce"
        >
          <Icon name="ChevronUp" size={20} className="text-muted-foreground" />
        </button>
      </div>
      {/* Color Scheme Generator */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Color Scheme</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {colorSchemes?.map((scheme) => (
            <button
              key={scheme?.id}
              onClick={() => handleColorSchemeChange(scheme?.id)}
              className={`
                p-3 border rounded-lg transition-all spring-bounce
                ${selectedColorScheme === scheme?.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full ${scheme?.preview}`} />
                <span className="text-sm font-medium text-foreground">{scheme?.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Content Moderation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">Content Moderation</h4>
        </div>
        
        <div className="space-y-3">
          {moderationOptions?.map((option) => (
            <div key={option?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                checked={settings?.[option?.id] || false}
                onChange={(e) => handleSettingChange(option?.id, e?.target?.checked)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name={option?.icon} size={14} className="text-primary" />
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    {option?.label}
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {option?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Privacy Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">Privacy Options</h4>
        </div>
        
        <div className="space-y-3">
          {privacyOptions?.map((option) => (
            <div key={option?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                checked={settings?.[option?.id] || false}
                onChange={(e) => handleSettingChange(option?.id, e?.target?.checked)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name={option?.icon} size={14} className="text-primary" />
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    {option?.label}
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {option?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Advanced Notice */}
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-warning mb-1">Advanced Settings Notice</p>
            <p className="text-muted-foreground">
              These settings affect room functionality and user experience. Some privacy features 
              may have limited effectiveness depending on user device capabilities and browser settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;