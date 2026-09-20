import React, { useState } from 'react';
import { Plus, Video, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Story } from '../../types';
import { StoryViewerModal } from './StoryViewerModal';
import { triggerHaptic } from '../../lib/twa';

interface StoriesRowProps {
  stories: Story[];
  followedCompanyIds: string[];
  onToggleFollowCompany: (companyId: string) => void;
  onSelectTour?: (tourId: string) => void;
  onOpenCompanyProfile?: (companyId: string) => void;
  onOpenAgencyCabinet?: () => void;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({ 
  stories,
  followedCompanyIds,
  onToggleFollowCompany,
  onSelectTour,
  onOpenCompanyProfile,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  return (
    <section className="py-2.5">
      {/* Horizontal scrolling row showing Tour Agency stories & reels */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {/* Stories list - Matches screenshot (aspect 3:4, radius 16px, gradient border) */}
        {(stories || []).map((story, index) => {
          if (!story) return null;
          const isFollowing = story.companyId ? (followedCompanyIds || []).includes(story.companyId) : false;

          return (
            <div key={story.id} className="flex flex-col items-center shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedStoryIndex(index);
                }}
                className={`relative w-[74px] h-[98px] rounded-[16px] p-[2px] active:scale-95 transition-all shadow-md overflow-hidden ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500'
                    : 'bg-slate-700'
                }`}
              >
                <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-slate-900">
                  <img
                    src={story.image}
                    alt={story.userName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                  {/* Top-left avatar */}
                  <div className="absolute top-1.5 left-1.5">
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-5 h-5 rounded-full object-cover border border-white/80"
                    />
                  </div>

                  {/* Media Type pill */}
                  {story.type === 'reels' && (
                    <div className="absolute top-1.5 right-1.5 px-1 rounded bg-pink-500/80 text-[7px] text-white font-black">
                      REELS
                    </div>
                  )}

                  {/* Bottom title */}
                  <div className="absolute bottom-1 left-1.5 right-1.5 text-left">
                    <span className="text-[8px] font-bold text-white truncate block leading-tight">
                      {story.userName}
                    </span>
                  </div>
                </div>
              </button>
              
              <span className="text-[11px] font-medium text-slate-300 mt-1.5 text-center max-w-[74px] truncate flex items-center justify-center gap-0.5">
                {story.userName}
                {isFollowing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          isOpen={selectedStoryIndex !== null}
          followedCompanyIds={followedCompanyIds}
          onToggleFollowCompany={onToggleFollowCompany}
          onSelectTour={onSelectTour}
          onOpenCompanyProfile={onOpenCompanyProfile}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </section>
  );
};
