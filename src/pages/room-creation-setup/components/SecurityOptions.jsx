import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { SecurityBadge } from '../../../components/ui/SecurityIndicatorSystem';

const SecurityOptions = ({
  encryptionLevel,
  onEncryptionLevelChange,
  isPasswordProtected,
  onPasswordProtectionChange,
  customPassword,
  onCustomPasswordChange,
  className = ""
}) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const encryptionLevels = [
    {
      id: 'high',
      name: 'Maximum Security',
      description: 'End-to-end AES-256-GCM encryption with ECDH key exchange',
      features: ['Zero-knowledge architecture', 'Client-side encryption', 'Perfect forward secrecy'],
      recommended: true
    },
    {
      id: 'medium',
      name: 'Standard Security',
      description: 'Transport layer encryption with server-side key management',
      features: ['TLS 1.3 encryption', 'Secure key storage', 'Message integrity'],
      recommended: false
    },
    {
      id: 'low',
      name: 'Basic Security',
      description: 'Minimal encryption for testing purposes only',
      features: ['Basic transport security', 'Limited protection'],
      recommended: false
    }
  ];

  const selectedLevel = encryptionLevels?.find(level => level?.id === encryptionLevel);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encryption Level Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Encryption Level</h3>
          <SecurityBadge level={encryptionLevel} compact />
        </div>

        <div className="space-y-3">
          {encryptionLevels?.map((level) => (
            <div
              key={level?.id}
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all spring-bounce
                ${encryptionLevel === level?.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => onEncryptionLevelChange(level?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${encryptionLevel === level?.id 
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                      }
                    `}>
                      {encryptionLevel === level?.id && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                    <h4 className="font-medium text-foreground">{level?.name}</h4>
                    {level?.recommended && (
                      <span className="px-2 py-0.5 text-xs bg-success/10 text-success rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {level?.description}
                  </p>

                  <div className="space-y-1">
                    {level?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Icon name="Check" size={12} className="text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Icon 
                  name={level?.id === 'high' ? 'Shield' : level?.id === 'medium' ? 'ShieldAlert' : 'ShieldOff'} 
                  size={20} 
                  className={`
                    ${level?.id === 'high' ? 'text-success' : level?.id === 'medium' ? 'text-warning' : 'text-error'}
                    ${encryptionLevel === level?.id && level?.id === 'high' ? 'security-pulse' : ''}
                  `}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Password Protection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Access Control</h3>
          <div className="flex items-center space-x-2">
            <Icon 
              name={isPasswordProtected ? "Lock" : "Unlock"} 
              size={16} 
              className={isPasswordProtected ? "text-success" : "text-muted-foreground"}
            />
            <span className="text-xs text-muted-foreground">
              {isPasswordProtected ? "Protected" : "Open Access"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Auto-generated Password Option */}
          <div
            className={`
              p-4 border rounded-lg cursor-pointer transition-all spring-bounce
              ${!isPasswordProtected 
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
            onClick={() => {
              onPasswordProtectionChange(false);
              setShowPasswordInput(false);
            }}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5
                ${!isPasswordProtected 
                  ? 'border-primary bg-primary' :'border-muted-foreground'
                }
              `}>
                {!isPasswordProtected && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Auto-Generated Password</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  System generates a secure 15-digit password automatically
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Key" size={12} className="text-primary" />
                  <span>Cryptographically secure</span>
                  <Icon name="Shield" size={12} className="text-success" />
                  <span>Maximum entropy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Password Option */}
          <div
            className={`
              p-4 border rounded-lg cursor-pointer transition-all spring-bounce
              ${isPasswordProtected 
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
            onClick={() => {
              onPasswordProtectionChange(true);
              setShowPasswordInput(true);
            }}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5
                ${isPasswordProtected 
                  ? 'border-primary bg-primary' :'border-muted-foreground'
                }
              `}>
                {isPasswordProtected && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Custom Password</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Set your own memorable password for room access
                </p>
                
                {showPasswordInput && isPasswordProtected && (
                  <div className="mt-3 space-y-2">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter custom password"
                        value={customPassword}
                        onChange={(e) => onCustomPasswordChange(e?.target?.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                        minLength={8}
                        maxLength={50}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                      </button>
                    </div>
                    
                    {customPassword && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon 
                            name={customPassword?.length >= 8 ? "Check" : "X"} 
                            size={12} 
                            className={customPassword?.length >= 8 ? "text-success" : "text-error"}
                          />
                          <span className={customPassword?.length >= 8 ? "text-success" : "text-error"}>
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon 
                            name={/[A-Z]/?.test(customPassword) && /[a-z]/?.test(customPassword) ? "Check" : "X"} 
                            size={12} 
                            className={/[A-Z]/?.test(customPassword) && /[a-z]/?.test(customPassword) ? "text-success" : "text-error"}
                          />
                          <span className={/[A-Z]/?.test(customPassword) && /[a-z]/?.test(customPassword) ? "text-success" : "text-error"}>
                            Mixed case letters
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon 
                            name={/\d/?.test(customPassword) ? "Check" : "X"} 
                            size={12} 
                            className={/\d/?.test(customPassword) ? "text-success" : "text-error"}
                          />
                          <span className={/\d/?.test(customPassword) ? "text-success" : "text-error"}>
                            Contains numbers
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Security Summary */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5 security-pulse" />
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-2">Security Summary</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>{selectedLevel?.name} encryption enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Automatic data destruction after {selectedLevel?.id === 'high' ? 'session' : 'timeout'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>{isPasswordProtected ? 'Custom password protection' : 'Auto-generated secure access code'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Zero server-side data persistence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityOptions;