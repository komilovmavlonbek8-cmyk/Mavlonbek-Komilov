import React, { useState } from 'react';
import { 
  Gamepad2, Sparkles, Trophy, CheckCircle2, RotateCw, 
  HelpCircle, Compass, Flame, ArrowRight 
} from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';
import confetti from 'canvas-confetti';

interface GamesViewProps {
  coins: number;
  dailyClaimed: boolean;
  onRewardCoins: (amount: number, reason: string) => void;
  onClaimDaily: () => void;
}

export const GamesView: React.FC<GamesViewProps> = ({
  coins,
  dailyClaimed,
  onRewardCoins,
  onClaimDaily,
}) => {
  // Fortune wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWonAmount, setWheelWonAmount] = useState<number | null>(null);

  // Guess the city quiz state
  const [cityIndex, setCityIndex] = useState(0);
  const [citySelectedAnswer, setCitySelectedAnswer] = useState<string | null>(null);
  const [cityFeedback, setCityFeedback] = useState<'correct' | 'wrong' | null>(null);

  const cityQuizzes = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80',
      question: "Suratda qaysi mashhur shahar tasvirlangan?",
      options: ['Istanbul', 'Dubay', 'Rim', 'Qohira'],
      correct: 'Istanbul',
      reward: 30,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80',
      question: "Registon maydoni qaysi tarixiy shahrimizda joylashgan?",
      options: ['Samarqand', 'Buxoro', 'Xiva', 'Shahrisabz'],
      correct: 'Samarqand',
      reward: 30,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
      question: "Burj Khalifa osmono‘par binosi qaysi shaharda?",
      options: ['Dubay', 'Doha', 'Ar-Riyod', 'Abu-Dabi'],
      correct: 'Dubay',
      reward: 30,
    },
  ];

  // Spin wheel segments
  const spinRewards = [50, 100, 200, 50, 500, 150];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelWonAmount(null);
    triggerHaptic('medium');

    const randomDegree = 1440 + Math.floor(Math.random() * 360);
    const newRotation = wheelRotation + randomDegree;
    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = spinRewards[Math.floor(Math.random() * spinRewards.length)];
      setWheelWonAmount(chosen);
      onRewardCoins(chosen, "Omad charxpalagi yutug'i");
      triggerHaptic('success');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // fallback
      }
    }, 3000);
  };

  const handleCityAnswer = (option: string) => {
    if (citySelectedAnswer) return;
    setCitySelectedAnswer(option);
    const currentQ = cityQuizzes[cityIndex];

    if (option === currentQ.correct) {
      setCityFeedback('correct');
      triggerHaptic('success');
      onRewardCoins(currentQ.reward, `Shahar topildi: ${currentQ.correct}`);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch {
        // fallback
      }
    } else {
      setCityFeedback('wrong');
      triggerHaptic('error');
    }

    setTimeout(() => {
      setCitySelectedAnswer(null);
      setCityFeedback(null);
      setCityIndex((prev) => (prev + 1) % cityQuizzes.length);
    }, 1800);
  };

  return (
    <div className="space-y-4 px-4 py-2 pb-24 max-w-md mx-auto text-slate-100">
      {/* Coin Balance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-600/20 border border-amber-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            🪙 Sizning Coin Balansingiz
          </span>
          <p className="text-2xl font-black text-white mt-0.5">
            {coins.toLocaleString()} <span className="text-amber-400 text-sm">Coin</span>
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Tur paketlariga 20% gacha chegirma qiling!
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
          <Trophy className="w-7 h-7" />
        </div>
      </div>

      {/* GAME 1: Daily Login Bonus (+50/kun) */}
      <div className="p-4 rounded-2xl bg-[#111c2e] border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <div>
              <h4 className="font-bold text-xs text-white">Kunlik Kirish Bonusi</h4>
              <p className="text-[10px] text-slate-400">Har kuni ilovaga kiring va bepul coin oling</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400">+50 Coin</span>
        </div>

        <button
          onClick={() => {
            if (!dailyClaimed) {
              triggerHaptic('success');
              onClaimDaily();
              try {
                confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
              } catch {
                // fallback
              }
            }
          }}
          disabled={dailyClaimed}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
            dailyClaimed
              ? 'bg-slate-800 text-emerald-400 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 active:scale-98 shadow'
          }`}
        >
          {dailyClaimed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Bugungi bonus olindi (+50 Coin)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>+50 Coinni qabul qilish</span>
            </>
          )}
        </button>
      </div>

      {/* GAME 2: Daily Spin (Charxpalak) */}
      <div className="p-4 rounded-2xl bg-[#111c2e] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎡</span>
            <div>
              <h4 className="font-bold text-xs text-white">Omad Charxpalagi</h4>
              <p className="text-[10px] text-slate-400">+50 dan +500 gacha coin yutib oling</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
            Kunlik imkoniyat
          </span>
        </div>

        {/* Wheel Visual */}
        <div className="flex flex-col items-center justify-center py-3">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Pointer */}
            <div className="absolute -top-2 z-20 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow" />

            {/* Rotating Disc */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-indigo-900 via-sky-800 to-purple-900 shadow-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black text-amber-300">SPIN</span>
              </div>
              <div className="absolute top-2 text-[10px] font-bold text-white">500</div>
              <div className="absolute bottom-2 text-[10px] font-bold text-white">50</div>
              <div className="absolute right-2 text-[10px] font-bold text-white">200</div>
              <div className="absolute left-2 text-[10px] font-bold text-white">100</div>
            </div>
          </div>

          {wheelWonAmount && (
            <div className="mt-3 text-center text-xs font-bold text-emerald-400 animate-bounce">
              Tabriklaymiz! +{wheelWonAmount} Coin hisobingizga qo'shildi! 🎉
            </div>
          )}

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs disabled:opacity-50 active:scale-98 transition shadow"
          >
            {isSpinning ? "Aylanmoqda..." : "Charxpalakni aylantirish"}
          </button>
        </div>
      </div>

      {/* GAME 3: Guess the City */}
      <div className="p-4 rounded-2xl bg-[#111c2e] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            <div>
              <h4 className="font-bold text-xs text-white">Shahar Topish O'yini</h4>
              <p className="text-[10px] text-slate-400">Fotosuratga qarab shaharni toping va +30 coin oling</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400">+30 Coin</span>
        </div>

        {/* City Photo */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800">
          <img
            src={cityQuizzes[cityIndex].image}
            alt="City Quiz"
            className="w-full h-full object-cover"
          />
          {cityFeedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center font-extrabold text-sm backdrop-blur-sm ${
                cityFeedback === 'correct' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
              }`}
            >
              {cityFeedback === 'correct' ? "To'g'ri topdingiz! (+30 Coin) 🎉" : "Afsuski noto'g'ri, yana urinib ko'ring"}
            </div>
          )}
        </div>

        <p className="text-xs font-semibold text-white">
          {cityQuizzes[cityIndex].question}
        </p>

        {/* Options 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {cityQuizzes[cityIndex].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleCityAnswer(opt)}
              disabled={citySelectedAnswer !== null}
              className={`py-2 px-3 rounded-xl font-medium border text-left transition active:scale-95 ${
                citySelectedAnswer === opt
                  ? opt === cityQuizzes[cityIndex].correct
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
