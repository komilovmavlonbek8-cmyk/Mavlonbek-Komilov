import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Share2, Star, Check, AlertCircle, 
  MapPin, Calendar, ShieldCheck, ChevronDown, ChevronUp,
  Coins, MessageSquare, Send, Building2, User, ThumbsUp
} from 'lucide-react';
import { TourPackage, CommentItem } from '../../types';
import { formatCurrency, calculateMonthly } from '../../lib/installment';
import { coinsToDiscount } from '../../lib/coins';
import { triggerHaptic } from '../../lib/twa';

interface PackageDetailModalProps {
  pkg: TourPackage;
  isOpen?: boolean;
  userCoins: number;
  comments: CommentItem[];
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onClose: () => void;
  onProceedToCheckout: (pkg: TourPackage, paymentType: 'full' | 'installment', months: 3 | 6 | 12 | 24, coinsApplied: number) => void;
  onAddComment: (packageId: string, text: string, rating: number) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  isOpen = true,
  userCoins,
  comments,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onProceedToCheckout,
  onAddComment,
}) => {
  // Media carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Installment tab: default 24 oy
  const [selectedMonths, setSelectedMonths] = useState<3 | 6 | 12 | 24>(24);

  // Coins slider state
  const maxPossibleCoins = Math.min(
    userCoins,
    coinsToDiscount(userCoins, pkg.price).maxCoinsApplicable
  );
  const [usedCoins, setUsedCoins] = useState(0);

  // Cancellation policy accordion
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Description read more
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // New review state
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isFollowed, setIsFollowed] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Auto carousel effect
  useEffect(() => {
    if (isPaused || pkg.images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % pkg.images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, pkg.images.length]);

  // Discount from coins
  const coinDiscount = coinsToDiscount(usedCoins, pkg.price).effectiveDiscount;
  const finalPrice = Math.max(0, pkg.price - coinDiscount);
  const monthlyAmount = calculateMonthly(finalPrice, selectedMonths);

  const handleShare = () => {
    triggerHaptic('light');
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    triggerHaptic('success');
    onAddComment(pkg.id, newCommentText, newRating);
    setNewCommentText('');
  };

  const packageComments = comments.filter((c) => c.packageId === pkg.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-[94vh] bg-[#0d1524] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        
        {/* Floating Header Actions */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 active:scale-95 transition relative"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -bottom-8 right-0 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Nusxalandi!
                </span>
              )}
            </button>
            <button
              onClick={() => {
                triggerHaptic('medium');
                onToggleWishlist(pkg.id);
              }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 active:scale-95 transition"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* [1] Media Carousel */}
          <div 
            className="relative aspect-[16/11] w-full overflow-hidden bg-slate-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <img
              src={pkg.images[activeImageIndex]}
              alt={pkg.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1524] via-transparent to-black/50" />

            {/* Carousel Dots */}
            {pkg.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {pkg.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeImageIndex ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="px-4 py-3 space-y-4">
            {/* [2] Sarlavha + Firma + Follow + Reyting */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={pkg.companyLogo}
                    alt={pkg.companyName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-xs font-semibold text-slate-300">{pkg.companyName}</span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setIsFollowed(!isFollowed);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    isFollowed
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {isFollowed ? 'Kuzatilyapti' : '+ Obuna'}
                </button>
              </div>

              <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                {pkg.title}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {pkg.rating.toFixed(1)} ({pkg.reviewCount} ta sharh)
                </span>
                <span>•</span>
                <span>{pkg.durationDays} kun</span>
                <span>•</span>
                <span>{pkg.soldCount} ta sotilgan</span>
              </div>
            </div>

            {/* [3] Narx */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-baseline gap-2">
                {pkg.originalPrice > pkg.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(pkg.originalPrice)}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black text-white">
                  {formatCurrency(pkg.price)}
                </span>
                {pkg.discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-500 text-white">
                    -{pkg.discountPercent}%
                  </span>
                )}
              </div>

              {/* [4] 💰 BO'LIB TO'LASH (3 / 6 / 12 / 24 oy tanlash) */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    💰 Bo'lib to'lash muddatini tanlang:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">0% Foizsiz</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {([3, 6, 12, 24] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedMonths(m);
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                        selectedMonths === m
                          ? 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                          : 'bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {m} oy
                    </button>
                  ))}
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-cyan-400">
                      {formatCurrency(monthlyAmount)}/oy
                    </p>
                    <p className="text-[10px] text-cyan-200/70">
                      {selectedMonths} oy davomida (jami {formatCurrency(finalPrice)})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                      Ortiqcha to'lovsiz
                    </span>
                  </div>
                </div>
              </div>

              {/* [5] 🪙 Coin ishlatish slider */}
              {maxPossibleCoins > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      Coin bilan chegirma:
                    </span>
                    <span className="text-xs font-bold text-white">
                      {usedCoins} Coin (-{formatCurrency(coinDiscount)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPossibleCoins}
                    step="50"
                    value={usedCoins}
                    onChange={(e) => setUsedCoins(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Mavjud: {userCoins} coin</span>
                    <span>Maksimal 20% chegirma</span>
                  </div>
                </div>
              )}

              {/* [6] 🏦 Bank orqali */}
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-850/60 p-2 rounded-lg">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Uzum Bank va Alif Bank orqali to'lov (muzokarada, demo versiya)
                </span>
              </div>
            </div>

            {/* [7] 📋 Bekor qilish shartlari (Accordion) */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-850/50"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Bekor qilish va qaytarish shartlari
                </span>
                {isPolicyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isPolicyOpen && (
                <div className="p-3 pt-0 text-xs text-slate-300 space-y-1.5 border-t border-slate-800/60">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span>30+ kun oldin:</span>
                    <span className="text-emerald-400 font-bold">{pkg.cancellationPolicy.days30Plus}% qaytariladi</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span>15–30 kun oldin:</span>
                    <span className="text-sky-400 font-bold">{pkg.cancellationPolicy.days15To30}% qaytariladi</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span>7–15 kun oldin:</span>
                    <span className="text-amber-400 font-bold">{pkg.cancellationPolicy.days7To15}% qaytariladi</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>7 kundan kam:</span>
                    <span className="text-rose-400 font-bold">{pkg.cancellationPolicy.daysUnder7}% qaytariladi</span>
                  </div>
                </div>
              )}
            </div>

            {/* [8] 📍 Marshrut */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                Sayohat Marshruti
              </h4>
              <p className="text-slate-300 leading-relaxed font-medium">
                {pkg.route}
              </p>
            </div>

            {/* [9] ✅ Nima kiritilgan */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <h4 className="font-bold text-white mb-2.5 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Paketga nimalar kiritilgan:
              </h4>
              <div className="space-y-2">
                {pkg.included.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-300">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* [10] 📝 Tavsif */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <h4 className="font-bold text-white mb-1.5">Batafsil Tavsif</h4>
              <p className={`text-slate-300 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                {pkg.description}
              </p>
              {pkg.description.length > 120 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-sky-400 font-semibold mt-1.5 hover:underline"
                >
                  {isDescExpanded ? 'Kamroq ko‘rsatish' : 'Ko‘proq o‘qish'}
                </button>
              )}
            </div>

            {/* [12] 💬 Sharhlar va Izoh qoldirish */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  Sayohatchilar Sharhlari ({packageComments.length})
                </h4>
                <span className="text-[10px] text-amber-400 font-bold">+20 Coin</span>
              </div>

              {/* Review input */}
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-300"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating ? 'fill-amber-300 text-amber-300' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">Baholang</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Sayohat haqida fikringiz..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-3 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {packageComments.slice(0, 5).map((cmt) => (
                  <div key={cmt.id} className="p-2.5 rounded-lg bg-slate-850/70 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-200">{cmt.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {cmt.rating || 5}
                      </div>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{cmt.text}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{cmt.createdAt}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <ThumbsUp className="w-3 h-3" /> {cmt.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* [13] FIXED PASTDA: [Sotib olish] [Bo'lib to'lash] */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pb-6 sm:pb-3 bg-[#0b111e]/95 backdrop-blur-md border-t border-slate-800 z-30">
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onProceedToCheckout(pkg, 'installment', selectedMonths, usedCoins);
              }}
              className="py-3 px-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition flex flex-col items-center justify-center leading-tight"
            >
              <span>Bo'lib to'lash</span>
              <span className="text-[10px] opacity-90">{formatCurrency(monthlyAmount)}/oy</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('medium');
                onProceedToCheckout(pkg, 'full', selectedMonths, usedCoins);
              }}
              className="py-3 px-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition flex flex-col items-center justify-center leading-tight"
            >
              <span>Bir yo'la to'lash</span>
              <span className="text-[10px] opacity-90">{formatCurrency(finalPrice)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
