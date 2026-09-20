export type TabType = 'explore' | 'market' | 'recommend' | 'games' | 'profile';

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  durationDays: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  price: number; // e.g. 7000000 (so'm)
  originalPrice: number; // e.g. 8400000 (so'm)
  discountPercent: number; // e.g. 17%
  images: string[];
  tags: string[];
  route: string;
  isVipElderly?: boolean; // Inklusiv / Keksalar va hamshira hamrohligi
  description: string;
  included: string[];
  notIncluded?: string[];
  departureDates: string[];
  cancellationPolicy: {
    days30Plus: number;
    days15To30: number;
    days7To15: number;
    daysUnder7: number;
  };
}

export interface TourCompany {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  phone: string;
  rating: number;
  toursCount: number;
  description: string;
  followersCount: number;
  isFollowed?: boolean;
  reelsCount?: number;
  city?: string;
  licenseNumber?: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  videoUrl?: string;
  caption?: string;
  location?: string;
  viewsCount: number;
  hasUnseen?: boolean;
  isCompany?: boolean;
  companyId?: string;
  tourId?: string;
  type?: 'story' | 'reels';
}

export interface RecommendationPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  title: string;
  text: string;
  images: string[];
  location?: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  status: 'published' | 'pending' | 'rejected';
  helpfulTips?: string[];
  verifiedTraveler?: boolean;
}

export interface CommentItem {
  id: string;
  packageId?: string;
  postId?: string;
  userName: string;
  userAvatar: string;
  rating?: number;
  text: string;
  createdAt: string;
  likes: number;
  isVerifiedBuyer?: boolean;
}

export interface ConnectedBankCard {
  id: string;
  pan: string; // e.g. "8600 •••• •••• 4590"
  cardType: 'Uzcard' | 'Humo' | 'Visa';
  holderName: string;
  expiry: string;
  isDefault: boolean;
}

export interface SavedTravelMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  location: string;
  date: string;
}

export interface TravelSavingsGoal {
  id: string;
  targetPackageTitle: string;
  targetPackageId?: string;
  targetAmount: number; // e.g. 7000000 so'm
  currentAmount: number; // e.g. 3500000 so'm
  monthlyContribution: number; // e.g. 700000 so'm/oy
  startMonth: string; // "Sentyabr"
  targetMonth: string; // "Iyun"
  autoDeduct: boolean; // Har oy kartadan avtomatik yechish
  cardPan?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  coins: number;
  level: string; // 🥉 Kumush | 🥈 Oltin | 💎 Olmos | 👑 Qirol
  levelIcon: string;
  balance: number;
  savedPackageIds: string[];
  dailyLoginClaimedToday: boolean;
  lastSpinDate?: string;
  followedCompanyIds: string[];
  cards: ConnectedBankCard[];
  savedMedia: SavedTravelMedia[];
  savingsGoal?: TravelSavingsGoal;
}

export interface BookingOrder {
  id: string;
  packageId: string;
  packageTitle: string;
  companyName: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  paymentType: 'full' | 'installment';
  installmentMonths: 3 | 6 | 12 | 24;
  monthlyAmount: number;
  totalPrice: number;
  coinsUsed: number;
  coinDiscountAmount: number;
  finalPaidAmount: number;
  status: 'new' | 'confirmed' | 'in_progress' | 'cancelled';
  createdAt: string;
  certificateCode: string; // e.g. "GUZASHT-CERT-2026-9214"
  hasMedicalEscort?: boolean; // Hamshira / Hamrohlik xizmati
  qrPayload?: string;
}

export interface CoinTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'earn' | 'spend';
  date: string;
}
