import React, { useState, useEffect } from 'react';
import { X, Heart, Send, MapPin, Eye } from 'lucide-react';
import { Story } from '../../types';
import { triggerHaptic } from '../../lib/twa';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  followedCompanyIds?: string[];
  onToggleFollowCompany?: (companyId: string) => void;
  onSelectTour?: (tourId: string) => void;
  onOpenCompanyProfile?: (companyId: string) => void;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  followedCompanyIds = [],
  onToggleFollowCompany,
  onSelectTour,
  onOpenCompanyProfile,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const safeIndex = Math.max(0, Math.min(initialIndex, (stories?.length || 1) - 1));
    setCurrentIndex(safeIndex);
    setProgress(0);
    setIsLiked(false);
  }, [initialIndex, isOpen, stories?.length]);

  useEffect(() => {
    if (!isOpen || isPaused || !stories || stories.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, stories?.length]);

  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < (stories?.length || 0) - 1) {
        setCurrentIndex((idx) => idx + 1);
        setProgress(0);
      } else {
        onClose();
      }
    }
  }, [progress, currentIndex, stories?.length, onClose]);

  if (!isOpen || !stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];
  if (!currentStory) return null;

  const isFollowing = currentStory.companyId ? followedCompanyIds.includes(currentStory.companyId) : false;

  const handleNext = () => {
    triggerHaptic('light');
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    triggerHaptic('light');
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      <div 
        className="relative w-full max-w-md h-full max-h-[94vh] sm:rounded-2xl overflow-hidden flex flex-col bg-slate-950"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Story Image */}
        <img
          src={currentStory.image}
          alt={currentStory.userName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85" />

        {/* Top Progress Bars */}
        <div className="relative z-10 px-3 pt-3 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header with Agency/User Info */}
        <div className="relative z-10 px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => {
              if (currentStory.companyId && onOpenCompanyProfile) {
                triggerHaptic('light');
                onOpenCompanyProfile(currentStory.companyId);
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-400 shadow bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-white text-xs font-bold leading-tight">{currentStory.userName}</p>
                {currentStory.isCompany && (
                  <span className="px-1.5 py-0.2 rounded bg-sky-500 text-[9px] font-black text-white">
                    FIRMA
                  </span>
                )}
              </div>
              {currentStory.location && (
                <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-sky-400" />
                  {currentStory.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Follow button for agency */}
            {currentStory.companyId && onToggleFollowCompany && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('medium');
                  onToggleFollowCompany(currentStory.companyId!);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition active:scale-95 ${
                  isFollowing
                    ? 'bg-white/20 text-slate-200 border border-white/20'
                    : 'bg-sky-500 hover:bg-sky-400 text-white'
                }`}
              >
                {isFollowing ? 'Kuzatilyapti' : '+ Kuzatish'}
              </button>
            )}

            <span className="text-[11px] text-white/70 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
              <Eye className="w-3 h-3" />
              {currentStory.viewsCount + 1}
            </span>
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tap areas for next / prev */}
        <div className="relative z-0 flex-1 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Caption & Bottom Controls */}
        <div className="relative z-10 p-4 space-y-2.5">
          {/* Linked Tour CTA button */}
          {currentStory.tourId && onSelectTour && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onSelectTour(currentStory.tourId!);
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg active:scale-98 transition flex items-center justify-between"
            >
              <span>🔥 Ushbu tur paketni 0% nasiyaga ko‘rish</span>
              <span>Ko‘rish →</span>
            </button>
          )}

          {currentStory.caption && (
            <p className="text-xs text-white font-medium drop-shadow bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tur firmaga xabar yozish..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/20 backdrop-blur-md text-white placeholder-white/70 text-xs px-3.5 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={() => {
                if (replyText.trim()) {
                  triggerHaptic('success');
                  setReplyText('');
                }
              }}
              className="p-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white active:scale-95 transition"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsLiked(!isLiked);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md border transition ${
                isLiked
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
