import React, { useState } from 'react';
import { 
  X, Building2, Video, Camera, Plus, CheckCircle2, 
  ShieldCheck, MapPin, Phone, Sparkles, FileText 
} from 'lucide-react';
import { TourCompany, Story, TourPackage } from '../../types';
import { triggerHaptic } from '../../lib/twa';

interface AgencyRegisterModalProps {
  companies: TourCompany[];
  packages: TourPackage[];
  onRegisterCompany: (company: Omit<TourCompany, 'id' | 'rating' | 'toursCount' | 'followersCount'>) => void;
  onAddStory: (story: Omit<Story, 'id' | 'viewsCount' | 'hasUnseen'>) => void;
  onClose: () => void;
}

export const AgencyRegisterModal: React.FC<AgencyRegisterModalProps> = ({
  companies,
  packages,
  onRegisterCompany,
  onAddStory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'add_story' | 'register_agency'>('add_story');

  // Story / Reels form state
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [mediaType, setMediaType] = useState<'story' | 'reels'>('story');
  const [storyImage, setStoryImage] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Dubay, BAA');
  const [linkedTourId, setLinkedTourId] = useState('');

  // Agency register form state
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('+998 71 ');
  const [city, setCity] = useState('Toshkent');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const comp = companies.find((c) => c.id === selectedCompanyId) || companies[0] || {
      id: 'comp-1',
      name: 'Silk Road Travel',
      logo: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?w=100&auto=format&fit=crop&q=80',
    };

    triggerHaptic('success');
    onAddStory({
      userId: comp.id,
      userName: comp.name,
      userAvatar: comp.logo,
      image: storyImage,
      caption,
      location,
      isCompany: true,
      companyId: comp.id,
      tourId: linkedTourId || undefined,
      type: mediaType,
    });

    setSuccessMsg('Story muvaffaqiyatli joylandi!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  const handleRegisterAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim() || !licenseNumber.trim()) return;

    triggerHaptic('success');
    onRegisterCompany({
      name: agencyName,
      logo,
      verified: true,
      phone,
      city,
      licenseNumber,
      description: description || 'Litsenziyalangan turizm agentligi.',
    });

    setSuccessMsg('Tur firma muvaffaqiyatli ro‘yxatdan o‘tdi!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-950 via-[#111c2e] to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Tur Firmalar Kabineti</h3>
              <p className="text-[10px] text-slate-400">B2B Stories, Reels va Hamkorlik</p>
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

        {/* Tab Switcher */}
        <div className="flex p-1.5 mx-4 mt-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('add_story');
            }}
            className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'add_story' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Story / Reels Joylash</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('register_agency');
            }}
            className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register_agency' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Firma Ro‘yxati</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar flex-1">
          {/* TAB 1: Add Story / Reels */}
          {activeTab === 'add_story' && (
            <form onSubmit={handleCreateStory} className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Hozirgi bosqichda faqat tasdiqlangan tur firmalar Stories va Reels joylashi mumkin.
                </span>
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Tur Firmangizni tanlang:</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city || 'Toshkent'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Format turi:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('story')}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      mediaType === 'story'
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    📸 24-soatlik Story
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('reels')}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      mediaType === 'reels'
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    🎬 Doimiy Reels
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Rasm / Video Muqovasi URL:</label>
                <input
                  type="url"
                  value={storyImage}
                  onChange={(e) => setStoryImage(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Sarlavha va Tavsif:</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Yangi mavsumdagi ajoyib taklifimiz..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block font-semibold mb-1">Joylashuv:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dubay, BAA"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block font-semibold mb-1">Bog‘liq Tur Paketi:</label>
                  <select
                    value={linkedTourId}
                    onChange={(e) => setLinkedTourId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400 truncate"
                  >
                    <option value="">Hech qanday</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg active:scale-98 transition flex items-center justify-center gap-2 mt-2"
              >
                <Video className="w-4 h-4" />
                <span>Story / Reels Joylash</span>
              </button>
            </form>
          )}

          {/* TAB 2: Register Agency */}
          {activeTab === 'register_agency' && (
            <form onSubmit={handleRegisterAgency} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block font-semibold mb-1">Tur Firma Nomi:</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Maroqand Voyage"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block font-semibold mb-1">Litsenziya №:</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="T-0982-UZ"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block font-semibold mb-1">Shahar:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Samarqand"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Aloqa Telefoni:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 71 200 00 00"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Firma Logotipi URL:</label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block font-semibold mb-1">Firma haqida qisqacha:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bizning asosiy yo‘nalishlarimiz va afzalliklarimiz..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg active:scale-98 transition flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tur Firmani Ro‘yxatdan O‘tkazish</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
