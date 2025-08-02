import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WaveformVisualizer = ({ 
  audioData = [], 
  progress = 0, 
  isPlaying = false,
  onSeek = () => {},
  className = ""
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas || audioData?.length === 0) return;

    const ctx = canvas?.getContext('2d');
    const { width, height } = canvas;
    
    ctx?.clearRect(0, 0, width, height);
    
    const barWidth = width / audioData?.length;
    const progressPosition = (progress / 100) * width;
    
    audioData?.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillStyle = x < progressPosition ? '#2563EB' : '#E2E8F0';
      ctx?.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [audioData, progress]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const percentage = (x / rect?.width) * 100;
    onSeek(percentage);
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className={`w-full h-15 cursor-pointer ${className}`}
      onClick={handleCanvasClick}
    />
  );
};

const AudioPlaybackControls = ({ 
  audioFile = null,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 50,
  playbackSpeed = 1,
  onPlay = () => {},
  onPause = () => {},
  onSeek = () => {},
  onVolumeChange = () => {},
  onSpeedChange = () => {},
  onDownload = () => {},
  onDelete = () => {},
  showWaveform = true,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [audioData, setAudioData] = useState([]);
  const audioRef = useRef(null);

  // Mock audio waveform data
  useEffect(() => {
    if (audioFile) {
      const mockWaveform = Array.from({ length: 100 }, () => Math.random() * 255);
      setAudioData(mockWaveform);
    }
  }, [audioFile]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (percentage) => {
    const newTime = (percentage / 100) * duration;
    onSeek(newTime);
  };

  const handleProgressChange = (e) => {
    const percentage = parseFloat(e?.target?.value);
    handleSeek(percentage);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!audioFile) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 text-center space-y-3 ${className}`}>
        <Icon name="Music" size={48} className="mx-auto text-muted-foreground" />
        <div>
          <h4 className="text-lg font-medium text-foreground">No Audio Selected</h4>
          <p className="text-sm text-muted-foreground">Select an audio file to play</p>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      {/* Audio Info Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Music" size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {audioFile?.name || 'Audio File'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {audioFile?.sender || 'Unknown'} • {formatTime(duration)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs text-success">Encrypted</span>
        </div>
      </div>
      {/* Waveform or Progress Bar */}
      {showWaveform && audioData?.length > 0 ? (
        <div className="space-y-2">
          <WaveformVisualizer
            audioData={audioData}
            progress={progress}
            isPlaying={isPlaying}
            onSeek={handleSeek}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          iconName="SkipBack"
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
          className="spring-bounce"
          aria-label="Skip back 10 seconds"
        />
        
        <Button
          variant="default"
          size="lg"
          iconName={isPlaying ? "Pause" : "Play"}
          onClick={handlePlayPause}
          className="spring-bounce"
          aria-label={isPlaying ? "Pause" : "Play"}
        />
        
        <Button
          variant="ghost"
          size="icon"
          iconName="SkipForward"
          onClick={() => onSeek(Math.min(duration, currentTime + 10))}
          className="spring-bounce"
          aria-label="Skip forward 10 seconds"
        />
      </div>
      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
            size={16} 
            className="text-muted-foreground" 
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e?.target?.value))}
            className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-muted-foreground w-8">{volume}%</span>
        </div>

        {/* Speed Control */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="spring-bounce"
          >
            {playbackSpeed}x
          </Button>
          
          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-2 z-50">
              <div className="space-y-1">
                {speedOptions?.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`
                      block w-full text-left px-3 py-1 rounded text-sm transition-colors
                      ${speed === playbackSpeed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted text-foreground'
                      }
                    `}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="Download"
            onClick={onDownload}
            className="spring-bounce"
            aria-label="Download audio"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName="Trash2"
            onClick={onDelete}
            className="spring-bounce text-error hover:text-error"
            aria-label="Delete audio"
          />
        </div>
      </div>
      {/* Transcription Toggle */}
      <div className="flex items-center justify-center pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          iconName="FileText"
          iconPosition="left"
          onClick={() => {/* Toggle transcription */}}
          className="spring-bounce text-muted-foreground"
        >
          Show Transcription
        </Button>
      </div>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile?.url}
        onTimeUpdate={(e) => {/* Update current time */}}
        onLoadedMetadata={(e) => {/* Set duration */}}
        onEnded={() => onPause()}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlaybackControls;