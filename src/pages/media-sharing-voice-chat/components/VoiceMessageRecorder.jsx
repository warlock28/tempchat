import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceMessageRecorder = ({ 
  onRecordingComplete = () => {},
  onRecordingStart = () => {},
  onRecordingStop = () => {},
  maxDuration = 300, // 5 minutes
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [waveformData, setWaveformData] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef?.current) {
        streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      }
      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef?.current?.createAnalyser();
      const source = audioContextRef?.current?.createMediaStreamSource(stream);
      source?.connect(analyserRef?.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef?.current?.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunks?.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        onRecordingComplete(blob, duration);
      };

      mediaRecorderRef?.current?.start();
      setIsRecording(true);
      setDuration(0);
      onRecordingStart();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef?.current && isRecording) {
          analyserRef?.current?.getByteFrequencyData(dataArray);
          const average = dataArray?.reduce((a, b) => a + b) / dataArray?.length;
          setAudioLevel(average / 255);
          
          // Generate waveform data
          setWaveformData(prev => [...prev?.slice(-50), average / 255]);
          
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      onRecordingStop();
    }
    
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => track?.stop());
    }
    
    if (intervalRef?.current) {
      clearInterval(intervalRef?.current);
    }
    
    if (animationRef?.current) {
      cancelAnimationFrame(animationRef?.current);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef?.current?.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef?.current?.pause();
        setIsPaused(true);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && audioRef?.current) {
      if (isPlaying) {
        audioRef?.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef?.current?.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setRecordedBlob(null);
    setWaveformData([]);
    setDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const sendRecording = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, duration);
      deleteRecording();
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Voice Message</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Mic" size={16} className="text-muted-foreground" />
          <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 border border-success/20 rounded-full">
            <Icon name="Shield" size={12} className="text-success security-pulse" />
            <span className="text-xs font-medium text-success">Encrypted</span>
          </div>
        </div>
      </div>
      {/* Waveform Visualization */}
      <div className="bg-muted/30 rounded-lg p-4 h-24 flex items-center justify-center">
        {isRecording || waveformData?.length > 0 ? (
          <div className="flex items-center space-x-1 h-full w-full">
            {waveformData?.map((level, index) => (
              <div
                key={index}
                className="bg-primary rounded-full transition-all duration-100"
                style={{
                  width: '3px',
                  height: `${Math.max(4, level * 60)}px`,
                  opacity: isRecording ? 1 : 0.6
                }}
              />
            ))}
            {isRecording && (
              <div className="flex-1 flex justify-end">
                <div 
                  className="w-1 bg-error rounded-full animate-pulse"
                  style={{ height: `${Math.max(8, audioLevel * 60)}px` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Icon name="Mic" size={32} className="text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Ready to record</p>
          </div>
        )}
      </div>
      {/* Recording Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {!isRecording && !recordedBlob && (
            <Button
              variant="default"
              size="lg"
              iconName="Mic"
              iconPosition="left"
              onClick={startRecording}
              className="spring-bounce bg-error hover:bg-error/90"
            >
              Hold to Record
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                variant="outline"
                size="icon"
                iconName={isPaused ? "Play" : "Pause"}
                onClick={pauseRecording}
                className="spring-bounce"
              />
              <Button
                variant="destructive"
                size="icon"
                iconName="Square"
                onClick={stopRecording}
                className="spring-bounce"
              />
            </>
          )}

          {recordedBlob && (
            <>
              <Button
                variant="outline"
                size="icon"
                iconName={isPlaying ? "Pause" : "Play"}
                onClick={playRecording}
                className="spring-bounce"
              />
              <Button
                variant="outline"
                size="icon"
                iconName="Trash2"
                onClick={deleteRecording}
                className="spring-bounce text-error hover:text-error"
              />
              <Button
                variant="default"
                size="sm"
                iconName="Send"
                iconPosition="left"
                onClick={sendRecording}
                className="spring-bounce"
              >
                Send
              </Button>
            </>
          )}
        </div>

        {/* Duration Display */}
        <div className="flex items-center space-x-2">
          {(isRecording || recordedBlob) && (
            <>
              <Icon 
                name="Clock" 
                size={14} 
                className={`${isRecording ? 'text-error animate-pulse' : 'text-muted-foreground'}`} 
              />
              <span className={`text-sm font-mono ${isRecording ? 'text-error' : 'text-foreground'}`}>
                {formatTime(duration)}
              </span>
            </>
          )}
          
          {isRecording && (
            <span className="text-xs text-muted-foreground">
              / {formatTime(maxDuration)}
            </span>
          )}
        </div>
      </div>
      {/* Audio Element for Playback */}
      {recordedBlob && (
        <audio
          ref={audioRef}
          src={URL.createObjectURL(recordedBlob)}
          onTimeUpdate={(e) => setPlaybackTime(e?.target?.currentTime)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      {/* Noise Cancellation Indicator */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Volume2" size={12} />
          <span>Noise cancellation active</span>
          <div className="flex space-x-1">
            {[...Array(3)]?.map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-success rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceMessageRecorder;