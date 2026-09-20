import React from 'react';
import { Heart, Star, ShieldCheck } from 'lucide-react';
import { TourPackage } from '../../types';
import { formatCurrency, calculateMonthly } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface PackageCardProps {
  pkg: TourPackage;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelect: (pkg: TourPackage) => void;
  onQuickBook?: (pkg: TourPackage, mode: 'full' | 'installment') => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  onQuickBook,
}) => {
  // 24-month installment is strictly emphasized on market & explore cards as specified
  const monthly24 = calculateMonthly(pkg.price, 24);

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onSelect(pkg);
      }}
      className="group relative flex flex-col rounded-2xl bg-[#111c2e] border border-slate-800/80 hover:border-sky-500/40 shadow-lg overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.98]"
    >
      {/* Media & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge (-17%) - matches screenshot */}
        {pkg.discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white shadow-sm">
            -{pkg.discountPercent}%
          </span>
        )}

        {/* Rating Badge (⭐ 4.2) - matches screenshot */}
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-amber-300 border border-slate-700/50 shadow-sm">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>{pkg.rating.toFixed(1)}</span>
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('medium');
            onToggleWishlist(pkg.id);
          }}
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:text-rose-400 hover:bg-slate-900 transition-all active:scale-90"
          aria-label="Sevimlilar"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* VIP Elderly Care Tag */}
        {pkg.isVipElderly && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 backdrop-blur-md text-white flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            VIP Keksalar
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-3">
        {/* Company Info */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <img
            src={pkg.companyLogo}
            alt={pkg.companyName}
            className="w-4 h-4 rounded-full object-cover border border-slate-700"
          />
          <span className="text-[11px] font-medium text-slate-400 truncate">
            {pkg.companyName}
          </span>
        </div>

        {/* Tour Title */}
        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors">
          {pkg.title}
        </h3>

        {/* Days & Sold Count */}
        <p className="text-[11px] text-slate-400 mt-1">
          {pkg.durationDays} kun • {pkg.soldCount} ta sotilgan
        </p>

        {/* Price Row (Strikethrough old + bold new) */}
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          {pkg.originalPrice > pkg.price && (
            <span className="text-[11px] text-slate-400 line-through">
              {new Intl.NumberFormat('uz-UZ').format(pkg.originalPrice)}
            </span>
          )}
          <span className="text-xs sm:text-sm font-extrabold text-white">
            {formatCurrency(pkg.price)}
          </span>
        </div>

        {/* 24-Month Installment Box - EXACT match to screenshot */}
        <div className="mt-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors">
          <div className="text-xs sm:text-sm font-black text-cyan-400 leading-tight">
            {formatCurrency(monthly24)}/oy
          </div>
          <div className="text-[10px] text-cyan-200/70 font-medium">
            24 oyga bo'lib to'lash
          </div>
        </div>

        {/* Quick action buttons on hover / mobile */}
        {onQuickBook && (
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                onQuickBook(pkg, 'installment');
              }}
              className="py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold transition active:scale-95 text-center truncate"
            >
              Bo'lib to'lash
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                onQuickBook(pkg, 'full');
              }}
              className="py-1.5 px-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-bold transition active:scale-95 text-center truncate"
            >
              Sotib olish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
