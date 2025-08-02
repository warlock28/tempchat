import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ 
  onSendMessage = () => {},
  onFileUpload = () => {},
  onVoiceRecord = () => {},
  onTyping = () => {},
  disabled = false,
  className = ""
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬'
  ];

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message?.trim() && !disabled) {
      onSendMessage({
        type: 'text',
        content: message?.trim(),
        timestamp: new Date()
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef?.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onFileUpload(files);
    }
    e.target.value = '';
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    onVoiceRecord('start');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef?.current) {
      clearInterval(recordingIntervalRef?.current);
    }
    onVoiceRecord('stop');
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`bg-background border-t border-border p-4 ${className}`}>
      {/* Recording Overlay */}
      {isRecording && (
        <div className="mb-4 bg-error/10 border border-error/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <span className="text-sm font-medium text-error">Recording...</span>
            <span className="text-sm font-mono text-muted-foreground">
              {formatRecordingTime(recordingTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Square"
              onClick={stopRecording}
              className="text-error hover:bg-error/10"
            >
              Stop
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-end space-x-3">
        {/* File Upload */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName="Paperclip"
            onClick={() => fileInputRef?.current?.click()}
            disabled={disabled || isRecording}
            className="spring-bounce"
            aria-label="Attach file"
          />
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e?.target?.value);
              onTyping(e?.target?.value?.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Recording voice message..." : "Type a message..."}
            disabled={disabled || isRecording}
            className="w-full min-h-[40px] max-h-[120px] px-4 py-2 pr-12 bg-input border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder:text-muted-foreground"
            rows={1}
          />
          
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled || isRecording}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Icon name="Smile" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Voice/Send Button */}
        <div className="flex-shrink-0">
          {message?.trim() ? (
            <Button
              variant="default"
              size="icon"
              iconName="Send"
              onClick={handleSend}
              disabled={disabled}
              className="spring-bounce rounded-full"
              aria-label="Send message"
            />
          ) : (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              iconName={isRecording ? "Square" : "Mic"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className="spring-bounce rounded-full"
              aria-label={isRecording ? "Stop recording" : "Record voice message"}
            />
          )}
        </div>
      </div>
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mt-3 bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto">
            {emojis?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 text-lg hover:bg-muted rounded-md flex items-center justify-center spring-bounce"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setShowEmojiPicker(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;