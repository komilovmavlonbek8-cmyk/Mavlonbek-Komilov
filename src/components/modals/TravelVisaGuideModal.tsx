import React, { useState } from 'react';
import { X, Plane, FileCheck, CheckSquare, AlertTriangle, Globe, MapPin } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface TravelVisaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TravelVisaGuideModal: React.FC<TravelVisaGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedDest, setSelectedDest] = useState<'umrah' | 'dubai' | 'turkey' | 'thailand' | 'europe'>('umrah');

  if (!isOpen) return null;

  const destinations = [
    { id: 'umrah', name: 'Umra Ziyorati 🇸🇦', title: 'Saudiya Arabistoni' },
    { id: 'dubai', name: 'Dubay (BAA) 🇦🇪', title: 'Birlashgan Arab Amirliklari' },
    { id: 'turkey', name: 'Turkiya 🇹🇷', title: 'Vizatsiz 30 kun' },
    { id: 'thailand', name: 'Tailand 🇹🇭', title: 'Kelganda viza / E-viza' },
    { id: 'europe', name: 'Shengen 🇪🇺', title: 'Yevropa Ittifoqi' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Viza & Hujjatlar Yo‘riqnomasi</h3>
              <p className="text-[11px] text-slate-400">Har bir davlat uchun rasmiy talablar checklisti</p>
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

        {/* Destination Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-3 border-b border-slate-800 bg-slate-900/60">
          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedDest(d.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedDest === d.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Destination Details */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {selectedDest === 'umrah' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                  Saudiya Arabistoni — Umra Viza Talablari
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Barcha Umra turlarimizda QR-kodli elektron ziyorat vizasi va to‘liq tibbiy sug‘urta paketga kiritilgan.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Xorijga chiqish (Zagran) pasporti</span>
                    <span className="text-[11px] text-slate-400">Kamida 6 oy amal qilish muddati bo‘lishi shart.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Elektron Viza (E-Visa)</span>
                    <span className="text-[11px] text-slate-400">Tur firma tomonidan 24-48 soat ichida tayyorlanadi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Tibbiy Sug‘urta va Emlash</span>
                    <span className="text-[11px] text-slate-400">COVID-19 va xalqaro ziyorat tibbiy sug‘urtasi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Keksalar uchun hamroh</span>
                    <span className="text-[11px] text-slate-400">70 yoshdan oshgan ziyoratchilar uchun VIP hamshira xizmati tavsiya etiladi.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDest === 'dubai' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide block mb-1">
                  Dubay (BAA) — Sayyohlik Vizasi
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  O‘zbekiston fuqarolari uchun elektron turist vizasi 2–3 ish kuni ichida ochiladi.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Pasport nusxasi (Sifatli rangli skan)</span>
                    <span className="text-[11px] text-slate-400">Amal qilish muddati 6 oydan kam bo‘lmasligi lozim.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">3.5x4.5 oq fondagi rasm</span>
                    <span className="text-[11px] text-slate-400">Elektron formatda ilovaga yuklanadi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Mehmonxona vaucheri va Qaytish aviabilet</span>
                    <span className="text-[11px] text-slate-400">Tur paket bron qilganingizda avtomatik taqdim etiladi.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDest === 'turkey' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide block mb-1">
                  Turkiya (Antaliya, Istanbul) — Vizasiz Rejim
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  O‘zbekiston fuqarolari Turkiya hududiga 30 kungacha vizasiz kirish huquqiga ega!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Xorijga chiqish pasporti</span>
                    <span className="text-[11px] text-slate-400">Yetib borgan kundan boshlab kamida 150 kun (5 oy) amal qilishi shart.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Tibbiy Sug‘urta Polisi</span>
                    <span className="text-[11px] text-slate-400">Har qanday favqulodda tibbiy holatlarni qoplaydi.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDest === 'thailand' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block mb-1">
                  Tailand (Pxuket, Bangkok)
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Aeroportda yetib borganingizda (Visa on Arrival) yoki oldindan E-viza orqali olinadi (15-30 kun).
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Yetarli mablag‘ (Naqd yoki Karta)</span>
                    <span className="text-[11px] text-slate-400">Bir kishiga kamida 10,000 Tay bati (taxminan 300$).</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Mehmonxona tasdiqnomasi</span>
                    <span className="text-[11px] text-slate-400">Ilovadagi QR-kodli bron vaucheri kifoya qiladi.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDest === 'europe' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide block mb-1">
                  Yevropa — Shengen Vizasi (Italiya, Fransiya, Chexiya)
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Elchixonada barmoq izi (biometriya) topshirish va rasmiy hujjatlar to‘plami talab etiladi.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Ish joyidan ma’lumotnoma va Oylik maosh</span>
                    <span className="text-[11px] text-slate-400">Oxirgi 6 oylik ish haqi va lavozim ko‘rsatilgan bo‘lishi lozim.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Bank hisobidan ko‘chirma</span>
                    <span className="text-[11px] text-slate-400">Kamida 2000–3000 yevro ekvivalentidagi qoldiq.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Checklist Reminder */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white text-xs block">Sayohatga chiqishdan oldingi universal checklist:</span>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Xorijga chiqish pasporti muddati tekshirildi</li>
              <li>MIF (Sud ijrochilari taqiqlari yo‘qligi) tekshirildi</li>
              <li>Sayohat QR-kodli sertifikati yuklab olindi</li>
              <li>Xalqaro Visa / Mastercard kartasiga mablag‘ yuklandi</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition"
          >
            Tushundim, Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
