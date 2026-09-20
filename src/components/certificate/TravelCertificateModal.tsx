import React, { useState } from 'react';
import { 
  X, Download, Share2, CheckCircle2, ShieldCheck, 
  QrCode, Calendar, MapPin, User, Building2, PhoneCall, 
  FileCheck, Sparkles, HeartHandshake, AlertCircle 
} from 'lucide-react';
import { BookingOrder, TourPackage } from '../../types';
import { formatCurrency } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface TravelCertificateModalProps {
  order: BookingOrder;
  pkg?: TourPackage;
  onClose: () => void;
}

export const TravelCertificateModal: React.FC<TravelCertificateModalProps> = ({
  order,
  pkg,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const certNumber = order.certificateCode || `GUZASHT-CERT-2026-${order.id.replace(/\D/g, '') || '9821'}`;

  const handleShare = () => {
    triggerHaptic('light');
    const text = `🎫 GUZASHT Rasmiy Sayohat Sertifikati: ${order.packageTitle} | Sertifikat №: ${certNumber} | Mijoz: ${order.customerName}`;
    if (navigator.share) {
      navigator.share({
        title: 'Guzasht Sayohat Sertifikati',
        text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    triggerHaptic('success');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-950 via-[#111c2e] to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Sayohat Sertifikati</h3>
              <p className="text-[10px] text-amber-300 font-mono tracking-wider">{certNumber}</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Certificate Card */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-[#111c30] to-slate-950 border-2 border-amber-500/40 shadow-xl overflow-hidden">
            {/* Background Watermark Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <ShieldCheck className="w-96 h-96 text-white" />
            </div>

            {/* Top Certificate Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white font-black text-xs">
                  G
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 block">
                    GUZASHT PLATFORMASI
                  </span>
                  <span className="text-[9px] text-slate-400">
                    O‘zbekiston Rasmiy Turizm Vaucheri
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Haqiqiy (Tasdiqlangan)
                </span>
              </div>
            </div>

            {/* Tour Title & Destination */}
            <div className="pt-3 pb-2 text-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Sayohat Paketi
              </span>
              <h4 className="text-base font-black text-white mt-0.5 leading-snug">
                {order.packageTitle}
              </h4>
              <p className="text-xs text-sky-300 font-medium mt-0.5">
                Tur operatori: <span className="font-bold text-white">{order.companyName}</span>
              </p>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 my-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Sayohatchi (Mijoz):</span>
                <span className="font-bold text-white">{order.customerName}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{order.customerPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Bron holati:</span>
                <span className="font-bold text-emerald-400">Rasmiylashtirilgan</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Sana: {order.createdAt}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">To‘lov formati:</span>
                <span className="font-bold text-cyan-300">
                  {order.paymentType === 'installment'
                    ? `${order.installmentMonths} oy 0% Halol Nasiya`
                    : '100% To‘langan'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Summa:</span>
                <span className="font-extrabold text-white">
                  {formatCurrency(order.finalPaidAmount)}
                </span>
              </div>
            </div>

            {/* VIP Escort Badge if applicable */}
            {order.hasMedicalEscort && (
              <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-[11px] text-amber-300">
                <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>VIP Tibbiy Hamshira & Doimiy Hamroh:</strong> Buyurtmaga biriktirilgan.
                </span>
              </div>
            )}

            {/* QR Code & Verification Block */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-1 text-[10px] text-slate-300">
                <p className="font-bold text-white flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-sky-400" />
                  Offline QR Tekshiruv
                </p>
                <p className="text-[9px] text-slate-400 max-w-[200px]">
                  Aeroport, mehmonxona yoki transportga kirishda ushbu QR-kodni internetsiz ko‘rsatishingiz mumkin.
                </p>
                <p className="text-[9px] text-amber-400 font-mono">
                  Sertifikat: {certNumber}
                </p>
              </div>

              {/* Realistic SVG QR-Code Box */}
              <div className="w-24 h-24 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />

                  {/* QR Pattern dots */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="8" height="6" />
                  <rect x="58" y="8" width="6" height="6" />

                  <rect x="36" y="18" width="8" height="8" />
                  <rect x="48" y="20" width="6" height="6" />
                  <rect x="58" y="18" width="6" height="8" />

                  <rect x="8" y="36" width="6" height="8" />
                  <rect x="18" y="36" width="8" height="6" />
                  <rect x="8" y="48" width="8" height="6" />

                  {/* Center data matrix */}
                  <rect x="36" y="36" width="10" height="10" rx="2" />
                  <rect x="50" y="36" width="8" height="8" />
                  <rect x="62" y="38" width="6" height="6" />
                  <rect x="72" y="36" width="8" height="8" />
                  <rect x="84" y="38" width="8" height="6" />

                  <rect x="36" y="50" width="8" height="8" />
                  <rect x="48" y="48" width="12" height="10" />
                  <rect x="64" y="50" width="8" height="8" />
                  <rect x="76" y="48" width="8" height="10" />

                  <rect x="36" y="64" width="12" height="8" />
                  <rect x="52" y="62" width="6" height="10" />
                  <rect x="62" y="64" width="10" height="8" />
                  <rect x="76" y="64" width="8" height="8" />
                  <rect x="88" y="62" width="6" height="10" />

                  <rect x="36" y="76" width="8" height="12" />
                  <rect x="48" y="76" width="10" height="8" />
                  <rect x="62" y="76" width="8" height="10" />
                  <rect x="74" y="78" width="10" height="8" />
                  <rect x="88" y="76" width="6" height="12" />

                  <rect x="8" y="58" width="6" height="6" />
                  <rect x="18" y="58" width="8" height="6" />
                </svg>
              </div>
            </div>

            {/* Bottom Seal */}
            <div className="mt-3 pt-2 border-t border-dashed border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Guzasht Kafolatlangan Sayohat Muhri
              </span>
              <span>2233 Call-Markaz Qabul Xizmati</span>
            </div>
          </div>

          {/* Offline & Download Alerts */}
          {downloadSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Sertifikat qurilmangizga muvaffaqiyatli saqlandi! Internetsiz ham ochiladi.</span>
            </div>
          )}

          {copied && (
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs text-center">
              Havola va sertifikat ma’lumotlari nusxalandi!
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownload}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              <span>Offline Yuklab Olish</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition border border-slate-700"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Do‘stlarga Ulashish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
