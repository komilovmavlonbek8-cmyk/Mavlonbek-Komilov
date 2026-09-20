/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MOCK_PACKAGES, MOCK_STORIES, MOCK_COMPANIES, 
  MOCK_RECOMMENDATIONS, MOCK_COMMENTS, MOCK_BOOKINGS, 
  MOCK_COIN_TRANSACTIONS, INITIAL_USER 
} from './mock/data';
import { 
  TabType, TourPackage, Story, RecommendationPost, 
  CommentItem, UserProfile, BookingOrder, CoinTransaction, 
  TourCompany, ConnectedBankCard, SavedTravelMedia, TravelSavingsGoal 
} from './types';
import { initTelegramApp, triggerHaptic } from './lib/twa';

import { TopBar } from './components/layout/TopBar';
import { TabBar } from './components/layout/TabBar';
import { HamburgerDrawer } from './components/layout/HamburgerDrawer';
import { DemoBadgeModal } from './components/common/DemoBadgeModal';
import { CoinBalanceModal } from './components/common/CoinBalanceModal';

import { StoriesRow } from './components/explore/StoriesRow';
import { PackageCard } from './components/packages/PackageCard';
import { PackageDetailModal } from './components/packages/PackageDetailModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { SearchModal } from './components/search/SearchModal';

import { MarketView } from './components/market/MarketView';
import { RecommendView } from './components/recommend/RecommendView';
import { GamesView } from './components/games/GamesView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminPanel } from './components/admin/AdminPanel';

import { TravelCertificateModal } from './components/certificate/TravelCertificateModal';
import { CompanyProfileModal } from './components/companies/CompanyProfileModal';
import { AgencyRegisterModal } from './components/companies/AgencyRegisterModal';

