import React, { useState } from 'react';
import { 
  X, PhoneCall, HeartHandshake, ShieldAlert, 
  Settings, Globe, Moon, Sun, Lock, ExternalLink, ChevronRight, 
  FileText, User, Building2, HelpCircle, Gift, Plane, Send, ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../types';
import { triggerHaptic } from '../../lib/twa';
import { HalolNasiyaModal } from '../modals/HalolNasiyaModal';
import { TravelVisaGuideModal } from '../modals/TravelVisaGuideModal';
import { FaqModal } from '../modals/FaqModal';
import { ReferralModal } from '../modals/ReferralModal';
import { TermsPolicyModal } from '../modals/TermsPolicyModal';

interface HamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  onOpenDemoInfo: () => void;
  onSelectVipTours: () => void;
  onOpenAgencyCabinet: () => void;
}

export const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({
  isOpen,
  onClose,
  user,
  theme,
  onToggleTheme,
  onOpenAdmin,
  onOpenDemoInfo,
  onSelectVipTours,
  onOpenAgencyCabinet,
}) => {
  const [currentLang, setCurrentLang] = useState<'uz' | 'ru' | 'en'>('uz');

  // New Modals visibility states
  const [isHalolModalOpen, setIsHalolModalOpen] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onClose} 
        />

        {/* Drawer */}
        <div className={`relative w-4/5 max-w-xs h-full flex flex-col shadow-2xl border-r z-10 overflow-y-auto no-scrollbar transition-colors ${
          theme === 'light' 
            ? 'bg-slate-50 text-slate-800 border-slate-200' 
            : 'bg-[#0f172a] text-slate-100 border-slate-800'
        }`}>
          {/* Header */}
          <div className={`p-5 border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xl font-black tracking-tight flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Guzasht <span className="text-sky-500">Travel</span>
              </span>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition ${
                  theme === 'light' 
                    ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className={`font-bold text-sm truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {user.name}
                </h4>
                <p className="text-xs text-slate-400 truncate">{user.phone}</p>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 mt-0.5">
                  <span>{user.levelIcon}</span>
                  <span>{user.level}</span>
                  <span className="text-slate-400">• {user.coins.toLocaleString()} Coin</span>
                </div>
              </div>
            </div>

            {/* Dark/Light Mode Quick Switcher */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                <span>{theme === 'light' ? 'Kunduzgi rejim' : 'Tungi rejim'}</span>
              </span>
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onToggleTheme();
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                  theme === 'light'
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
                }`}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Tungi</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kunduzgi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 space-y-2 text-sm">
            {/* 1. 2233 Hotline - Social mission */}
            <a
              href="tel:2233"
              onClick={() => triggerHaptic('medium')}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-900/60 to-blue-900/50 border border-sky-500/40 text-white font-medium hover:border-sky-400 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xs shadow">
                  2233
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">2233 Ishonch Raqami</p>
                  <p className="text-[10px] text-sky-200 mt-1">Keksalar va bepul qo‘ng‘iroq</p>
                </div>
              </div>
              <PhoneCall className="w-4 h-4 text-sky-400 animate-pulse" />
            </a>

            {/* 2. Tur Firmalarni Ro'yxatdan O'tkazish / B2B */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
                onOpenAgencyCabinet();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold leading-none">Tur Firma Hamkorlik</p>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[8px] font-black">
                      B2B
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ro‘yxatdan o‘tish va Story qo‘yish</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 3. 0% Halol Nasiya & Fatvo qoidalari */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsHalolModalOpen(true);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold leading-none">0% Halol Nasiya Shartlari</p>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-black">
                      Fatvo
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Foizsiz to‘lov va jarimasiz tartib</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 4. Viza & Sayohat Hujjatlari Yo'riqnomasi */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsVisaModalOpen(true);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Viza & Hujjatlar Yo‘riqnomasi</p>
                  <p className="text-[10px] text-slate-400 mt-1">Umra, Dubay, Turkiya talablari</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 5. Do'stni Taklif Qilish (+50 000 Coin) */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsReferralModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-500/60 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold leading-none text-white">Do‘stni Taklif Qiling</p>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[8px] font-black">
                      +50K
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-400/80 mt-1">Ikkalangizga 50 000 Coin bonus</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>

            {/* 6. VIP Keksalar turlari */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
                onSelectVipTours();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">VIP Keksalar Turlari</p>
                  <p className="text-[10px] text-slate-400 mt-1">Hamshira va shifokor hamrohligi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 7. Ko'p So'raladigan Savollar (FAQ) */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsFaqModalOpen(true);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Savol-Javoblar (FAQ)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Bron, sertifikat va to‘lov haqida</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 8. Qoidalar & Qaytarish (Refund) Siyosati */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsTermsModalOpen(true);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Qaytarish & Oferta</p>
                  <p className="text-[10px] text-slate-400 mt-1">100% gacha refund qoidalari</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 9. Subsidiya & Demo status */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
                onOpenDemoInfo();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">Subsidiya & DEMO Holati</p>
                  <p className="text-[10px] text-slate-400 mt-1">Investorlar va Qo‘mita ko‘rigi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 10. Admin Panel */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                onClose();
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/30 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none text-indigo-200">Admin Panel (11 bo‘lim)</p>
                  <p className="text-[10px] text-indigo-400/80 mt-1">Paketlar CRUD, Buyurtmalar, Tahlil</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </button>

            {/* 11. Rasmiy Telegram Kanal Havolasi */}
            <a
              href="https://t.me/guzashttravel"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none text-sky-300">Rasmiy Telegram Kanal</p>
                  <p className="text-[10px] text-slate-400 mt-1">@guzashttravel chegirmalari</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-sky-400" />
            </a>

            {/* Language selector */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Ilova Tili
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['uz', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      triggerHaptic('light');
                      setCurrentLang(lang);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                      currentLang === lang
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md'
                        : theme === 'light'
                          ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'uz' ? "O‘zbek" : lang === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t text-[11px] text-center space-y-1 ${
            theme === 'light' ? 'border-slate-200 text-slate-400 bg-white' : 'border-slate-800 text-slate-500 bg-slate-950/40'
          }`}>
            <p className="font-semibold text-slate-400">Guzasht Travel © 2026</p>
            <p>“Har bir sayohat — yangi hikoya”</p>
          </div>
        </div>
      </div>

      {/* Popups & Modals triggered from Drawer */}
      <HalolNasiyaModal 
        isOpen={isHalolModalOpen} 
        onClose={() => setIsHalolModalOpen(false)} 
      />

      <TravelVisaGuideModal 
        isOpen={isVisaModalOpen} 
        onClose={() => setIsVisaModalOpen(false)} 
      />

      <FaqModal 
        isOpen={isFaqModalOpen} 
        onClose={() => setIsFaqModalOpen(false)} 
      />

      <ReferralModal 
        isOpen={isReferralModalOpen} 
        onClose={() => setIsReferralModalOpen(false)} 
        userCoins={user.coins}
        userName={user.name}
      />

      <TermsPolicyModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
    </>
  );
};
