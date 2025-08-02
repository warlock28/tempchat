import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityInfoSidebar = ({ className = "" }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const securityFeatures = [
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      icon: 'Shield',
      description: 'All messages are encrypted using AES-256-GCM with ECDH key exchange',
      details: [
        'Messages encrypted on your device before sending',
        'Keys never stored on our servers',
        'Perfect forward secrecy for each session',
        'Quantum-resistant encryption algorithms'
      ],
      status: 'active'
    },
    {
      id: 'ephemeral',
      title: 'Automatic Destruction',
      icon: 'Clock',
      description: 'All data automatically deleted when rooms expire (5-60 minutes)',
      details: [
        'No permanent message storage',
        'Room data deleted from memory',
        'Zero data persistence policy',
        'Configurable expiration times'
      ],
      status: 'active'
    },
    {
      id: 'privacy',
      title: 'Privacy Protection',
      icon: 'Eye',
      description: 'Anonymous participation with no personal data collection',
      details: [
        'No account registration required',
        'Anonymous room participation',
        'No tracking or analytics',
        'GDPR and CCPA compliant'
      ],
      status: 'active'
    },
    {
      id: 'security',
      title: 'Advanced Security',
      icon: 'Lock',
      description: 'Multiple layers of protection against threats and abuse',
      details: [
        'Rate limiting and abuse prevention',
        'XSS and CSRF protection',
        'Content moderation systems',
        'Secure WebSocket connections'
      ],
      status: 'active'
    }
  ];

  const privacyHighlights = [
    {
      title: 'Zero Knowledge Architecture',
      description: 'We cannot read your messages even if we wanted to',
      icon: 'ShieldCheck'
    },
    {
      title: 'No Data Mining',
      description: 'Your conversations are never analyzed or stored',
      icon: 'Database'
    },
    {
      title: 'Open Source Security',
      description: 'Our encryption methods are publicly auditable',
      icon: 'Code'
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="ShieldCheck" size={24} className="text-success security-pulse" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Military-Grade Security
        </h2>
        <p className="text-sm text-muted-foreground">
          Your privacy and security are our top priorities
        </p>
      </div>
      {/* Security Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Security Features
        </h3>
        
        {securityFeatures?.map((feature) => (
          <div key={feature?.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(feature?.id)}
              className="w-full p-4 text-left hover:bg-muted/50 transition-colors spring-bounce"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon 
                      name={feature?.icon} 
                      size={16} 
                      className="text-success"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {feature?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {feature?.description}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={expandedSection === feature?.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground"
                />
              </div>
            </button>
            
            {expandedSection === feature?.id && (
              <div className="px-4 pb-4 disclosure-expand">
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {feature?.details?.map((detail, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Icon name="Check" size={12} className="text-success mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Privacy Highlights */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Privacy Guarantees
        </h3>
        
        <div className="space-y-3">
          {privacyHighlights?.map((highlight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon name={highlight?.icon} size={12} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-xs">
                  {highlight?.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {highlight?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Trust & Compliance
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-3 bg-success/5 border border-success/20 rounded-lg">
            <Icon name="Award" size={20} className="text-success mx-auto mb-1" />
            <p className="text-xs font-medium text-success">SOC 2 Certified</p>
          </div>
          <div className="text-center p-3 bg-success/5 border border-success/20 rounded-lg">
            <Icon name="Globe" size={20} className="text-success mx-auto mb-1" />
            <p className="text-xs font-medium text-success">GDPR Compliant</p>
          </div>
        </div>
      </div>
      {/* Security Audit Link */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => window.open('#', '_blank')}
          className="spring-bounce"
        >
          View Security Audit
        </Button>
      </div>
      {/* Contact Security Team */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Questions about our security?
        </p>
        <Button
          variant="ghost"
          size="sm"
          iconName="Mail"
          iconPosition="left"
          onClick={() => window.location.href = 'mailto:security@tempchat.app'}
          className="text-xs"
        >
          Contact Security Team
        </Button>
      </div>
    </div>
  );
};

export default SecurityInfoSidebar;