# Guzasht Travel — Telegram Web App & Mobil Turizm Marketplace (Demo / MVP)

> **Slogan:** *"Har bir sayohat — yangi hikoya"*  
> **Loyiha maqsadi:** Davlat subsidiyasi va Turizm qo'mitasi hamda investorlarga taqdim etish uchun ishlab chiqilgan prototip (MVP).

---

## 🚀 Kod Bilan To'liq Amalga Oshirilgan Funksiyalar

1. **Telegram Web App va Mobil Moslashuvchanlik:**
   - `@telegram-web-app` integratsiyasi, haptic feedback (tebranish), viewport kengaytirish, xavfsiz maydonlar (safe-area).
   - Foydalanuvchi yuklagan skrinshot dizayni bilan 100% bir xil zamonaviy dark-tema, to'rtburchak rounded stories va 2 ustunli market kartochkalari.

2. **TopBar va Navigatsiya:**
   - Gamburger menyusi (2233 ishonch raqami, til tanlash, ijtimoiy missiya, admin panel).
   - "Guzasht" logotipi va sanasiz `DEMO ⓘ` badge (investorlar uchun rasmiy tushuntirish bilan).
   - `🪙 1250` Coin balansi va daraja ko'rsatkichi (🥉 Kumush, 🥈 Oltin, 🥇 Olmos, 💎 VIP, 👑 Guzasht Qiroli).
   - 5 darajali tezkor qidiruv (Lotin / Kirill transliteratsiyasi bilan).

3. **Stories Tizimi (Aspect 3:4, radius 16px):**
   - `+ Siz` orqali yangi hikoya joylash (+100 coin beradi).
   - Aziz, Malika, Bekzod, Nilufar va boshqalarning sayohat videolari / rasmlari.
   - 5 soniyalik avtomatik progress bar va javob yozish imkoniyati.

4. **Bozor va Bo'lib To'lash (Market & 24 Oylik Narx):**
   - Kartochkalarda **FAQAT 24 oylik** foizsiz summa ko'rsatiladi (masalan: `291,667 so'm/oy — 24 oyga bo'lib to'lash`).
   - Tur paketining batafsil oynasida `3 oy`, `6 oy`, `12 oy` va `24 oy` kalkulyatori.
   - Coin orqali 20% gacha real-time chegirma slayderi (`1 Coin = 100 so'm`).
   - Bekor qilish va qaytarish siyosati akkordeoni (100%, 70%, 50%, 0%).

5. **4-Bosqichli Checkout (Bron qilish):**
   - 1-qadam: Anketa (Ism, telefon, maxsus ehtiyojlar).
   - 2-qadam: To'lov turi (0% foizsiz bo'lib to'lash yoki bir yo'la to'lov, Coin slayderi, bekor qilish shartlariga rozilik).
   - 3-qadam: Buyurtmani tasdiqlash va chek tekshiruvi.
   - 4-qadam: Muvaffaqiyat (Confetti animatsiyasi, buyurtma kodi va dispetcher bilan jonli chat).

6. **Tavsiya & Ijtimoiy Feed (Recommend):**
   - "✍️ Sayohat hikoyangizni ulashing!" tugmasi (+100 coin).
   - Like, Dislike, Comment, Shikoyat qilish va nojo'ya so'zlardan 3-bosqichli himoya.

7. **O'yinlar va Coin Yig'ish (Games):**
   - Kunlik kirish bonusi (+50 coin).
   - Omad charxpalagi / Fortune Wheel (+50 dan +500 coin).
   - "Guess the City" — fotosurat orqali shaharni topish viktorinasi (+30 coin).

8. **To'liq Admin Panel (11 ta bo'lim):**
   - `/admin` (Dashboard tahlili, Turlar CRUD — qo'shish/tahrirlash/o'chirish Marketda darhol aks etadi, Tur firmalar ro'yxati, Stories moderatsiyasi, Sharhlar, Shikoyatlar, Foydalanuvchilar, Buyurtmalar nazorati, Bank hamkorligi statusi, Push xabarnomalar, Sozlamalar).

---

## 🎯 Loyihaning Asosiy Ijtimoiy Missiyasi (Subsidiya Asosi)

> **Guzasht** — shunchaki turizm marketplace emas, balki **KEKSA INSONLAR** va **GADJET BILMAYDIGANLAR** uchun xizmat ko'rsatadigan **INKLUSIV** platformadir.

1. **📞 2233 — Qisqa Ishonch Raqami:**
   - Smartfon ishlatishga qiynaladigan ota-onalarimiz va keksalarimiz onlayn buyurtma bera olmasalar, `2233` raqamiga bepul qo'ng'iroq qilib, operator yordamida sayohatni to'liq rasmiylashtirishadi.
   - O'zbek va rus tillarida professional call-markaz xizmati.

2. **👵 VIP Tur Paketlar (Hamshira Hamrohligi):**
   - Keksalar, qandli diabet yoki qon bosimi bilan og'riydigan, nogironligi bo'lgan sayohatchilar uchun maxsus moslashtirilgan turlar.
   - Butun safar davomida malakali tibbiy hamshira va shifokor doimiy hamroh bo'ladi, qulay zinapoyasiz marshrutlar va parhez taomnoma taqdim etiladi.

3. **🏦 Bank Hamkorligi (0% Foizsiz Bo'lib To'lash):**
   - Aholining kam ta'minlangan qatlamlari yoki pensionerlar bir yo'la 7,000,000 so'm to'lay olmasligi mumkin, biroq oyiga 291,667 so'mdan bo'lib to'lashga qodir.
   - Uzum Bank (Uzum Nasiya) va Alif Bank bilan integratsiya rejalashtirilgan.

---

## 🏛️ Davlat Subsidiyasi va Operatsion Reja (Keyingi Bosqich)

- [ ] **Yuridik maqom:** YaTT / MCHJ ro'yxatidan o'tkazish.
- [ ] **Server:** O'zbekiston Respublikasining "Shaxsga doir ma'lumotlar to'g'risida"gi qonuniga (ZRU-547) muvofiq UzCloud serverlarida joylashtirish.
- [ ] **Domen:** Rasmiy `guzasht.uz` domenini UZINFOCOM orqali ulash.
- [ ] **B2B Shartnomalar:** Asialuxe, Alif Travel, Silk Road Travel va boshqa 20+ turoperatorlar bilan to'g'ridan-to'g'ri agentlik shartnomalari.
- [ ] **Tibbiy sug'urta:** Uzbekinvest, Alfa Sug'urta bilan hamkorlikda xavfsizlik kafolati.
- [ ] **Mobil ilova:** React Native asosida App Store va Google Play versiyasiga chiqarish.
