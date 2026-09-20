import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Building2, BookOpen, MessageSquare, 
  Flag, Users, ShoppingCart, Landmark, Bell, Settings, Plus, 
  Trash2, Edit, Check, X, Shield, ArrowLeft, Search, CheckCircle2, Star
} from 'lucide-react';
import { TourPackage, BookingOrder, TourCompany } from '../../types';
import { formatCurrency, calculateMonthly } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  packages: TourPackage[];
  companies: TourCompany[];
  bookings: BookingOrder[];
  onAddPackage: (pkg: TourPackage) => void;
  onUpdatePackage: (pkg: TourPackage) => void;
  onDeletePackage: (id: string) => void;
}

type AdminSection = 
  | 'dashboard'
  | 'packages'
  | 'companies'
  | 'stories'
  | 'comments'
  | 'reports'
  | 'users'
  | 'bookings'
  | 'bank'
  | 'notifications'
  | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  packages,
  companies,
  bookings,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [packageSearch, setPackageSearch] = useState('');

  // Create / Edit modal state
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [editPkgId, setEditPkgId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formCompanyId, setFormCompanyId] = useState('comp-1');
  const [formPrice, setFormPrice] = useState('7000000');
  const [formOriginalPrice, setFormOriginalPrice] = useState('8400000');
  const [formDuration, setFormDuration] = useState('7');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80');
  const [formRoute, setFormRoute] = useState('Toshkent ✈️ Yangi manzil ✈️ Toshkent');
  const [formIsVip, setFormIsVip] = useState(false);

  // Push notification state
  const [pushTitle, setPushTitle] = useState('');
  const [pushSentToast, setPushSentToast] = useState(false);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditPkgId(null);
    setFormTitle('');
    setFormDestination('');
    setFormPrice('6000000');
    setFormOriginalPrice('7200000');
    setFormDuration('6');
    setFormRoute('Toshkent ✈️ Manzil ✈️ Toshkent');
    setFormIsVip(false);
    setIsEditingPackage(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    const comp = companies.find((c) => c.id === formCompanyId) || companies[0] || {
      id: 'comp-1',
      name: 'Silk Road Travel',
      logo: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?w=100&auto=format&fit=crop&q=80',
    };
    const priceNum = Number(formPrice) || 5000000;
    const origPriceNum = Number(formOriginalPrice) || priceNum * 1.2;
    const discount = origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0;

    const newPkg: TourPackage = {
      id: editPkgId || 'pkg-' + Date.now(),
      title: formTitle,
      destination: formDestination || formTitle,
      companyId: comp.id,
      companyName: comp.name,
      companyLogo: comp.logo,
      durationDays: Number(formDuration) || 5,
      soldCount: 0,
      rating: 4.8,
      reviewCount: 1,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discount,
      images: [formImage],
      tags: formIsVip ? ['VIP Keksalar', 'Ziyorat'] : ['Sayohat', 'Dam olish'],
      route: formRoute,
      isVipElderly: formIsVip,
      description: `${formTitle} bo'yicha to'liq tashkillashtirilgan ajoyib sayohat dasturi.`,
      included: ["To'g'ridan-to'g'ri reys", "4★/5★ Mehmonxona", "Nonushtalar", "Gid va transfer", "Sug'urta"],
      departureDates: ['2026-10-20'],
      cancellationPolicy: { days30Plus: 100, days15To30: 70, days7To15: 50, daysUnder7: 0 },
    };

    if (editPkgId) {
      onUpdatePackage(newPkg);
    } else {
      onAddPackage(newPkg);
    }
    setIsEditingPackage(false);
  };

  const menuGroups = [
    {
      title: 'Asosiy Boshqaruv',
      items: [
        { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'packages' as AdminSection, label: 'Turlar (CRUD)', icon: Package, badge: packages.length },
        { id: 'bookings' as AdminSection, label: 'Buyurtmalar', icon: ShoppingCart, badge: bookings.length + 18 },
      ],
    },
    {
      title: 'Kontent & Hamkorlar',
      items: [
        { id: 'companies' as AdminSection, label: 'Tur Firmalar', icon: Building2, badge: companies.length },
        { id: 'stories' as AdminSection, label: 'Stories Moderatsiya', icon: BookOpen, badge: '6 ta' },
        { id: 'comments' as AdminSection, label: 'Sharhlar & Fikrlar', icon: MessageSquare, badge: 2 },
        { id: 'reports' as AdminSection, label: 'Shikoyatlar', icon: Flag, badge: 0 },
      ],
    },
    {
      title: 'Mijozlar & Moliya',
      items: [
        { id: 'users' as AdminSection, label: 'Foydalanuvchilar', icon: Users, badge: '1.4k' },
        { id: 'bank' as AdminSection, label: 'Bank & Halol Nasiya', icon: Landmark, badge: '4 hamkor' },
      ],
    },
    {
      title: 'Tizim & Aloqa',
      items: [
        { id: 'notifications' as AdminSection, label: 'Push Xabarlar', icon: Bell, badge: null },
        { id: 'settings' as AdminSection, label: 'Sozlamalar', icon: Settings, badge: null },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1d] text-slate-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* TopBar */}
      <header className="px-4 py-3 bg-[#0d1527] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              Guzasht Admin Panel
            </h1>
            <span className="text-[10px] text-slate-400">11 ta boshqaruv moduli (Ustun menyu)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
        >
          Ilovaga qaytish
        </button>
      </header>

      {/* Body: Left Vertical Column (Ustun) + Right Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ustun Navigatsiya (Sidebar) */}
        <aside className="w-48 sm:w-60 shrink-0 bg-[#0b1222] border-r border-slate-800 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div className="p-2.5 sm:p-3 space-y-3.5">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[9px] sm:text-[10px] font-black tracking-wider text-slate-400 uppercase px-2 block">
                  {group.title}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveSection(item.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition text-left ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate text-[11px] sm:text-xs">{item.label}</span>
                        </div>
                        {item.badge !== null && item.badge !== undefined && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Status info at bottom of sidebar */}
          <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/50 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Onlayn
            </span>
            <span className="font-mono text-slate-400">11 bo'lim</span>
          </div>
        </aside>

        {/* Main Section Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 no-scrollbar text-xs">
        {/* BO'LIM 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Faol Turlar</span>
                <p className="text-xl font-black text-white mt-1">{packages.length}</p>
                <span className="text-[10px] text-emerald-400">● Hammasi onlayn</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Buyurtmalar</span>
                <p className="text-xl font-black text-sky-400 mt-1">{bookings.length + 18}</p>
                <span className="text-[10px] text-slate-400">100% 24 oy bo'lib to'lash</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Foydalanuvchilar</span>
                <p className="text-xl font-black text-purple-400 mt-1">1,420</p>
                <span className="text-[10px] text-emerald-400">+12% bu hafta</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Coin Aylanmasi</span>
                <p className="text-xl font-black text-amber-400 mt-1">148,500</p>
                <span className="text-[10px] text-amber-300">≈ 14.8 mln chegirma</span>
              </div>
            </div>

            {/* Top Tours */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-extrabold text-sm text-white mb-3">Eng Ko'p Sotilgan Turlar (Top 5)</h3>
              <div className="space-y-2">
                {packages.slice(0, 5).map((pkg, idx) => (
                  <div key={pkg.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-850">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-slate-500 w-4">{idx + 1}</span>
                      <img src={pkg.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate text-xs">{pkg.title}</p>
                        <p className="text-[10px] text-slate-400">{pkg.companyName}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-cyan-400 text-xs shrink-0 ml-2">
                      {pkg.soldCount} ta sotilgan
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BO'LIM 2: PACKAGES (CRUD) */}
        {activeSection === 'packages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Turni qidirish..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Tur</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {packages
                .filter((p) => p.title.toLowerCase().includes(packageSearch.toLowerCase()))
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={pkg.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-xs truncate">{pkg.title}</h4>
                          {pkg.isVipElderly && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                              VIP Keksalar
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {pkg.companyName} • {formatCurrency(pkg.price)} • {calculateMonthly(pkg.price, 24).toLocaleString()} so'm/oy (24x)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditPkgId(pkg.id);
                          setFormTitle(pkg.title);
                          setFormDestination(pkg.destination);
                          setFormCompanyId(pkg.companyId);
                          setFormPrice(String(pkg.price));
                          setFormOriginalPrice(String(pkg.originalPrice));
                          setFormDuration(String(pkg.durationDays));
                          setFormImage(pkg.images[0]);
                          setFormRoute(pkg.route);
                          setFormIsVip(!!pkg.isVipElderly);
                          setIsEditingPackage(true);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
                        title="Tahrirlash"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`"${pkg.title}" o'chirilsinmi?`)) {
                            triggerHaptic('medium');
                            onDeletePackage(pkg.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* BO'LIM 3: COMPANIES */}
        {activeSection === 'companies' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">Hamkor Turistik Kompaniyalar</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {companies.map((comp) => (
                <div key={comp.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={comp.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{comp.name}</h4>
                      <p className="text-[10px] text-emerald-400">✓ Tasdiqlangan B2B hamkor</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">{comp.description}</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                    <span>Telefon: {comp.phone}</span>
                    <span className="font-bold text-amber-300">⭐ {comp.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BO'LIM 8: BOOKINGS */}
        {activeSection === 'bookings' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">Barcha Bron Qilingan Buyurtmalar</h3>
            <div className="space-y-2">
              {bookings.map((ord) => (
                <div key={ord.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-400">{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {ord.status}
                    </span>
                  </div>
                  <p className="font-bold text-white text-xs">{ord.packageTitle}</p>
                  <p className="text-slate-400 text-[11px]">
                    Mijoz: {ord.customerName} ({ord.customerPhone})
                  </p>
                  <div className="flex justify-between items-center text-[10px] pt-1 text-slate-400 border-t border-slate-800">
                    <span>To'lov: {ord.paymentType === 'installment' ? `${ord.installmentMonths} oy` : "Bir yo'la"}</span>
                    <span className="font-bold text-white text-xs">{formatCurrency(ord.finalPaidAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BO'LIM 9: BANK HAMKORLIK */}
        {activeSection === 'bank' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Landmark className="w-5 h-5 text-sky-400" />
              <span>Bank Hamkorlik Integratsiyasi (ICHKI)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              O'zbekiston Respublikasi qonunchiligi bo'yicha muddatli to'lov faqat litsenziyalangan banklar orqali amalga oshiriladi.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-850 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Uzum Bank (Uzum Nasiya)</span>
                  <p className="text-[10px] text-slate-400">API integratsiya va skoring shartnomasi</p>
                </div>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  Muzokarada (Demo)
                </span>
              </div>
              <div className="p-3 bg-slate-850 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Alif Bank (Alif Nasiya)</span>
                  <p className="text-[10px] text-slate-400">Hamkorlik memorandumi loyihasi</p>
                </div>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  Muzokarada (Demo)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BO'LIM 10: NOTIFICATIONS (PUSH) */}
        {activeSection === 'notifications' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white">Telegram Push Bildirishnoma Yuborish</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Bildirishnoma sarlavhasi (masalan: Yangi -20% chegirmali Vetnam turi!)"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
              <button
                onClick={() => {
                  if (pushTitle.trim()) {
                    triggerHaptic('success');
                    setPushSentToast(true);
                    setPushTitle('');
                    setTimeout(() => setPushSentToast(false), 2500);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
              >
                Telegram foydalanuvchilariga jo'natish
              </button>
              {pushSentToast && (
                <p className="text-emerald-400 text-[11px] text-center font-bold">
                  ✓ Bildirishnoma muvaffaqiyatli jo'natildi!
                </p>
              )}
            </div>
          </div>
        )}

        {/* BO'LIM 4, 5, 6, 7, 11 (General overview) */}
        {(['stories', 'comments', 'reports', 'users', 'settings'] as AdminSection[]).includes(activeSection) && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-sm text-white capitalize">{activeSection} Boshqaruvi</h3>
            <p className="text-slate-400">
              Ushbu bo'lim real vaqtda moderatorlar tomonidan avtomatik va qo'lda boshqariladi.
            </p>
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-emerald-400 font-medium">
              ✓ Barcha tizimlar barqaror ishlamoqda.
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Package Create / Edit Modal */}
      {isEditingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#131d2e] border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar text-xs">
            <button
              onClick={() => setIsEditingPackage(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-sm text-white mb-3">
              {editPkgId ? "Turni Tahrirlash" : "Yangi Tur Qo'shish"}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Tur nomi</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tur firma</label>
                <select
                  value={formCompanyId}
                  onChange={(e) => setFormCompanyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Narx (so'm)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Eski narx (so'm)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Davomiyligi (kun)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVip}
                      onChange={(e) => setFormIsVip(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-indigo-300">VIP Keksalar turi</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Rasm URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Marshrut</label>
                <input
                  type="text"
                  value={formRoute}
                  onChange={(e) => setFormRoute(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold shadow"
              >
                Saqlash (Marketda darhol ko'rinadi)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
