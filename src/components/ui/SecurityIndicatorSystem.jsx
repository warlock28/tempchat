import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SecurityIndicator = ({ 
  type = "encryption", // "encryption", "connection", "privacy", "expiration"
  status = "secure", // "secure", "warning", "error", "unknown"
  label = "",
  description = "",
  showLabel = true,
  size = "default", // "sm", "default", "lg"
  className = ""
}) => {
  const getStatusConfig = () => {
    const configs = {
      encryption: {
        secure: { icon: "Shield", color: "text-success", bgColor: "bg-success/10", pulse: true },
        warning: { icon: "ShieldAlert", color: "text-warning", bgColor: "bg-warning/10", pulse: false },
        error: { icon: "ShieldOff", color: "text-error", bgColor: "bg-error/10", pulse: false },
        unknown: { icon: "ShieldQuestion", color: "text-muted-foreground", bgColor: "bg-muted", pulse: false }
      },
      connection: {
        secure: { icon: "Wifi", color: "text-success", bgColor: "bg-success/10", pulse: false },
        warning: { icon: "WifiOff", color: "text-warning", bgColor: "bg-warning/10", pulse: true },
        error: { icon: "WifiOff", color: "text-error", bgColor: "bg-error/10", pulse: false },
        unknown: { icon: "Wifi", color: "text-muted-foreground", bgColor: "bg-muted", pulse: false }
      },
      privacy: {
        secure: { icon: "Eye", color: "text-success", bgColor: "bg-success/10", pulse: false },
        warning: { icon: "EyeOff", color: "text-warning", bgColor: "bg-warning/10", pulse: true },
        error: { icon: "EyeOff", color: "text-error", bgColor: "bg-error/10", pulse: false },
        unknown: { icon: "Eye", color: "text-muted-foreground", bgColor: "bg-muted", pulse: false }
      },
      expiration: {
        secure: { icon: "Clock", color: "text-muted-foreground", bgColor: "bg-muted", pulse: false },
        warning: { icon: "Clock", color: "text-warning", bgColor: "bg-warning/10", pulse: true },
        error: { icon: "Clock", color: "text-error", bgColor: "bg-error/10", pulse: true },
        unknown: { icon: "Clock", color: "text-muted-foreground", bgColor: "bg-muted", pulse: false }
      }
    };

    return configs?.[type]?.[status] || configs?.[type]?.unknown;
  };

  const getSizeConfig = () => {
    const sizes = {
      sm: { icon: 12, padding: "p-1", text: "text-xs" },
      default: { icon: 16, padding: "p-2", text: "text-sm" },
      lg: { icon: 20, padding: "p-3", text: "text-base" }
    };
    return sizes?.[size] || sizes?.default;
  };

  const statusConfig = getStatusConfig();
  const sizeConfig = getSizeConfig();

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`
        ${statusConfig?.bgColor} 
        ${sizeConfig?.padding} 
        rounded-md 
        ${statusConfig?.pulse ? 'security-pulse' : ''}
      `}>
        <Icon 
          name={statusConfig?.icon} 
          size={sizeConfig?.icon} 
          className={statusConfig?.color}
        />
      </div>
      {showLabel && (label || description) && (
        <div className="min-w-0">
          {label && (
            <div className={`font-medium ${statusConfig?.color} ${sizeConfig?.text}`}>
              {label}
            </div>
          )}
          {description && (
            <div className={`text-muted-foreground ${sizeConfig?.text === 'text-xs' ? 'text-xs' : 'text-xs'}`}>
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SecurityBadge = ({ 
  level = "high", // "high", "medium", "low"
  compact = false,
  className = ""
}) => {
  const getLevelConfig = () => {
    const configs = {
      high: {
        label: "High Security",
        description: "End-to-end encrypted",
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20"
      },
      medium: {
        label: "Medium Security", 
        description: "Transport encrypted",
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20"
      },
      low: {
        label: "Low Security",
        description: "Limited encryption",
        color: "text-error",
        bgColor: "bg-error/10",
        borderColor: "border-error/20"
      }
    };
    return configs?.[level] || configs?.medium;
  };

  const levelConfig = getLevelConfig();

  if (compact) {
    return (
      <div className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs
        ${levelConfig?.bgColor} ${levelConfig?.borderColor} border
        ${className}
      `}>
        <Icon name="Shield" size={12} className={levelConfig?.color} />
        <span className={levelConfig?.color}>{level?.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={`
      inline-flex items-center space-x-2 px-3 py-2 rounded-lg border
      ${levelConfig?.bgColor} ${levelConfig?.borderColor}
      ${className}
    `}>
      <Icon name="Shield" size={16} className={`${levelConfig?.color} security-pulse`} />
      <div>
        <div className={`font-medium text-sm ${levelConfig?.color}`}>
          {levelConfig?.label}
        </div>
        <div className="text-xs text-muted-foreground">
          {levelConfig?.description}
        </div>
      </div>
    </div>
  );
};

const ConnectionStatus = ({ 
  status = "connected", // "connected", "connecting", "disconnected", "reconnecting"
  showDetails = false,
  className = ""
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (status === 'connecting' || status === 'reconnecting') {
      const interval = setInterval(() => {
        setDots(prev => prev?.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusConfig = () => {
    const configs = {
      connected: {
        icon: "Wifi",
        label: "Connected",
        description: "Secure connection active",
        color: "text-success",
        bgColor: "bg-success/10"
      },
      connecting: {
        icon: "Loader2",
        label: "Connecting",
        description: "Establishing secure connection",
        color: "text-warning",
        bgColor: "bg-warning/10"
      },
      disconnected: {
        icon: "WifiOff",
        label: "Disconnected",
        description: "Connection lost",
        color: "text-error",
        bgColor: "bg-error/10"
      },
      reconnecting: {
        icon: "RotateCcw",
        label: "Reconnecting",
        description: "Attempting to reconnect",
        color: "text-warning",
        bgColor: "bg-warning/10"
      }
    };
    return configs?.[status] || configs?.disconnected;
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`p-1 rounded-md ${statusConfig?.bgColor}`}>
        <Icon 
          name={statusConfig?.icon} 
          size={14} 
          className={`${statusConfig?.color} ${
            status === 'connecting' || status === 'reconnecting' ? 'animate-spin' : ''
          }`}
        />
      </div>
      {showDetails && (
        <div>
          <div className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}{(status === 'connecting' || status === 'reconnecting') && dots}
          </div>
          <div className="text-xs text-muted-foreground">
            {statusConfig?.description}
          </div>
        </div>
      )}
    </div>
  );
};

const ExpirationTimer = ({ 
  expiresAt,
  showProgress = false,
  warningThreshold = 300000, // 5 minutes in milliseconds
  className = ""
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!expiresAt) return;

    const totalDuration = new Date(expiresAt)?.getTime() - Date.now();

    const updateTimer = () => {
      const now = new Date()?.getTime();
      const expiry = new Date(expiresAt)?.getTime();
      const remaining = expiry - now;

      if (remaining <= 0) {
        setTimeRemaining(null);
        setProgress(0);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds, total: remaining });
      setIsWarning(remaining < warningThreshold);
      
      if (showProgress && totalDuration > 0) {
        setProgress((remaining / totalDuration) * 100);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, warningThreshold, showProgress]);

  if (!timeRemaining) return null;

  const formatTime = () => {
    const { hours, minutes, seconds } = timeRemaining;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`
        p-1 rounded-md
        ${isWarning ? 'bg-error/10' : 'bg-muted'}
      `}>
        <Icon 
          name="Clock" 
          size={14} 
          className={`${isWarning ? 'text-error security-pulse' : 'text-muted-foreground'}`}
        />
      </div>
      
      <div className="min-w-0">
        <div className={`text-sm font-mono ${isWarning ? 'text-error' : 'text-foreground'}`}>
          {formatTime()}
        </div>
        
        {showProgress && (
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isWarning ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Main export object with all components
const SecurityIndicatorSystem = {
  SecurityIndicator,
  SecurityBadge,
  ConnectionStatus,
  ExpirationTimer
};

export default SecurityIndicatorSystem;
export { SecurityIndicator, SecurityBadge, ConnectionStatus, ExpirationTimer };