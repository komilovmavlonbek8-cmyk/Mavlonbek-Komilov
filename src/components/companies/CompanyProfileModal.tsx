import React from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Star, Users, 
  MapPin, Phone, Building2, ChevronRight, Video, 
  Sparkles, Compass, Heart 
} from 'lucide-react';
import { TourCompany, TourPackage, Story } from '../../types';
import { formatCurrency } from '../../lib/installment';
import { triggerHaptic } from '../../lib/twa';

interface CompanyProfileModalProps {
  company: TourCompany;
  isFollowed: boolean;
  packages: TourPackage[];
  stories: Story[];
  onToggleFollow: (companyId: string) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onOpenStory: (story: Story) => void;
  onClose: () => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  company,
  isFollowed,
  packages,
  stories,
  onToggleFollow,
  onSelectPackage,
  onOpenStory,
  onClose,
}) => {
  if (!company) return null;

  const companyPackages = (packages || []).filter((p) => p && p.companyId === company.id);
  const companyStories = (stories || []).filter((s) => s && (s.companyId === company.id || s.userId === company.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover */}
        <div className="relative h-28 bg-gradient-to-r from-sky-700 via-indigo-800 to-purple-800 p-3 flex justify-between items-start">
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-sky-200 text-[10px] font-bold flex items-center gap-1 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Litsenziyalangan Tur Firma
          </span>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company Avatar & Follow Info */}
        <div className="px-4 -mt-10 pb-3 border-b border-slate-800 relative z-10 flex items-end justify-between gap-3">
          <div className="flex items-end gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0e1626] shadow-xl bg-slate-800"
            />
            <div className="mb-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-base leading-tight">
                  {company.name}
                </h3>
                {company.verified && (
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                {company.city || 'Toshkent, O‘zbekiston'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              onToggleFollow(company.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md flex items-center gap-1.5 ${
              isFollowed
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20'
            }`}
          >
            {isFollowed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kuzatilyapti</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5" />
                <span>Kuzatish</span>
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-slate-800/80 bg-slate-900/40 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Kuzatuvchilar</span>
            <span className="font-extrabold text-white text-sm">
              {((company.followersCount || 12000) + (isFollowed ? 1 : 0)).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Tur paketlar</span>
            <span className="font-extrabold text-sky-400 text-sm">
              {companyPackages.length || company.toursCount} ta
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Reyting</span>
            <span className="font-extrabold text-amber-400 text-sm flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {company.rating}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar flex-1">
          {/* Company Bio & License */}
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <p className="leading-relaxed">{company.description}</p>
            {company.licenseNumber && (
              <p className="text-[10px] text-sky-400 font-mono">
                Litsenziya: {company.licenseNumber}
              </p>
            )}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{company.phone}</span>
            </div>
          </div>

          {/* Stories & Reels by this Agency */}
          {companyStories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-pink-400" />
                  Stories va Reels
                </h4>
                <span className="text-[10px] text-slate-400">{companyStories.length} ta video</span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {companyStories.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      triggerHaptic('light');
                      onOpenStory(st);
                    }}
                    className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-700 hover:border-sky-400 transition group"
                  >
                    <img src={st.image} alt={st.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] text-white font-medium truncate block text-left">
                      {st.caption}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agency Tours List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Firmaning Tur Paketlari ({companyPackages.length})
              </h4>
            </div>

            <div className="space-y-2">
              {companyPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectPackage(pkg);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 flex items-center gap-3 cursor-pointer active:scale-98 transition"
                >
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white text-xs truncate">{pkg.title}</h5>
                    <p className="text-[10px] text-slate-400">{pkg.durationDays} kun • {pkg.destination}</p>
                    <p className="text-xs font-extrabold text-sky-400 mt-0.5">
                      {formatCurrency(pkg.price)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
