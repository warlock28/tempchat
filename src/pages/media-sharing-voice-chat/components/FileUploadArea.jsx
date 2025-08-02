import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadArea = ({ 
  onFileSelect = () => {},
  onUploadProgress = () => {},
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt",
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [encryptionProgress, setEncryptionProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    processFiles(files);
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e?.target?.files);
    processFiles(files);
    e.target.value = '';
  }, []);

  const processFiles = useCallback((files) => {
    const validFiles = files?.filter(file => {
      if (file?.size > maxFileSize) {
        console.warn(`File ${file?.name} exceeds size limit`);
        return false;
      }
      return true;
    });

    if (validFiles?.length === 0) return;

    setUploadingFiles(prev => [...prev, ...validFiles?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      progress: 0,
      encrypted: false,
      status: 'encrypting'
    }))]);

    // Simulate encryption process
    validFiles?.forEach((file, index) => {
      const fileId = Date.now() + Math.random() + index;
      simulateEncryption(fileId, file);
    });

    onFileSelect(validFiles);
  }, [maxFileSize, onFileSelect]);

  const simulateEncryption = useCallback((fileId, file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadingFiles(prev => 
          prev?.map(f => f?.id === fileId ? { ...f, progress: 100, encrypted: true, status: 'completed' } : f)
        );
        setTimeout(() => {
          setUploadingFiles(prev => prev?.filter(f => f?.id !== fileId));
        }, 2000);
      } else {
        setUploadingFiles(prev => 
          prev?.map(f => f?.id === fileId ? { ...f, progress } : f)
        );
      }
      setEncryptionProgress(prev => ({ ...prev, [fileId]: progress }));
      onUploadProgress(fileId, progress);
    }, 100);
  }, [onUploadProgress]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/30'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
            <Icon 
              name={isDragOver ? "Upload" : "FileUp"} 
              size={48} 
              className={`mx-auto ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragOver ? 'Drop files here' : 'Share Files Securely'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop files or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Images, videos, audio, documents up to {formatFileSize(maxFileSize)}
            </p>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
            <Icon name="Shield" size={14} className="text-success security-pulse" />
            <span className="text-xs font-medium text-success">End-to-end encrypted</span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="Camera"
          iconPosition="left"
          onClick={() => {/* Open camera */}}
          className="spring-bounce"
        >
          Camera
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Image"
          iconPosition="left"
          onClick={() => fileInputRef?.current?.click()}
          className="spring-bounce"
        >
          Photos
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="FileText"
          iconPosition="left"
          onClick={() => fileInputRef?.current?.click()}
          className="spring-bounce"
        >
          Documents
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Music"
          iconPosition="left"
          onClick={() => fileInputRef?.current?.click()}
          className="spring-bounce"
        >
          Audio
        </Button>
      </div>
      {/* Upload Progress */}
      {uploadingFiles?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Encrypting Files</h4>
          {uploadingFiles?.map((uploadFile) => (
            <div key={uploadFile?.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon 
                    name={uploadFile?.file?.type?.startsWith('image/') ? 'Image' : 
                          uploadFile?.file?.type?.startsWith('video/') ? 'Video' : 
                          uploadFile?.file?.type?.startsWith('audio/') ? 'Music' : 'FileText'} 
                    size={16} 
                    className="text-muted-foreground flex-shrink-0" 
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadFile?.file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile?.file?.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {uploadFile?.encrypted ? (
                    <Icon name="Shield" size={16} className="text-success" />
                  ) : (
                    <Icon name="Lock" size={16} className="text-warning animate-pulse" />
                  )}
                  <span className="text-xs font-mono text-muted-foreground">
                    {Math.round(uploadFile?.progress)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    uploadFile?.encrypted ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${uploadFile?.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;