export default function App() {
  // Navigation & Modals state
  const [currentTab, setCurrentTab] = useState<TabType>('explore');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDemoInfoOpen, setIsDemoInfoOpen] = useState(false);
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // New Feature Modals state
  const [selectedCertificateOrder, setSelectedCertificateOrder] = useState<BookingOrder | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isAgencyCabinetOpen, setIsAgencyCabinetOpen] = useState(false);

  // Core Data state
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [packages, setPackages] = useState<TourPackage[]>(MOCK_PACKAGES);
  const [companies, setCompanies] = useState<TourCompany[]>(MOCK_COMPANIES);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [recommendations, setRecommendations] = useState<RecommendationPost[]>(MOCK_RECOMMENDATIONS);
  const [comments, setComments] = useState<CommentItem[]>(MOCK_COMMENTS);
  const [bookings, setBookings] = useState<BookingOrder[]>(MOCK_BOOKINGS);
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(MOCK_COIN_TRANSACTIONS);

  // Selected tour detail state
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('guzasht_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('guzasht_theme', next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Checkout modal state
  const [checkoutPackage, setCheckoutPackage] = useState<TourPackage | null>(null);
  const [checkoutPaymentType, setCheckoutPaymentType] = useState<'full' | 'installment'>('installment');
  const [checkoutMonths, setCheckoutMonths] = useState<3 | 6 | 12 | 24>(24);
  const [checkoutCoinsApplied, setCheckoutCoinsApplied] = useState(0);

  // Explore category filter
  const [exploreFilter, setExploreFilter] = useState<'all' | 'vip' | 'discount' | 'beach' | 'ziyorat'>('all');

  // Initialize Telegram Web App on mount
  useEffect(() => {
    initTelegramApp();
  }, []);

  // Coins Reward Handler
  const handleRewardCoins = (amount: number, reason: string) => {
    setUser((prev) => ({ ...prev, coins: prev.coins + amount }));
    setCoinTransactions((prev) => [
      {
        id: 'tx-' + Date.now(),
        title: reason,
        amount,
        type: 'earn',
        date: 'Hozir',
      },
      ...prev,
    ]);
  };

  // Daily Claim
  const handleClaimDaily = () => {
    if (user.dailyLoginClaimedToday) return;
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + 50,
      dailyLoginClaimedToday: true,
    }));
    setCoinTransactions((prev) => [
      {
        id: 'tx-' + Date.now(),
        title: 'Kunlik ilovaga kirish bonusi',
        amount: 50,
        type: 'earn',
        date: 'Bugun',
      },
      ...prev,
    ]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (pkgId: string) => {
    setUser((prev) => {
      const exists = prev.savedPackageIds.includes(pkgId);
      return {
        ...prev,
        savedPackageIds: exists
          ? prev.savedPackageIds.filter((id) => id !== pkgId)
          : [...prev.savedPackageIds, pkgId],
      };
    });
  };

  // Agency Follow / Unfollow toggle
  const handleToggleFollowCompany = (companyId: string) => {
    setUser((prev) => {
      const isFollowing = (prev.followedCompanyIds || []).includes(companyId);
      const updatedFollows = isFollowing
        ? prev.followedCompanyIds.filter((id) => id !== companyId)
        : [...(prev.followedCompanyIds || []), companyId];
      return {
        ...prev,
        followedCompanyIds: updatedFollows,
      };
    });

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const isCurrentlyFollowed = (user.followedCompanyIds || []).includes(companyId);
          return {
            ...c,
            followersCount: Math.max(0, (c.followersCount || 1000) + (isCurrentlyFollowed ? -1 : 1)),
          };
        }
        return c;
      })
    );
  };

  // Agency Register
  const handleRegisterCompany = (
    newCompanyData: Omit<TourCompany, 'id' | 'rating' | 'toursCount' | 'followersCount'>
  ) => {
    const compId = 'comp-' + Date.now();
    const newComp: TourCompany = {
      ...newCompanyData,
      id: compId,
      rating: 5.0,
      toursCount: 0,
      followersCount: 1,
    };
    setCompanies((prev) => [newComp, ...prev]);
    // auto-follow user
    setUser((prev) => ({
      ...prev,
      followedCompanyIds: [...(prev.followedCompanyIds || []), compId],
    }));
  };

  // Add Agency Story or Reels
  const handleAddAgencyStory = (
    newStoryData: Omit<Story, 'id' | 'viewsCount' | 'hasUnseen'>
  ) => {
    const newStory: Story = {
      ...newStoryData,
      id: 'story-' + Date.now(),
      viewsCount: 0,
      hasUnseen: true,
    };
    setStories((prev) => [newStory, ...prev]);
  };

  // Add Bank Card
  const handleAddBankCard = (cardData: Omit<ConnectedBankCard, 'id'>) => {
    const newCard: ConnectedBankCard = {
      ...cardData,
      id: 'card-' + Date.now(),
    };
    setUser((prev) => ({
      ...prev,
      cards: [...(prev.cards || []), newCard],
    }));
  };

  // Add Saved Travel Media
  const handleAddSavedMedia = (mediaData: Omit<SavedTravelMedia, 'id'>) => {
    const newMedia: SavedTravelMedia = {
      ...mediaData,
      id: 'med-' + Date.now(),
    };
    setUser((prev) => ({
      ...prev,
      savedMedia: [newMedia, ...(prev.savedMedia || [])],
    }));
  };

  // Update Savings Goal
  const handleUpdateSavingsGoal = (goal: TravelSavingsGoal) => {
    setUser((prev) => ({
      ...prev,
      savingsGoal: goal,
    }));
  };

  // Add Comment (+20 coin reward)
  const handleAddComment = (pkgId: string, text: string, rating: number) => {
    const newCmt: CommentItem = {
      id: 'cmt-' + Date.now(),
      packageId: pkgId,
      userName: user.name,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating,
      text,
      createdAt: 'Hozir',
      likes: 0,
    };
    setComments((prev) => [newCmt, ...prev]);
    handleRewardCoins(20, 'Fikr va sharh qoldirish');
  };

  // Checkout open
  const handleOpenCheckout = (
    pkg: TourPackage,
    paymentType: 'full' | 'installment',
    months: 3 | 6 | 12 | 24 = 24,
    coinsApplied: number = 0
  ) => {
    setSelectedPackage(null);
    setCheckoutPackage(pkg);
    setCheckoutPaymentType(paymentType);
    setCheckoutMonths(months);
    setCheckoutCoinsApplied(coinsApplied);
  };

  // Quick Book direct from Card
  const handleQuickBook = (pkg: TourPackage, mode: 'full' | 'installment') => {
    handleOpenCheckout(pkg, mode, 24, 0);
  };

  // Booking Success
  const handleBookingSuccess = (order: BookingOrder) => {
    setBookings((prev) => [order, ...prev]);
    if (order.coinsUsed > 0) {
      setUser((prev) => ({ ...prev, coins: Math.max(0, prev.coins - order.coinsUsed) }));
      setCoinTransactions((prev) => [
        {
          id: 'tx-' + Date.now(),
          title: `Bron uchun coin ishlatildi (${order.packageTitle})`,
          amount: order.coinsUsed,
          type: 'spend',
          date: 'Bugun',
        },
        ...prev,
      ]);
    }
  };

  // Recommendation Post Add (+100 coin)
  const handleAddRecommendation = (
    newPost: Omit<RecommendationPost, 'id' | 'likes' | 'dislikes' | 'commentsCount' | 'createdAt' | 'status'>
  ) => {
    const post: RecommendationPost = {
      ...newPost,
      id: 'rec-' + Date.now(),
      likes: 1,
      dislikes: 0,
      commentsCount: 0,
      createdAt: 'Hozir',
      status: 'published',
    };
    setRecommendations((prev) => [post, ...prev]);
    handleRewardCoins(100, 'Sayohat tavsiyasi ulashildi');
  };

  // Like / Dislike recommendation
  const handleLikePost = (postId: string) => {
    setRecommendations((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
            isDisliked: false,
          };
        }
        return p;
      })
    );
  };

  const handleDislikePost = (postId: string) => {
    setRecommendations((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isDisliked = !p.isDisliked;
          return {
            ...p,
            isDisliked,
            dislikes: isDisliked ? p.dislikes + 1 : Math.max(0, p.dislikes - 1),
            isLiked: false,
          };
        }
        return p;
      })
    );
  };

  const handleReportPost = (postId: string) => {
    alert('Shikoyatingiz qabul qilindi. Moderatorlar tekshirib chiqadi.');
  };

  // Package CRUD operations for Admin
  const handleAddPackage = (newPkg: TourPackage) => {
    setPackages((prev) => [newPkg, ...prev]);
  };

  const handleUpdatePackage = (updatedPkg: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  const handleDeletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Filtered packages for Explore view (excluding elderly tours per user request)
  const explorePackages = packages.filter((p) => {
    if (p.isVipElderly) return false;
    if (exploreFilter === 'discount') return p.discountPercent > 0;
    if (exploreFilter === 'beach') return p.tags.includes('Plyaj') || p.tags.includes('Orol');
    if (exploreFilter === 'ziyorat') return p.tags.includes('Ziyorat');
    return true;
  });

  const activeCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <div className={`min-h-screen flex flex-col justify-between select-none transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b111e] text-slate-100'
    }`}>
      {/* TopBar matching screenshot */}
      <TopBar
        coins={user.coins}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDemoInfo={() => setIsDemoInfoOpen(true)}
        onOpenCoinsModal={() => setIsCoinsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {/* TAB 1: EXPLORE (ASOSIY) */}
        {currentTab === 'explore' && (
          <div className="space-y-3 pt-1">
            {/* Stories Row - B2B Agency Stories & Reels (Consumer view) */}
            <StoriesRow
              stories={stories}
              followedCompanyIds={user.followedCompanyIds || []}
              onToggleFollowCompany={handleToggleFollowCompany}
              onSelectTour={(tourId) => {
                const pkg = packages.find((p) => p.id === tourId);
                if (pkg) setSelectedPackage(pkg);
              }}
              onOpenCompanyProfile={(companyId) => setSelectedCompanyId(companyId)}
            />

            {/* Section Title - Matches screenshot: "🔥 Chegirmadagi turlar" */}
            <div className="px-4 pt-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-rose-500">🔥</span> Chegirmadagi turlar
                </h2>
                <button
                  onClick={() => setCurrentTab('market')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Barchasi ({packages.length})
                </button>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: 'all' as const, label: 'Hammasi' },
                  { id: 'discount' as const, label: 'Chegirmalar' },
                  { id: 'ziyorat' as const, label: 'Ziyorat' },
                  { id: 'beach' as const, label: 'Plyaj' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setExploreFilter(chip.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                      exploreFilter === chip.id
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* 2-Column Grid (Matches screenshot) */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                {explorePackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isWishlisted={user.savedPackageIds.includes(pkg.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelect={setSelectedPackage}
                    onQuickBook={handleQuickBook}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARKET (UZUM MARKET STYLE 24, 12, 6, 3 oy 0% Halol Nasiya) */}
        {currentTab === 'market' && (
          <MarketView
            packages={packages}
            wishlistIds={user.savedPackageIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectPackage={setSelectedPackage}
            onQuickBook={handleQuickBook}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {/* TAB 3: TAVSIYA (RECOMMEND FEED & SMART ALGORITHM) */}
        {currentTab === 'recommend' && (
          <RecommendView
            posts={recommendations}
            onAddPost={handleAddRecommendation}
            onLikePost={handleLikePost}
            onDislikePost={handleDislikePost}
            onReportPost={handleReportPost}
          />
        )}

        {/* TAB 4: O'YINLAR (GAMES & COINS) */}
        {currentTab === 'games' && (
          <GamesView
            coins={user.coins}
            dailyClaimed={user.dailyLoginClaimedToday}
            onRewardCoins={handleRewardCoins}
            onClaimDaily={handleClaimDaily}
          />
        )}

        {/* TAB 5: PROFIL (JAMG'ARMA, KARTALAR, XOTIRALAR, SERTIFIKATLAR & TUR FIRMA KABINETI) */}
        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            packages={packages}
            companies={companies}
            bookings={bookings}
            stories={stories}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenDemoInfo={() => setIsDemoInfoOpen(true)}
            onOpenAgencyCabinet={() => setIsAgencyCabinetOpen(true)}
            onSelectPackage={setSelectedPackage}
            onSelectVipTours={() => setCurrentTab('market')}
            onViewCertificate={(order) => setSelectedCertificateOrder(order)}
            onOpenCompanyProfile={(companyId) => setSelectedCompanyId(companyId)}
            onAddCard={handleAddBankCard}
            onAddMedia={handleAddSavedMedia}
            onUpdateSavingsGoal={handleUpdateSavingsGoal}
          />
        )}
      </main>

      {/* TabBar (Fixed at bottom, 5 items) */}
      <TabBar currentTab={currentTab} onSelectTab={setCurrentTab} theme={theme} />

      {/* MODALS */}
      {/* 1. Hamburger Drawer */}
      <HamburgerDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenDemoInfo={() => setIsDemoInfoOpen(true)}
        onSelectVipTours={() => setCurrentTab('market')}
        onOpenAgencyCabinet={() => setIsAgencyCabinetOpen(true)}
      />

      {/* 2. DEMO Badge Modal */}
      <DemoBadgeModal
        isOpen={isDemoInfoOpen}
        onClose={() => setIsDemoInfoOpen(false)}
      />

      {/* 3. Coin Balance Modal */}
      <CoinBalanceModal
        isOpen={isCoinsModalOpen}
        coins={user.coins}
        transactions={coinTransactions}
        onClose={() => setIsCoinsModalOpen(false)}
        onGoToGames={() => setCurrentTab('games')}
      />

      {/* 4. Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          packages={packages}
          onClose={() => setIsSearchOpen(false)}
          onSelectPackage={setSelectedPackage}
        />
      )}

      {/* 5. Package Detail Modal */}
      {selectedPackage && (
        <PackageDetailModal
          pkg={selectedPackage}
          userCoins={user.coins}
          comments={comments}
          isWishlisted={user.savedPackageIds.includes(selectedPackage.id)}
          onToggleWishlist={handleToggleWishlist}
          onClose={() => setSelectedPackage(null)}
          onProceedToCheckout={handleOpenCheckout}
          onAddComment={handleAddComment}
        />
      )}

      {/* 6. Checkout Modal (4-steps with QR Certificate) */}
      {checkoutPackage && (
        <CheckoutModal
          pkg={checkoutPackage}
          initialPaymentType={checkoutPaymentType}
          initialMonths={checkoutMonths}
          initialCoins={checkoutCoinsApplied}
          userCoins={user.coins}
          onClose={() => setCheckoutPackage(null)}
          onBookingSuccess={handleBookingSuccess}
          onViewCertificate={(order) => setSelectedCertificateOrder(order)}
        />
      )}

      {/* 7. Travel Certificate Modal (QR code & offline verification) */}
      {selectedCertificateOrder && (
        <TravelCertificateModal
          order={selectedCertificateOrder}
          pkg={packages.find((p) => p.id === selectedCertificateOrder.packageId)}
          onClose={() => setSelectedCertificateOrder(null)}
        />
      )}

      {/* 8. Company Profile Modal (Follow, Stories, Tours) */}
      {activeCompany && (
        <CompanyProfileModal
          company={activeCompany}
          isFollowed={(user.followedCompanyIds || []).includes(activeCompany.id)}
          packages={packages}
          stories={stories}
          onToggleFollow={handleToggleFollowCompany}
          onSelectPackage={(pkg) => {
            setSelectedCompanyId(null);
            setSelectedPackage(pkg);
          }}
          onOpenStory={(st) => {
            setSelectedCompanyId(null);
          }}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}

      {/* 9. Agency Register & Stories/Reels Upload Modal */}
      {isAgencyCabinetOpen && (
        <AgencyRegisterModal
          companies={companies}
          packages={packages}
          onRegisterCompany={handleRegisterCompany}
          onAddStory={handleAddAgencyStory}
          onClose={() => setIsAgencyCabinetOpen(false)}
        />
      )}

      {/* 10. Full 11-Section Admin Panel */}
      {isAdminOpen && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          packages={packages}
          companies={companies}
          bookings={bookings}
          onAddPackage={handleAddPackage}
          onUpdatePackage={handleUpdatePackage}
          onDeletePackage={handleDeletePackage}
        />
      )}
    </div>
  );
}
