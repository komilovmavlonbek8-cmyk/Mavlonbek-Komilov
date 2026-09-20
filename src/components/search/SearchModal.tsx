import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Tag, Flame, Clock, Star, ArrowRight } from 'lucide-react';
import { TourPackage } from '../../types';
import { formatCurrency, calculateMonthly } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface SearchModalProps {
  isOpen: boolean;
  packages: TourPackage[];
  onClose: () => void;
  onSelectPackage: (pkg: TourPackage) => void;
}

// Cyrillic to Latin simple transliteration for Uzbek/Russian searchers
function transliterate(str: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '',
    э: 'e', ю: 'yu', я: 'ya', ў: "o'", қ: 'q', ғ: "g'", ҳ: 'h'
  };
  return str
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('');
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  packages,
  onClose,
  onSelectPackage,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Vetnam', 'Dubay', 'Samarqand VIP', 'Istanbul']);

  const popularTags = ['Vetnam', 'Dubay', 'Kappadokiya', 'VIP Keksalar', 'Ziyorat', 'Plyaj'];

  const filteredPackages = useMemo(() => {
    if (!query.trim()) return [];

    const normQuery = transliterate(query.trim());
    return packages.filter((p) => {
      const matchTitle = transliterate(p.title).includes(normQuery);
      const matchDest = transliterate(p.destination).includes(normQuery);
      const matchCompany = transliterate(p.companyName).includes(normQuery);
      const matchTags = p.tags.some((t) => transliterate(t).includes(normQuery));
      return matchTitle || matchDest || matchCompany || matchTags;
    });
  }, [query, packages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn pt-10">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Tur yoki shaharni qidiring (Lotin / Kirill)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm text-white focus:outline-none focus:border-sky-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 text-xs font-semibold"
          >
            Bekor
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar text-xs space-y-4">
          {/* Query Empty: Show Tags & Recents */}
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Oxirgi qidiruvlar
                    </span>
                    <button
                      onClick={() => setRecentSearches([])}
                      className="hover:text-slate-200"
                    >
                      Tozalash
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          triggerHaptic('light');
                          setQuery(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 active:scale-95"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                  <Flame className="w-3 h-3 text-amber-400" /> Ommabop yo'nalishlar
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        triggerHaptic('light');
                        setQuery(tag);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 active:scale-95 font-medium"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                Topilgan turlar ({filteredPackages.length})
              </span>

              {filteredPackages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-1">
                  <p className="font-semibold text-white">Hech narsa topilmadi</p>
                  <p className="text-[11px]">Boshqa kalit so'z yoki shaharni sinab ko'ring</p>
                </div>
              ) : (
                filteredPackages.map((pkg) => {
                  const monthly = calculateMonthly(pkg.price, 24);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        triggerHaptic('light');
                        onClose();
                        onSelectPackage(pkg);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 flex items-center gap-3 cursor-pointer transition active:scale-98"
                    >
                      <img
                        src={pkg.images[0]}
                        alt={pkg.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{pkg.destination}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-300" />
                            {pkg.rating.toFixed(1)}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate mt-0.5">
                          {pkg.title}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-extrabold text-white">
                            {formatCurrency(pkg.price)}
                          </span>
                          <span className="text-[10px] font-bold text-cyan-400">
                            {formatCurrency(monthly)}/oy (24x)
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
