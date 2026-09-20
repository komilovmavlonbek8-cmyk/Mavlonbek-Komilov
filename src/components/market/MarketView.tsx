import React, { useState, useMemo } from 'react';
import { Search, Flame, ArrowDownUp, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import { TourPackage } from '../../types';
import { PackageCard } from '../packages/PackageCard';
import { triggerHaptic } from '../../lib/twa';

interface MarketViewProps {
  packages: TourPackage[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onQuickBook: (pkg: TourPackage, mode: 'full' | 'installment') => void;
  onOpenSearch: () => void;
}

type SortType = 'all' | 'cheap' | 'expensive' | 'rating' | 'discount' | 'vip';

export const MarketView: React.FC<MarketViewProps> = ({
  packages,
  wishlistIds,
  onToggleWishlist,
  onSelectPackage,
  onQuickBook,
  onOpenSearch,
}) => {
  const [activeSort, setActiveSort] = useState<SortType>('all');

  const filteredAndSortedPackages = useMemo(() => {
    let list = [...packages];

    if (activeSort === 'vip') {
      list = list.filter((p) => p.isVipElderly);
    } else if (activeSort === 'discount') {
      list = list.filter((p) => p.discountPercent > 0).sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (activeSort === 'cheap') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'expensive') {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [packages, activeSort]);

  const filterTabs = [
    { id: 'all' as SortType, label: 'Hammasi' },
    { id: 'discount' as SortType, label: '🔥 Chegirma' },
    { id: 'cheap' as SortType, label: 'Arzon' },
    { id: 'expensive' as SortType, label: 'Qimmat' },
    { id: 'rating' as SortType, label: '⭐ Reyting' },
    { id: 'vip' as SortType, label: '👵 VIP Keksalar' },
  ];

  return (
    <div className="space-y-3 pb-24">
      {/* Search Bar (Uzum Market Style) */}
      <div className="px-4 pt-2">
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSearch();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 hover:border-sky-400/60 rounded-2xl text-slate-400 text-xs shadow-md active:scale-98 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-400" />
            <span>Tur paket yoki shaharni qidirish...</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-medium">
            24 oy 0%
          </span>
        </button>
      </div>

      {/* Sticky Horizontal Filters Row */}
      <div className="sticky top-[57px] z-20 bg-[#0b111e]/90 backdrop-blur-md py-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveSort(tab.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
                activeSort === tab.id
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid (FAQAT 24 oylik narx ko'rinadi) */}
      <div className="px-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>{filteredAndSortedPackages.length} ta tur paket mavjud</span>
          <span className="text-cyan-400 font-bold">24 oyga foizsiz muddat</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredAndSortedPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isWishlisted={wishlistIds.includes(pkg.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectPackage}
              onQuickBook={onQuickBook}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
