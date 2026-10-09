import React, { useState } from 'react';
import { 
  X, CheckCircle2, Phone, User, FileText, 
  ShieldCheck, Coins, Building2, Send, MessageSquare, ArrowRight, ArrowLeft, QrCode 
} from 'lucide-react';
import { TourPackage, BookingOrder } from '../../types';
import { formatCurrency, calculateMonthly } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  pkg: TourPackage;
  isOpen?: boolean;
  initialPaymentType: 'full' | 'installment';
  initialMonths: 3 | 6 | 12 | 24;
  initialCoins: number;
  userCoins: number;
  onClose: () => void;
  onBookingSuccess: (order: BookingOrder) => void;
  onViewCertificate?: (order: BookingOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  pkg,
  isOpen = true,
  initialPaymentType,
  initialMonths,
  initialCoins,
  userCoins,
  onClose,
  onBookingSuccess,
  onViewCertificate,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Form state
  const [name, setName] = useState('Mavlonbek Komilov');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [note, setNote] = useState('');

  // Step 2: Payment state
  const [paymentType, setPaymentType] = useState<'full' | 'installment'>(initialPaymentType);
  const [months, setMonths] = useState<3 | 6 | 12 | 24>(initialMonths);
  const [usedCoins, setUsedCoins] = useState(initialCoins);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Step 4: Chat messages
  const [chatMessages, setChatMessages] = useState<{ sender: 'agent' | 'user'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: `Assalomu alaykum, hurmatli ${name}! "${pkg.title}" turingiz bo‘yicha arizangiz qabul qilindi. Hamkorimiz "${pkg.companyName}" operatori tez orada siz bilan bog‘lanadi.`,
      time: 'Hozir',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [orderId, setOrderId] = useState('ORD-' + Math.floor(10000 + Math.random() * 90000));
  const [lastCreatedOrder, setLastCreatedOrder] = useState<BookingOrder | null>(null);

  // Calculations
  const coinDiscount = usedCoins * 100;
  const finalPrice = Math.max(0, pkg.price - coinDiscount);
  const monthlyAmount = calculateMonthly(finalPrice, months);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    triggerHaptic('light');
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!acceptedTerms) return;
    triggerHaptic('light');
    setStep(3);
  };

  const handleConfirmOrder = () => {
    triggerHaptic('success');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    const certCode = 'GUZASHT-CERT-2026-' + orderId.replace(/\D/g, '');
    const order: BookingOrder = {
      id: orderId,
      packageId: pkg.id,
      packageTitle: pkg.title,
      companyName: pkg.companyName,
      customerName: name,
      customerPhone: phone,
      customerNote: note,
      paymentType,
      installmentMonths: months,
      monthlyAmount: paymentType === 'installment' ? monthlyAmount : 0,
      totalPrice: pkg.price,
      coinsUsed: usedCoins,
      coinDiscountAmount: coinDiscount,
      finalPaidAmount: finalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      certificateCode: certCode,
      hasMedicalEscort: pkg.isVipElderly || false,
    };

    setLastCreatedOrder(order);
    onBookingSuccess(order);
    setStep(4);

    // Sync order to backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch((err) => console.warn('Could not sync order to backend:', err));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Hozir' },
    ]);
    triggerHaptic('light');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Qabul qildik! 2233 operatorimiz barcha savollaringizni hisobga olgan holda qo‘ng‘iroq qiladi. Rahmat!`,
          time: 'Hozir',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#101929] border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="font-bold text-sm text-white">
              {step === 1 && "1-qadam: Sayohatchi Ma'lumotlari"}
              {step === 2 && "2-qadam: To'lov Usuli va Muddat"}
              {step === 3 && "3-qadam: Buyurtmani Tasdiqlash"}
              {step === 4 && "4-qadam: Ariza Muvaffaqiyatli!"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress indicators */}
        <div className="px-4 pt-2 pb-1 flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-sky-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3.5">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex gap-3">
                <img
                  src={pkg.images[0]}
                  alt={pkg.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-white line-clamp-1">{pkg.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{pkg.companyName}</p>
                  <p className="text-sky-400 font-extrabold mt-1">{formatCurrency(pkg.price)}</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ism va Familiya <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Mavlonbek Komilov"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Telefon raqam <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Disabled Demo Fields (Passport & Income certificate) */}
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  🔒 Bank shartnomasi bosqichida faollashadi (Demo)
                </span>
                <div>
                  <label className="block text-slate-500 text-[11px]">Pasport seriya va raqam</label>
                  <input
                    type="text"
                    disabled
                    value="AA ••••••• (Rasmiy versiyada ochiladi)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px]">Daromad ma'lumotnomasi (Skoring)</label>
                  <input
                    type="text"
                    disabled
                    value="Avtomatik MyGov / Bank integratsiyasi orqali"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Qo'shimcha istaklar (ixtiyoriy)
                </label>
                <textarea
                  rows={2}
                  placeholder="Keksalar uchun alohida ehtiyojlar yoki xona tanlovi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>To'lov turiga o'tish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Payment Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setPaymentType('installment');
                  }}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    paymentType === 'installment'
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bo'lib to'lash (0%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setPaymentType('full');
                  }}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    paymentType === 'full'
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bir yo'la to'lash
                </button>
              </div>

              {/* If Installment: choose 3, 6, 12, 24 */}
              {paymentType === 'installment' && (
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Muddatni tanlang:</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Foizsiz 0%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {([3, 6, 12, 24] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setMonths(m);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          months === m
                            ? 'bg-cyan-500 text-white border-cyan-400 shadow'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {m} oy
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-cyan-300">{formatCurrency(monthlyAmount)}/oy</p>
                      <p className="text-[10px] text-slate-400">{months} oyga bo'lib to'lanadi</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Ortiqcha to'lov 0 so'm
                    </span>
                  </div>
                </div>
              )}

              {/* Coin discount */}
              {userCoins > 0 && (
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      Coin chegirmasi:
                    </span>
                    <span className="font-bold text-white">-{formatCurrency(coinDiscount)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.min(userCoins, 2000)}
                    step="50"
                    value={usedCoins}
                    onChange={(e) => setUsedCoins(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{usedCoins} coin ishlatildi</span>
                    <span>Balans: {userCoins} coin</span>
                  </div>
                </div>
              )}

              {/* Bank partner notification */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-850 p-2.5 rounded-xl">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Uzum Bank va Alif Bank orqali rasmiylashtirish (muzokarada, demo)</span>
              </div>

              {/* Cancellation agreement checkbox */}
              <label className="flex items-start gap-2.5 p-2 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 accent-sky-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  Guzasht platformasining bekor qilish va qaytarish siyosati shartlari bilan tanishdim va roziman.
                </span>
              </label>

              <button
                type="button"
                disabled={!acceptedTerms}
                onClick={handleStep2Submit}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>Hisob-kitobni tekshirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Preview and Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-sm text-white pb-2 border-b border-slate-800">
                  Buyurtma Jamlamasi
                </h4>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tur paketi:</span>
                    <span className="font-bold text-white text-right">{pkg.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operator:</span>
                    <span className="font-medium text-slate-200">{pkg.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mijoz:</span>
                    <span className="font-medium text-slate-200">{name} ({phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">To'lov rejasi:</span>
                    <span className="font-bold text-cyan-400">
                      {paymentType === 'installment' ? `${months} oyga bo'lib to'lash` : 'Bir yo‘la to‘lov'}
                    </span>
                  </div>
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-amber-400 font-semibold">
                      <span>Coin chegirmasi:</span>
                      <span>-{formatCurrency(coinDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white">Jami to'lov:</span>
                  <span className="text-base font-black text-white">{formatCurrency(finalPrice)}</span>
                </div>

                {paymentType === 'installment' && (
                  <div className="p-2 bg-cyan-950/40 rounded-xl border border-cyan-500/30 flex justify-between items-center text-xs">
                    <span className="text-cyan-200">Oylik to'lov:</span>
                    <span className="font-black text-cyan-400 text-sm">{formatCurrency(monthlyAmount)}/oy</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Demo rejimida ariza bevosita tur firma va 2233 dispetcheriga jo'natiladi.
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Buyurtmani Tasdiqlash</span>
              </button>
            </div>
          )}

          {/* STEP 4: Success & Chat */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-white">Buyurtmangiz Qabul Qilindi!</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Buyurtma kodi: <span className="text-sky-400 font-mono font-bold">{orderId}</span>
                </p>
              </div>

              {/* Interactive Agent Chat */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-56">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{pkg.companyName} / 2233 Dispetcheri</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 py-2 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-2 rounded-xl text-[11px] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-sky-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] opacity-70 block text-right mt-0.5">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Operatorga xabar yozing..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

                {lastCreatedOrder && onViewCertificate && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onViewCertificate(lastCreatedOrder);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Rasmiy Sayohat Sertifikatini (QR Kod) Ko‘rish</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-98 transition"
                >
                  Yopish va sayohatlarni ko‘rish
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
