'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

interface PromoVideoPlayerProps {
  promoVideoUrl: string;
  thumbnailUrl?: string;
  courseTitle: string;
}

export function PromoVideoPlayer({
  promoVideoUrl,
  thumbnailUrl,
  courseTitle,
}: PromoVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Determine if it's a Cloudinary URL or a regular video URL
  const isCloudinary = promoVideoUrl?.includes('cloudinary.com');

  // For Cloudinary: swap /upload/ → /upload/f_auto,q_auto/ for optimised delivery
  const videoSrc = isCloudinary
    ? promoVideoUrl.replace('/upload/', '/upload/f_auto,q_auto/')
    : promoVideoUrl;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  const handleClose = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
    setIsExpanded(false);
    setIsFullscreen(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setSize({ width: 0, height: 0 }); // reset manual size on toggle
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // ── Resize drag ──────────────────────────────────────────────────────────

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        w: rect.width,
        h: rect.height,
      });
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      const newW = Math.max(320, dragStart.w + dx);
      const newH = Math.max(180, dragStart.h + dy);
      setSize({ width: newW, height: newH });
    };

    const onMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── Inline thumbnail + play-button (before click) ────────────────────────

  if (!isPlaying) {
    return (
      <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-white/5 relative group cursor-pointer"
        onClick={handlePlay}
        role="button"
        aria-label={`Play promo video for ${courseTitle}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${courseTitle} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="
              w-16 h-16 rounded-full flex items-center justify-center shadow-2xl
              transition-all duration-300
              group-hover:scale-110
              bg-red-600 group-hover:bg-red-500
            "
            style={{ boxShadow: '0 0 0 8px rgba(239,68,68,0.25)' }}
          >
            <Play className="text-white ml-1" size={26} fill="white" />
          </div>
        </div>

        {/* "Preview" label */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
          Course Preview
        </div>
      </div>
    );
  }

  // ── Playing state ─────────────────────────────────────────────────────────

  // Expanded / modal view
  if (isExpanded) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden
        />

        {/* Modal video container — resizable */}
        <div
          ref={overlayRef}
          className="fixed z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size.width || '80vw',
            height: size.height || '45vw',
            maxWidth: '1200px',
            maxHeight: '90vh',
            minWidth: '320px',
            minHeight: '180px',
            background: '#000',
            cursor: isDragging ? 'nwse-resize' : 'default',
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted={isMuted}
            onEnded={handleClose}
          />

          {/* Controls bar */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={toggleExpand}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              title="Collapse"
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Resize handle (bottom-right corner) */}
          <div
            onMouseDown={onResizeMouseDown}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10 flex items-end justify-end pb-1 pr-1"
            title="Drag to resize"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="rgba(255,255,255,0.5)">
              <path d="M11 1L1 11M11 6L6 11M11 11L11 11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </>
    );
  }

  // ── Inline playing (compact, inside the card) ─────────────────────────────
  return (
    <div
      ref={containerRef}
      className="w-full h-48 rounded-lg overflow-hidden mb-6 relative bg-black group"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        autoPlay
        muted={isMuted}
        onEnded={handleClose}
      />

      {/* Controls overlay — visible on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-start justify-end p-2 gap-2 opacity-0 group-hover:opacity-100">
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-black/70 hover:bg-black flex items-center justify-center text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
        <button
          onClick={toggleExpand}
          className="w-8 h-8 rounded-full bg-black/70 hover:bg-black flex items-center justify-center text-white transition-colors"
          title="Expand"
        >
          <Maximize2 size={13} />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
          title="Close"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
