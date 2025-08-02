import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MediaItem = ({ 
  media, 
  onPlay = () => {},
  onDownload = () => {},
  onDelete = () => {},
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getMediaIcon = () => {
    switch (media?.type) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'audio': return 'Music';
      case 'document': return 'FileText';
      default: return 'File';
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay(media?.id, !isPlaying);
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all spring-bounce ${className}`}>
      {/* Media Preview */}
      <div className="relative aspect-video bg-muted">
        {media?.type === 'image' && (
          <Image
            src={media?.thumbnail || media?.url}
            alt={media?.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {media?.type === 'video' && (
          <div className="relative w-full h-full">
            <Image
              src={media?.thumbnail}
              alt={media?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                iconName={isPlaying ? "Pause" : "Play"}
                onClick={handlePlay}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              />
            </div>
            {media?.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                {formatDuration(media?.duration)}
              </div>
            )}
          </div>
        )}
        
        {media?.type === 'audio' && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center space-y-3">
              <Icon name="Music" size={48} className="text-primary mx-auto" />
              <Button
                variant="outline"
                size="sm"
                iconName={isPlaying ? "Pause" : "Play"}
                iconPosition="left"
                onClick={handlePlay}
                className="spring-bounce"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              {media?.duration && (
                <p className="text-xs text-muted-foreground">
                  {formatDuration(media?.duration)}
                </p>
              )}
            </div>
          </div>
        )}
        
        {media?.type === 'document' && (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center space-y-2">
              <Icon name={getMediaIcon()} size={48} className="text-muted-foreground mx-auto" />
              <p className="text-sm font-medium text-foreground truncate px-2">
                {media?.name}
              </p>
            </div>
          </div>
        )}

        {/* Encryption Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-success/90 rounded-full">
            <Icon name="Shield" size={10} className="text-white" />
            <span className="text-xs font-medium text-white">Encrypted</span>
          </div>
        </div>

        {/* Progress Bar for Playing Media */}
        {isPlaying && (media?.type === 'video' || media?.type === 'audio') && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {/* Media Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-foreground truncate">
              {media?.name}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>{formatFileSize(media?.size)}</span>
              <span>•</span>
              <span>{media?.uploadedAt}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="Download"
              onClick={() => onDownload(media?.id)}
              className="h-8 w-8 spring-bounce"
              aria-label="Download"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Trash2"
              onClick={() => onDelete(media?.id)}
              className="h-8 w-8 spring-bounce text-error hover:text-error"
              aria-label="Delete"
            />
          </div>
        </div>

        {/* Sender Info */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="User" size={12} />
          <span>Shared by {media?.sender}</span>
        </div>
      </div>
    </div>
  );
};

const MediaGallery = ({ 
  mediaItems = [],
  onMediaPlay = () => {},
  onMediaDownload = () => {},
  onMediaDelete = () => {},
  className = ""
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock media data
  const mockMediaItems = [
    {
      id: '1',
      name: 'Project_Screenshot.png',
      type: 'image',
      size: 2048576,
      duration: null,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      sender: 'Sarah Johnson',
      uploadedAt: '2 hours ago',
      encrypted: true
    },
    {
      id: '2',
      name: 'Meeting_Recording.mp4',
      type: 'video',
      size: 15728640,
      duration: 180,
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      sender: 'Mike Chen',
      uploadedAt: '1 hour ago',
      encrypted: true
    },
    {
      id: '3',
      name: 'Voice_Note.webm',
      type: 'audio',
      size: 512000,
      duration: 45,
      url: '#',
      thumbnail: null,
      sender: 'You',
      uploadedAt: '30 minutes ago',
      encrypted: true
    },
    {
      id: '4',
      name: 'Requirements.pdf',
      type: 'document',
      size: 1024000,
      duration: null,
      url: '#',
      thumbnail: null,
      sender: 'Alex Rivera',
      uploadedAt: '15 minutes ago',
      encrypted: true
    }
  ];

  const filteredItems = mockMediaItems?.filter(item => {
    if (filter === 'all') return true;
    return item?.type === filter;
  });

  const sortedItems = [...filteredItems]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      case 'oldest':
        return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      case 'name':
        return a?.name?.localeCompare(b?.name);
      case 'size':
        return b?.size - a?.size;
      default:
        return 0;
    }
  });

  const getFilterCount = (type) => {
    if (type === 'all') return mockMediaItems?.length;
    return mockMediaItems?.filter(item => item?.type === type)?.length;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Shared Media</h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={12} className="text-success" />
          <span>All files encrypted</span>
        </div>
      </div>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: 'Grid3X3' },
            { key: 'image', label: 'Images', icon: 'Image' },
            { key: 'video', label: 'Videos', icon: 'Video' },
            { key: 'audio', label: 'Audio', icon: 'Music' },
            { key: 'document', label: 'Docs', icon: 'FileText' }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`
                flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all spring-bounce
                ${filter === tab?.key 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={12} />
              <span>{tab?.label}</span>
              <span className="ml-1 px-1.5 py-0.5 bg-muted-foreground/20 rounded-full text-xs">
                {getFilterCount(tab?.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="size">Size (Large to Small)</option>
        </select>
      </div>
      {/* Media Grid */}
      {sortedItems?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems?.map((media) => (
            <MediaItem
              key={media?.id}
              media={media}
              onPlay={onMediaPlay}
              onDownload={onMediaDownload}
              onDelete={onMediaDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <Icon name="FileX" size={48} className="mx-auto text-muted-foreground" />
          <div>
            <h4 className="text-lg font-medium text-foreground">No media files</h4>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ?'No files have been shared in this room yet'
                : `No ${filter} files found`
              }
            </p>
          </div>
        </div>
      )}
      {/* Storage Info */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Temporary Storage Used</span>
          <span className="font-medium text-foreground">24.5 MB / 100 MB</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '24.5%' }} />
        </div>
        <p className="text-xs text-muted-foreground">
          All files will be automatically deleted when the room expires
        </p>
      </div>
    </div>
  );
};

export default MediaGallery;