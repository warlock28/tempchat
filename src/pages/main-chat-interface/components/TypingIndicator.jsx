import React, { useEffect, useState } from 'react';

const TypingIndicator = ({ 
  typingUsers = [],
  className = ""
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (typingUsers?.length === 0) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [typingUsers?.length]);

  if (typingUsers?.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers?.length === 1) {
      return `${typingUsers?.[0]?.name} is typing`;
    } else if (typingUsers?.length === 2) {
      return `${typingUsers?.[0]?.name} and ${typingUsers?.[1]?.name} are typing`;
    } else {
      return `${typingUsers?.[0]?.name} and ${typingUsers?.length - 1} others are typing`;
    }
  };

  return (
    <div className={`px-4 py-2 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* Typing Text */}
        <span className="text-sm text-muted-foreground">
          {getTypingText()}{dots}
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;