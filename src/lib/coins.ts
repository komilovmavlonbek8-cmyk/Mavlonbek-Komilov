// Coin tizimi (Guzasht Coins)

export const COIN_VALUE_UZS = 100; // 1 Coin = 100 so'm
export const MAX_DISCOUNT_PERCENT = 0.20; // 20% gacha chegirma

export function coinsToDiscount(coins: number, packagePrice: number) {
  const requestedDiscount = coins * COIN_VALUE_UZS;
  const maxAllowedDiscount = Math.round(packagePrice * MAX_DISCOUNT_PERCENT);
  const effectiveDiscount = Math.min(requestedDiscount, maxAllowedDiscount);
  const usedCoins = Math.ceil(effectiveDiscount / COIN_VALUE_UZS);

  return {
    effectiveDiscount,
    usedCoins,
    maxCoinsApplicable: Math.floor(maxAllowedDiscount / COIN_VALUE_UZS),
    maxAllowedDiscount,
  };
}

export function getUserLevel(coins: number): { name: string; badge: string; min: number; max: number } {
  if (coins >= 25000) return { name: "Guzasht Qiroli", badge: "👑", min: 25000, max: 100000 };
  if (coins >= 10000) return { name: "VIP Sayohatchi", badge: "💎", min: 10000, max: 24999 };
  if (coins >= 5000) return { name: "Olmos Sayohatchi", badge: "🥇", min: 5000, max: 9999 };
  if (coins >= 1000) return { name: "Oltin Sayohatchi", badge: "🥈", min: 1000, max: 4999 };
  return { name: "Kumush Sayohatchi", badge: "🥉", min: 0, max: 999 };
}
