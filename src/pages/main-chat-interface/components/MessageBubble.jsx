import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageBubble = ({ 
  message,
  isOwnMessage = false,
  showAvatar = true,
  onReaction = () => {},
  onReply = () => {},
  className = ""
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReaction = (emoji) => {
    onReaction(message?.id, emoji);
    setShowReactions(false);
  };

  const renderMessageContent = () => {
    switch (message?.type) {
      case 'file':
        return (
          <div className="space-y-2">
            {message?.content && <p className="text-sm">{message?.content}</p>}
            <div className="bg-muted rounded-lg p-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="File" size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {message?.attachment?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {message?.attachment?.size}
                </p>
              </div>
              <Icon name="Download" size={16} className="text-muted-foreground" />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {message?.content && <p className="text-sm">{message?.content}</p>}
            <div className="rounded-lg overflow-hidden max-w-xs">
              <Image
                src={message?.attachment?.url}
                alt={message?.attachment?.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-2">
            {message?.content && <p className="text-sm">{message?.content}</p>}
            <div className="bg-muted rounded-lg p-3 flex items-center space-x-3">
              <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Play" size={14} className="text-primary-foreground ml-0.5" />
              </button>
              <div className="flex-1 h-6 bg-primary/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center space-x-1">
                  {Array.from({ length: 20 })?.map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-primary rounded-full"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {message?.attachment?.duration}
              </span>
            </div>
          </div>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap">{message?.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group ${className}`}>
      <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={message?.sender?.avatar}
              alt={message?.sender?.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Message Content */}
        <div className="space-y-1">
          {/* Sender Name */}
          {!isOwnMessage && (
            <p className="text-xs text-muted-foreground font-medium px-3">
              {message?.sender?.name}
            </p>
          )}

          {/* Message Bubble */}
          <div
            className={`
              relative px-3 py-2 rounded-2xl
              ${isOwnMessage 
                ? 'bg-primary text-primary-foreground rounded-br-md' 
                : 'bg-card border border-border rounded-bl-md'
              }
            `}
            onLongPress={() => setShowReactions(true)}
          >
            {renderMessageContent()}

            {/* Delivery Status */}
            {isOwnMessage && (
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs opacity-70">
                  {formatTime(message?.timestamp)}
                </span>
                <Icon 
                  name={message?.delivered ? "CheckCheck" : "Check"} 
                  size={12} 
                  className={`opacity-70 ${message?.read ? 'text-success' : ''}`}
                />
              </div>
            )}

            {!isOwnMessage && (
              <div className="flex items-center justify-start mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatTime(message?.timestamp)}
                </span>
              </div>
            )}
          </div>

          {/* Reactions */}
          {message?.reactions && message?.reactions?.length > 0 && (
            <div className="flex flex-wrap gap-1 px-3">
              {message?.reactions?.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-muted rounded-full px-2 py-1 text-xs flex items-center space-x-1 cursor-pointer hover:bg-muted/80"
                  onClick={() => handleReaction(reaction?.emoji)}
                >
                  <span>{reaction?.emoji}</span>
                  <span className="text-muted-foreground">{reaction?.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
          <button
            onClick={() => setShowReactions(true)}
            className="w-6 h-6 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center"
          >
            <Icon name="Smile" size={12} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => onReply(message)}
            className="w-6 h-6 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center"
          >
            <Icon name="Reply" size={12} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Reaction Picker */}
      {showReactions && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowReactions(false)} />
          <div className="relative bg-card border border-border rounded-lg p-4 shadow-modal">
            <div className="grid grid-cols-6 gap-2">
              {['👍', '❤️', '😂', '😮', '😢', '😡']?.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-10 h-10 text-2xl hover:bg-muted rounded-lg flex items-center justify-center spring-bounce"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;