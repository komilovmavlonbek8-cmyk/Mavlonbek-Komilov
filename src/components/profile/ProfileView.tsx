import React, { useState } from 'react';
import { 
  User, Phone, Coins, Trophy, Heart, ShoppingBag, 
  PhoneCall, ShieldCheck, HeartHandshake, FileText, 
  Settings, ChevronRight, CheckCircle2, Lock, ExternalLink,
  CreditCard, PiggyBank, Image as ImageIcon, Plus, 
  Calendar, MapPin, Sparkles, Building2, QrCode, Trash2, Video
} from 'lucide-react';
import { UserProfile, TourPackage, BookingOrder, TourCompany, ConnectedBankCard, SavedTravelMedia, TravelSavingsGoal, Story } from '../../types';
import { formatCurrency } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface ProfileViewProps {
  user: UserProfile;
  packages: TourPackage[];
  companies: TourCompany[];
  bookings: BookingOrder[];
  stories?: Story[];
  onOpenAdmin: () => void;
  onOpenDemoInfo: () => void;
  onOpenAgencyCabinet: () => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onSelectVipTours: () => void;
  onViewCertificate: (order: BookingOrder) => void;
  onOpenCompanyProfile: (companyId: string) => void;
  onAddCard: (card: Omit<ConnectedBankCard, 'id'>) => void;
  onAddMedia: (media: Omit<SavedTravelMedia, 'id'>) => void;
  onUpdateSavingsGoal: (goal: TravelSavingsGoal) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  packages,
  companies,
  bookings,
  stories = [],
  onOpenAdmin,
  onOpenDemoInfo,
  onOpenAgencyCabinet,
  onSelectPackage,
  onSelectVipTours,
  onViewCertificate,
  onOpenCompanyProfile,
  onAddCard,
  onAddMedia,
  onUpdateSavingsGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'orders' | 'cards' | 'memories' | 'agency' | 'following' | 'wishlist' | 'mission'>('savings');

  // New Card Modal State
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardPan, setCardPan] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState(user.name.toUpperCase());

  // New Media Modal State
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaLocation, setMediaLocation] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  // Savings Goal Edit State
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalPackageTitle, setGoalPackageTitle] = useState(user.savingsGoal?.targetPackageTitle || 'Dubay & Abu-Dabi Safari');
  const [goalAmount, setGoalAmount] = useState(user.savingsGoal?.targetAmount || 8500000);
  const [monthlyDeduct, setMonthlyDeduct] = useState(user.savingsGoal?.monthlyContribution || 850000);

  const wishlistPackages = packages.filter((p) => user.savedPackageIds.includes(p.id));
  const followedCompanies = companies.filter((c) => (user.followedCompanyIds || []).includes(c.id));

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardPan || !cardExpiry) return;

    triggerHaptic('success');
    const isHumo = cardPan.startsWith('9860');
    onAddCard({
      pan: `${cardPan.slice(0, 4)} •••• •••• ${cardPan.slice(-4)}`,
      cardType: isHumo ? 'Humo' : 'Uzcard',
      holderName: cardHolder,
      expiry: cardExpiry,
      isDefault: (user.cards || []).length === 0,
    });

    setCardPan('');
    setCardExpiry('');
    setIsAddCardOpen(false);
  };

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl || !mediaCaption) return;

    triggerHaptic('success');
    onAddMedia({
      type: mediaType,
      url: mediaUrl,
      caption: mediaCaption,
      location: mediaLocation || 'O‘zbekiston',
      date: 'Bugun',
    });

    setMediaCaption('');
    setMediaLocation('');
    setIsAddMediaOpen(false);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    onUpdateSavingsGoal({
      id: user.savingsGoal?.id || 'sav-new',
      targetPackageTitle: goalPackageTitle,
      targetAmount: Number(goalAmount),
      currentAmount: user.savingsGoal?.currentAmount || 0,
      monthlyContribution: Number(monthlyDeduct),
      startMonth: 'Sentyabr',
      targetMonth: 'Iyun',
      autoDeduct: true,
      cardPan: user.cards?.[0]?.pan || '8600 •••• •••• 4590',
      notes: 'O‘qituvchilar va ishchilar uchun avtomatik jamg‘arma',
    });
    setIsEditingGoal(false);
  };

  const currentSavings = user.savingsGoal?.currentAmount || 0;
  const targetSavings = user.savingsGoal?.targetAmount || 1;
  const savingsPercent = Math.min(100, Math.round((currentSavings / targetSavings) * 100));

  return (
    <div className="space-y-4 px-4 py-2 pb-24 max-w-md mx-auto text-slate-100">
      {/* Profile Header Card */}
      <div className="p-4 rounded-3xl bg-[#111c2e] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-sky-500/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-white truncate">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.phone}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold mt-1">
              <span>{user.levelIcon}</span>
              <span>{user.level}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">🪙 Coinlar</span>
            <span className="text-sm font-extrabold text-amber-400">
              {user.coins.toLocaleString()}
            </span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">💳 Kartalar</span>
            <span className="text-sm font-extrabold text-cyan-400">
              {(user.cards || []).length} ta
            </span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">📸 Xotiralar</span>
            <span className="text-sm font-extrabold text-pink-400">
              {(user.savedMedia || []).length} ta
            </span>
          </div>
        </div>
      </div>

      {/* Social Mission & 2233 Call Quick Access */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 text-[10px] text-sky-400 font-bold mb-0.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Keksalar & Yordam: 2233</span>
          </div>
          <p className="text-xs font-bold text-white">Call-markaz bepul maslahati</p>
        </div>
        <a
          href="tel:2233"
          onClick={() => triggerHaptic('medium')}
          className="px-3 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>2233</span>
        </a>
      </div>

      {/* Tur Firma Ro'yxatdan O'tkazish B2B Banneri (User Request) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-300 mb-0.5">
              <span>B2B Hamkorlik</span>
            </div>
            <h4 className="font-extrabold text-xs text-white">Tur Firmangizni Ro‘yxatdan O‘tkazing</h4>
            <p className="text-[10px] text-slate-300 truncate">Stories, Reels va turlaringizni joylang</p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenAgencyCabinet();
          }}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-[11px] shadow-md active:scale-95 transition shrink-0 text-center"
        >
          Ro‘yxatdan O‘tish
        </button>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('agency');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'agency'
              ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-black shadow-md'
              : 'bg-slate-900 text-indigo-300 border border-indigo-500/30'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Tur Firma Stories & Kabinet</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('savings');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'savings'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Sayohat Jamg‘armasi</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('orders');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Bronlar ({bookings.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('cards');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'cards'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Kartalarim ({(user.cards || []).length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('memories');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'memories'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Xotiralar ({(user.savedMedia || []).length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('following');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'following'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Firmalar ({followedCompanies.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('wishlist');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'wishlist'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Sevimlilar ({wishlistPackages.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('mission');
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'mission'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Subsidiya</span>
        </button>
      </div>

      {/* TAB: AGENCY STORIES & REELS CABINET (User Request) */}
      {activeTab === 'agency' && (
        <div className="space-y-3.5">
          {/* Header Action Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 border border-indigo-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Tur Firma Stories & Reels</h4>
                  <p className="text-[10px] text-indigo-300">
                    B2B reklama, sotuvlarni oshirish va jonli kontent
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Aktiv B2B
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Faqat rasmiy ro‘yxatdan o‘tgan tur firmalargina Stories va Reels joylash orqali millionlab sayohatchilarga o‘z turlarini namoyish etishi mumkin.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onOpenAgencyCabinet();
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Video className="w-4 h-4" />
                <span>+ Yangi Story / Reels</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onOpenAgencyCabinet();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Building2 className="w-4 h-4" />
                <span>Firmani Ro‘yxatlash</span>
              </button>
            </div>
          </div>

          {/* Stories & Reels List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h5 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Barcha Tur Firmalar Stories & Reels ({stories.length})
              </h5>
              <span className="text-[10px] text-slate-400">Jonli efirlar</span>
            </div>

            {stories.length === 0 ? (
              <div className="text-center py-8 bg-[#111c2e] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Hozircha stories mavjud emas. Yuqoridagi tugma orqali yangi story yuklang!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(stories || []).map((st) => {
                  if (!st) return null;
                  const linkedPackage = (packages || []).find((p) => p && p.id === st.tourId);
                  return (
                    <div
                      key={st.id}
                      className="group rounded-2xl bg-[#111c2e] border border-slate-800 overflow-hidden shadow-md hover:border-sky-500/40 transition flex flex-col justify-between"
                    >
                      {/* Media container */}
                      <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                        <img
                          src={st.image}
                          alt={st.userName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

                        {/* Type badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow ${
                              st.type === 'reels'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                                : 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white'
                            }`}
                          >
                            {st.type === 'reels' ? '🎬 REELS' : '📸 STORY'}
                          </span>
                        </div>

                        {/* Views */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-slate-200 font-bold">
                          👁 {st.viewsCount || 120}
                        </div>

                        {/* Agency Author Info */}
                        <div className="absolute bottom-2 left-2 right-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={st.userAvatar}
                              alt={st.userName}
                              className="w-5 h-5 rounded-full object-cover border border-white/80 shrink-0"
                            />
                            <span className="text-[11px] font-black text-white truncate">
                              {st.userName}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                            {st.caption}
                          </p>

                          {st.location && (
                            <span className="flex items-center gap-0.5 text-[9px] text-sky-400">
                              <MapPin className="w-2.5 h-2.5" />
                              {st.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Linked Tour CTA footer if available */}
                      {linkedPackage ? (
                        <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="text-[9px] text-slate-400 block">Bog‘langan tur:</span>
                            <span className="text-[10px] font-bold text-sky-300 truncate block">
                              {linkedPackage.title}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              onSelectPackage(linkedPackage);
                            }}
                            className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[9px] font-bold shrink-0 shadow"
                          >
                            Turgacha
                          </button>
                        </div>
                      ) : (
                        <div className="p-2 bg-slate-900/50 border-t border-slate-800 text-[9px] text-slate-400 text-center">
                          Rasmiy brend hikoyasi
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: SAVINGS PLAN (O'qituvchi va ishchilar uchun oylik avtomatik yechish) */}
      {activeTab === 'savings' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-gradient-to-b from-amber-950/40 via-[#111c2e] to-[#0e1626] border-2 border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Orzudagi Sayohat Jamg‘armasi</h4>
                  <p className="text-[10px] text-amber-300">
                    O‘qituvchilar va xodimlar uchun Sentyabr–Iyun jamg‘arma dasturi
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsEditingGoal(!isEditingGoal);
                }}
                className="text-[11px] text-sky-400 hover:underline font-bold"
              >
                {isEditingGoal ? 'Bekor qilish' : 'O‘zgartirish'}
              </button>
            </div>

            {/* Editing Form */}
            {isEditingGoal ? (
              <form onSubmit={handleSaveGoal} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-300 block font-semibold mb-1">Maqsaddagi Tur Paketi:</label>
                  <input
                    type="text"
                    value={goalPackageTitle}
                    onChange={(e) => setGoalPackageTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Jami Maqsad (so‘m):</label>
                    <input
                      type="number"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Oylik Ajratma (so‘m):</label>
                    <input
                      type="number"
                      value={monthlyDeduct}
                      onChange={(e) => setMonthlyDeduct(Number(e.target.value))}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition"
                >
                  Maqsadni Saqlash
                </button>
              </form>
            ) : (
              <>
                {/* Target Info */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mo‘ljaldagi Tur:</span>
                    <span className="font-extrabold text-white text-right">
                      {user.savingsGoal?.targetPackageTitle || 'Dubay & Abu-Dabi Hashamatli Safari'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-extrabold">
                        {formatCurrency(currentSavings)} yig‘ildi
                      </span>
                      <span className="text-slate-300 font-bold">{savingsPercent}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${savingsPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Boshlanishi: Sentyabr</span>
                      <span>Maqsad: {formatCurrency(targetSavings)} (Iyun)</span>
                    </div>
                  </div>
                </div>

                {/* Auto Deduct Setting Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Oylik maoshdan yechish:</span>
                    <span className="font-bold text-white text-xs">
                      {formatCurrency(user.savingsGoal?.monthlyContribution || 850000)} / oy
                    </span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Avtomatik faol
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Ulangan Bank Kartasi:</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {user.savingsGoal?.cardPan || user.cards?.[0]?.pan || '8600 •••• 4590'}
                    </span>
                    <span className="text-[9px] text-sky-400 block mt-0.5">Har oyning 10-sanasida</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
                  💡 <strong>Qulaylik:</strong> O‘qituvchi va xodimlar o‘quv yili davomida (9 oy) sezilmas tarzda jamg‘arib, yozgi ta’tilda xohlagan xalqaro yoki ichki sayohatiga to‘liq dam olishga jo‘naydi!
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & CERTIFICATES */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Hali buyurtmalar yo‘q. Market bo‘limidan sayohat tanlang.
            </div>
          ) : (
            bookings.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-3xl bg-[#111c2e] border border-slate-800 space-y-3 text-xs shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-sky-400 font-bold">{ord.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Rasmiylashtirilgan
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm leading-snug">
                    {ord.packageTitle}
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Operator: <span className="text-sky-300">{ord.companyName}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">To‘lov formati</span>
                    <span className="font-bold text-cyan-300">
                      {ord.paymentType === 'installment'
                        ? `${ord.installmentMonths} oy 0% Halol Nasiya`
                        : 'Bir yo‘la to‘lov'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {ord.paymentType === 'installment' ? 'Oylik summa' : 'Jami to‘lov'}
                    </span>
                    <span className="font-extrabold text-white text-xs">
                      {ord.paymentType === 'installment'
                        ? `${formatCurrency(ord.monthlyAmount)}/oy`
                        : formatCurrency(ord.finalPaidAmount)}
                    </span>
                  </div>
                </div>

                {/* QR Certificate Action Button */}
                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    onViewCertificate(ord);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Rasmiy Sayohat Sertifikati (QR Kod)</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: CONNECTED BANK CARDS */}
      {activeTab === 'cards' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sky-400" />
              Ulangan Bank Kartalari
            </h4>
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsAddCardOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1 hover:bg-sky-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Karta Ulash</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(user.cards || []).map((card) => (
              <div
                key={card.id}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111c2e] to-slate-900 border border-slate-800 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow ${
                    card.cardType === 'Humo' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {card.cardType}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-white text-xs block">{card.pan}</span>
                    <span className="text-[10px] text-slate-400">{card.holderName} • {card.expiry}</span>
                  </div>
                </div>

                {card.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    Asosiy
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Card Modal */}
          {isAddCardOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-sm bg-[#0e1626] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm">Yangi Bank Karta Ulash</h4>
                  <button onClick={() => setIsAddCardOpen(false)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCardSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Karta Raqami (16 xona):</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="8600 0000 0000 0000"
                      value={cardPan}
                      onChange={(e) => setCardPan(e.target.value.replace(/\D/g, ''))}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 block font-semibold mb-1">Amal Qilish (MM/YY):</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block font-semibold mb-1">Tizim:</label>
                      <span className="inline-block py-2 px-3 bg-slate-900 border border-slate-700 rounded-xl text-sky-400 font-bold">
                        {cardPan.startsWith('9860') ? 'Humo' : 'Uzcard'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Karta Egasi:</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs uppercase focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-md transition mt-2"
                  >
                    Kartani Tasdiqlash va Ulash
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED MEDIA & TRAVEL MEMORIES */}
      {activeTab === 'memories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                Sarguzasht Xotiralarim
              </h4>
              <p className="text-[10px] text-slate-400">Sayohatlardan olingan foto va videolaringiz</p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsAddMediaOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-1 hover:bg-pink-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Xotira Qo‘shish</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {(user.savedMedia || []).map((m) => (
              <div
                key={m.id}
                className="rounded-2xl overflow-hidden bg-[#111c2e] border border-slate-800 shadow-md group relative"
              >
                <img
                  src={m.url}
                  alt={m.caption}
                  className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="p-2 bg-slate-950/90 text-xs space-y-0.5">
                  <p className="font-bold text-white text-[11px] truncate">{m.caption}</p>
                  <p className="text-[9px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-pink-400 shrink-0" />
                    <span className="truncate">{m.location}</span>
                  </p>
                  <p className="text-[8px] text-slate-500">{m.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Media Modal */}
          {isAddMediaOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-sm bg-[#0e1626] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm">Yangi Xotira Saqlash</h4>
                  <button onClick={() => setIsAddMediaOpen(false)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleMediaSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Rasm URL manzili:</label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Sarlavha yoki Izoh:</label>
                    <input
                      type="text"
                      placeholder="Vetnamda ajoyib tonggi quyosh..."
                      value={mediaCaption}
                      onChange={(e) => setMediaCaption(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block font-semibold mb-1">Joylashuv (Shahar, Davlat):</label>
                    <input
                      type="text"
                      placeholder="Ha Long, Vetnam"
                      value={mediaLocation}
                      onChange={(e) => setMediaLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-md transition mt-2"
                  >
                    Profilga Saqlash
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: FOLLOWING AGENCIES */}
      {activeTab === 'following' && (
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5 mb-1">
            <Building2 className="w-4 h-4 text-sky-400" />
            Kuzatilayotgan Tur Firmalar ({followedCompanies.length})
          </h4>

          {followedCompanies.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Hali hech qaysi tur firmaga obuna bo‘lmagansiz.
            </div>
          ) : (
            followedCompanies.map((comp) => (
              <div
                key={comp.id}
                onClick={() => {
                  triggerHaptic('light');
                  onOpenCompanyProfile(comp.id);
                }}
                className="p-3 rounded-2xl bg-[#111c2e] border border-slate-800 hover:border-sky-500/40 flex items-center justify-between cursor-pointer transition active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h5 className="font-bold text-white text-xs">{comp.name}</h5>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">{comp.city || 'Toshkent'} • {comp.toursCount} ta tur</p>
                    <p className="text-[10px] text-amber-400 font-bold">★ {comp.rating}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 6: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-2.5">
          {wishlistPackages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Sevimlilar ro‘yxati bo‘sh. Yurakcha belgisini bosib turlarni saqlang.
            </div>
          ) : (
            wishlistPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectPackage(pkg);
                }}
                className="p-2.5 rounded-2xl bg-[#111c2e] border border-slate-800 hover:border-sky-500/40 flex items-center gap-3 cursor-pointer active:scale-98 transition"
              >
                <img
                  src={pkg.images[0]}
                  alt={pkg.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-xs truncate">{pkg.title}</h4>
                  <p className="text-[10px] text-slate-400">{pkg.companyName}</p>
                  <p className="font-extrabold text-white text-xs mt-1">
                    {formatCurrency(pkg.price)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 7: MISSION & SUBSIDY */}
      {activeTab === 'mission' && (
        <div className="p-4 rounded-2xl bg-[#111c2e] border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="flex items-center gap-2 text-white font-bold">
            <HeartHandshake className="w-5 h-5 text-sky-400" />
            <span>Guzasht Ijtimoiy Missiyasi</span>
          </div>

          <p>
            Guzasht — O‘zbekiston turizm bozorida keksalar, nogironligi bo‘lgan insonlar va zamonaviy smartfonlardan foydalanishda qiynaladigan fuqarolarimiz uchun qulay, shaffof va qulay bo‘lib to‘lash imkoniyatini taqdim etadi.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-0.5">📞 2233 Ishonch Raqami</span>
              <p className="text-[11px] text-slate-400">
                Call-markaz operatorlari keksa yoshdagi fuqarolarga sayohatlarni tanlash, bron qilish va hujjatlarni rasmiylashtirishda telefon orqali bepul yordam beradi.
              </p>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-0.5">👵 VIP Tibbiy Hamrohlik Xizmati</span>
              <p className="text-[11px] text-slate-400">
                Maxsus parvarish talab etuvchi ziyoratchilar uchun professional tibbiy hamshira va shifokor doimiy hamrohlik qiladi.
              </p>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-0.5">🏦 0% Halol Nasiya (3, 6, 12, 24 oy)</span>
              <p className="text-[11px] text-slate-400">
                Uzum Bank va Alif Bank bilan hamkorlikda hech qanday ustamasiz, toza foizsiz bo‘lib to‘lash imkoniyati.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Quick Link */}
      <button
        onClick={() => {
          triggerHaptic('medium');
          onOpenAdmin();
        }}
        className="w-full py-3 px-4 rounded-2xl bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-between active:scale-98 transition"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          <span>Admin Boshqaruv Paneli (11 bo‘lim)</span>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400" />
      </button>
    </div>
  );
};
