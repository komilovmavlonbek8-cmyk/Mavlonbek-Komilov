// Bo'lib to'lash (Installment) kalkulyatori - 0% foizsiz muddatli to'lov

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + " so'm";
}

export function calculateMonthly(price: number, months: 3 | 6 | 12 | 24): number {
  if (!months || months <= 0) return price;
  return Math.round(price / months);
}

export function getInstallmentSchedule(price: number, months: 3 | 6 | 12 | 24) {
  const monthly = calculateMonthly(price, months);
  return {
    months,
    monthlyAmount: monthly,
    formattedMonthly: formatCurrency(monthly) + '/oy',
    totalAmount: price,
    formattedTotal: formatCurrency(price),
    note: "Foizsiz, bank hamkorligi doirasida (demo)",
  };
}
