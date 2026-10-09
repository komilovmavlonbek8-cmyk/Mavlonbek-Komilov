import React, { useState } from 'react';
import { 
  Sparkles, ThumbsUp, ThumbsDown, MessageSquare, Flag, 
  MapPin, Plus, X, Image as ImageIcon, Send, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { RecommendationPost } from '../../types';
import { triggerHaptic } from '../../lib/twa';

interface RecommendViewProps {
  posts: RecommendationPost[];
  onAddPost: (newPost: Omit<RecommendationPost, 'id' | 'likes' | 'dislikes' | 'commentsCount' | 'createdAt' | 'status'>) => void;
  onLikePost: (postId: string) => void;
  onDislikePost: (postId: string) => void;
  onReportPost: (postId: string) => void;
  onOpenAiAssistant?: () => void;
}

export const RecommendView: React.FC<RecommendViewProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onDislikePost,
  onReportPost,
  onOpenAiAssistant,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeAlgorithmFilter, setActiveAlgorithmFilter] = useState<'smart' | 'trending' | 'recent'>('smart');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80');

  // Simple client profanity check
  const badWords = ['ahmoq', 'tentak', 'blin', 'durak', 'fuck'];

  // Smart Ranking Algorithm:
  // score = (likes * 3) + (commentsCount * 5) - (dislikes * 2) + levelWeight
  const sortedPosts = [...posts.filter((p) => p.status === 'published')].sort((a, b) => {
    if (activeAlgorithmFilter === 'recent') {
      return 0; // retain natural recent order
    }
    if (activeAlgorithmFilter === 'trending') {
      return (b.likes + b.commentsCount) - (a.likes + a.commentsCount);
    }
    // 'smart' algorithm:
    const scoreA = (a.likes * 3) + (a.commentsCount * 5) - (a.dislikes * 2);
    const scoreB = (b.likes * 3) + (b.commentsCount * 5) - (b.dislikes * 2);
    return scoreB - scoreA;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    const containsBadWords = badWords.some((w) => 
      title.toLowerCase().includes(w) || text.toLowerCase().includes(w)
    );

    if (containsBadWords) {
      alert("Iltimos, odob doirasida yozing. Matnda nomaqbul so'zlar aniqlandi.");
      return;
    }

    triggerHaptic('success');
    onAddPost({
      userId: 'usr-current',
      userName: 'Mavlonbek Komilov',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      userLevel: '🥈 Oltin Sayohatchi',
      title,
      text,
      images: [image],
      location: location || 'Toshkent, O‘zbekiston',
    });

    setTitle('');
    setText('');
    setLocation('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-4 px-4 py-2 pb-24 max-w-md mx-auto">
      {/* Top CTA Banner: "✍️ Sayohat hikoyangizni ulashing!" */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-amber-300 mb-1">
            <Sparkles className="w-3 h-3" /> +100 Coin Mukofot
          </div>
          <h3 className="font-extrabold text-sm leading-tight">
            Sayohat Hikoyangizni Ulashing!
          </h3>
          <p className="text-[11px] text-sky-100 mt-0.5">
            Boshqa sayohatchilarga foydali tavsiyalar bering va coin ishlang.
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            setIsCreateOpen(true);
          }}
          className="shrink-0 p-3 rounded-2xl bg-white text-slate-900 font-extrabold shadow-md hover:bg-sky-50 active:scale-95 transition"
        >
          <Plus className="w-6 h-6 text-sky-600" />
        </button>
      </div>

      {/* AI Travel Assistant Prompt Card */}
      {onOpenAiAssistant && (
        <div 
          onClick={() => {
            triggerHaptic('medium');
            onOpenAiAssistant();
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-900/40 via-sky-900/30 to-indigo-900/40 border border-cyan-500/40 shadow-lg cursor-pointer hover:border-cyan-400/80 active:scale-[0.99] transition flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-white">Qayerga sayohat qilishni bilmayapsizmi?</h4>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[8px] font-black uppercase">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-cyan-200 mt-0.5">
                AI Sayohat Maslahatchisidan shaxsiy tavsiya va reja so‘rang
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 shrink-0 flex items-center gap-0.5">
            So‘rash →
          </span>
        </div>
      )}

      {/* Algorithm Filter Header */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAlgorithmFilter('smart');
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
            activeAlgorithmFilter === 'smart'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aqlli Algoritm</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAlgorithmFilter('trending');
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${
            activeAlgorithmFilter === 'trending'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🔥 Trendlar</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAlgorithmFilter('recent');
          }}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${
            activeAlgorithmFilter === 'recent'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Yangi</span>
        </button>
      </div>

      {/* Feed list */}
      <div className="space-y-3.5">
        {sortedPosts.map((post) => (
            <article
              key={post.id}
              className="p-4 rounded-2xl bg-[#111c2e] border border-slate-800/90 shadow-md space-y-3"
            >
              {/* User row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-9 h-9 rounded-full object-cover border border-sky-400/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{post.userName}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{post.userLevel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{post.createdAt}</span>
                      {post.location && (
                        <span className="flex items-center gap-0.5 text-sky-400">
                          <MapPin className="w-2.5 h-2.5" />
                          {post.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onReportPost(post.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg"
                  title="Shikoyat qilish"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Body */}
              <div>
                <h4 className="font-bold text-sm text-white leading-snug mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {post.text}
                </p>
              </div>

              {/* Post Images (Aspect 16:9, radius 16px) */}
              {post.images && post.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-800">
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Footer Actions: Like, Dislike, Comment count */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onLikePost(post.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition ${
                      post.isLiked
                        ? 'bg-sky-500/20 text-sky-400 font-bold'
                        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onDislikePost(post.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition ${
                      post.isDisliked
                        ? 'bg-rose-500/20 text-rose-400 font-bold'
                        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{post.dislikes}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} ta izoh</span>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Create Story Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#121c2c] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Yangi Sayohat Tavsiyasi Qo'shish
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Sarlavha (100 ta belgigacha)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  required
                  placeholder="Masalan: Dubayda tejamkor sayohat sirlari"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Sayohat shahri yoki joyi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Dubay, BAA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Tavsiya va foydali maslahatlar
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={1000}
                  placeholder="Nimalarga e'tibor berish kerak, qanday qilib arzonroq va qulay sayohat qilish mumkin..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Muvaffaqiyatli post uchun:
                </span>
                <span className="font-extrabold text-white">+100 Coin</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow active:scale-98 transition"
              >
                Chop etish (+100 Coin)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
