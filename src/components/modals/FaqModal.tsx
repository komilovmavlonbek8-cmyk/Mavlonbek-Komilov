import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Bron & To‘lov',
      question: 'Tur paketni qanday bron qilaman va to‘layman?',
      answer: "Ilovada o‘zingizga ma’qul kelgan tur paketini tanlang. 'Bron qilish' tugmasini bosing. Siz to‘liq to‘lash (Payme/Click/Karta) yoki 3, 6, 12, 24 oylik 0% Halol Nasiyaga bo‘lib to‘lashni tanlashingiz mumkin. To‘lov amalga oshgach, profilingizda avtomatik ravishda tasdiqlangan QR-kodli sertifikat hosil bo‘ladi.",
    },
    {
      id: 'faq-2',
      category: 'Sertifikat',
      question: 'QR-kodli sayohat sertifikati qonuniymi va uni qayerda ko‘rsataman?',
      answer: "Ha, har bir sertifikat O‘zbekiston Turizm Qo‘mitasi va rasmiy litsenziyalangan tur operator orqali ro‘yxatga olingan unikal raqam hamda QR-kodga ega. Uni aeroportda, viza markazida yoki favqulodda vaziyatlarda ko‘rsatish mumkin. Shuningdek, sertifikatni PDF shaklida yuklab olishingiz mumkin.",
    },
    {
      id: 'faq-3',
      category: 'Keksalar & 2233',
      question: '2233 ishonch raqami nima va u bepulmi?',
      answer: "2233 — bu keksalar, ziyoratchilar va ularning farzandlari uchun 24/7 ishlaydigan davlat hamda xususiy sektor hamkorligidagi bepul call-markaz. Telefon qilib, turlar holati, hamshira xizmatlari yoki keksalar uchun 50% gacha davlat subsidiyalari haqida bepul maslahat olishingiz mumkin.",
    },
    {
      id: 'faq-4',
      category: 'Nasiya',
      question: 'Halol Nasiyaga bo‘lib to‘lashda ustama yoki penya bormi?',
      answer: "Mutlaqo yo‘q! Guzasht platformasidagi muddatli to‘lovlar Islom moliyasi tamoyillariga to‘liq mos keladi. To‘lov kechikkan taqdirda ham qo‘shimcha penya (jarima) solinmaydi. Shartnoma tuzilgan kundagi narx sayohat davomida o‘zgarmaydi.",
    },
    {
      id: 'faq-5',
      category: 'Coinlar',
      question: 'Guzasht Coinlarni qanday yig‘ish va ishlatish mumkin?',
      answer: "Ilovaga har kuni kirganingizda, o‘yinlarni o‘ynaganda, sayohatdan so‘ng rasm va izohlar qoldirganda yoki do‘stingizni taklif qilganingizda hisobingizga Coinlar qo‘shiladi. Yig‘ilgan Coinlarni keyingi turlarda real chegirma sifatida (1 Coin = 1 so‘m) qo‘llashingiz mumkin.",
    },
    {
      id: 'faq-6',
      category: 'Bekor qilish',
      question: 'Agar sayohatga bora olmasam, pulim qaytariladimi?',
      answer: "Ha! Rasmiy qaytarish siyosatimizga binoan: parvozdan 30 kun oldin 100% mablag‘ qaytariladi; 15-30 kun qolganda 70%; 7-15 kun qolganda 50%. Bemorlik tufayli bekor qilinganda tibbiy ma’lumotnoma bilan to‘liq summa saqlab qolinishi yoki boshqa muddatga ko‘chirilishi mumkin.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <MessageCircleQuestion className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Ko‘p So‘raladigan Savollar</h3>
              <p className="text-[11px] text-slate-400">Tez-tez beriladigan savollarga aniq javoblar</p>
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

        {/* FAQ Accordion List */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-2.5">
          {faqs.map((faq) => {
            const isOpenAccordion = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setOpenId(isOpenAccordion ? null : faq.id);
                  }}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-2.5 hover:bg-slate-800/50 transition"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase text-sky-400 tracking-wider">
                      {faq.category}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {faq.question}
                    </h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                    {isOpenAccordion ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {isOpenAccordion && (
                  <div className="p-3.5 pt-0 border-t border-slate-800/60 text-[11px] text-slate-300 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {/* Still have questions */}
          <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-center space-y-2 mt-3">
            <p className="text-xs font-bold text-white">Savolingizga javob topmadingizmi?</p>
            <p className="text-[11px] text-slate-300">
              2233 bepul ishonch raqamiga qo‘ng‘iroq qiling yoki rasmiy Telegram botimizga yozing.
            </p>
            <a
              href="tel:2233"
              onClick={() => triggerHaptic('medium')}
              className="inline-block py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md"
            >
              📞 2233 Operatoriga Bog‘lanish
            </a>
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
