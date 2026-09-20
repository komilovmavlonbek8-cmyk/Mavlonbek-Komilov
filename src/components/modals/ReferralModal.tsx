import React, { useState } from 'react';
import { X, Gift, Copy, Check, Share2, Users, Coins, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
  userName: string;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, userCoins, userName }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'GUZASHT-' + (userName.toUpperCase().slice(0, 3) || 'SAY') + '77';
  const referralLink = `https://t.me/guzashttravel_bot?start=ref_${referralCode}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    triggerHaptic('medium');
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: 'Guzasht Travel — Sayohat uchun 50 000 Coin bonus!',
        text: `Salom! Men Guzasht Travel orqali turlarni 0% Halol Nasiyaga bron qilyapman. Ushbu havola orqali ro‘yxatdan o‘tib, 50 000 Coin bonus oling:`,
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                Do‘stni Taklif Qiling
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black">
                  +50,000 Coin
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Har bir do‘stingiz uchun real chegirmalar</p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {/* Main Hero Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/30 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mb-1 border border-amber-500/40">
              <Coins className="w-7 h-7 animate-bounce" />
            </div>
            <h4 className="text-sm font-black text-white">
              Sizga 50 000 Coin, Do‘stingizga 50 000 Coin!
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
              Do‘stingiz sizning taklif havolangiz orqali kirib, ilk turini bron qilganda, ikkalangizga ham 50 000 Coin (so‘m) beriladi.
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">
              Sizning shaxsiy promo-kodingiz:
            </label>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-extrabold text-amber-400 tracking-wider">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxa olish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Telegramda Ulashish</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Copy className="w-4 h-4" />
              <span>Havolani Olish</span>
            </button>
          </div>

          {/* How it works steps */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold text-white text-xs block">Qanday ishlaydi?</span>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Havolani do‘stlaringizga yoki guruhlarga yuboring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Do‘stingiz ilovada ro‘yxatdan o‘tib ilk sayohatini tanlaydi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Har ikkalangizga 50 000 Coin avtomatik o‘tkaziladi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
