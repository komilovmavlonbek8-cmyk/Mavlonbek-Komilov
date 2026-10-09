import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI();

// AI Travel Assistant System Instruction
const AI_TRAVEL_SYSTEM_INSTRUCTION = `Siz "Guzasht" platformasining rasmiy va juda samimiy AI Sayohat Maslahatchisisiz (AI Travel Assistant). 
"Guzasht" — O‘zbekistondagi 740+ rasmiy turoperatorlar, gidlar va mehmonxonalarni birlashtiruvchi yetakchi B2B2C TravelTech marketplace platformasi.

Sizning asosiy vazifalaringiz va bilimlar bazangiz:
1. Sayohatlar bo‘yicha maslahat:
   - Ichki turizm: Samarqand (Registon, Go‘ri Amir), Buxoro (Labi Hovuz, Ark), Xiva (Ichan Qal’a), Zomin tog‘lari, Shohimardon, Chimyon va Amirsoy, Mo‘ynoq va Orol dengizi.
   - Tashqi turizm: Turkiya (Istanbul, Antaliya), Birlashgan Arab Amirliklari (Dubay, Abu-Dabi), Misr (Sharm ash-Shayx), Umra va Haj ziyoratlari, Gruziya, Malayziya.
2. "Guzasht" xizmatlarining noyob afzalliklari:
   - 0% Halol Nasiya (BNPL): Sayohatchilar istalgan turni 3, 6, 12 yoki 24 oyga hech qanday foizsiz, yashirin ustamalarsiz bo‘lib to‘lashi mumkin.
   - 2233 Call-markazi: Keksalar, nuroniylar yoki smartfondan qiynaladigan fuqarolar uchun yagona 2233 qisqa raqami ishlab turibdi. Operatorlar telefon orqali to‘liq maslahat beradi va buyurtmani rasmiylashtiradi.
   - Stories & Reels: Turoperatorlarning jonli video lavhalari ilova ichida mavjud.
   - Coinlar & O‘yinlar: Har kuni kirish (Daily Streak) va viktorinalar orqali tanga (Coin) yig‘ib, ularni tur xaridida haqiqiy chegirmaga almashtirish mumkin.
   - Elektron sertifikat: Har bir xariddan so‘ng noyob himoyalangan vaucher va QR-kodli sertifikat beriladi.
3. Bron qilish tartibi:
   - Turlar ro‘yxatidan yoqqanini tanlash;
   - "Bo‘lib to‘lash" (3-24 oy) yoki "Bir yo‘la to‘lash"ni belgilash;
   - Ism va telefon raqamini kiritib tasdiqlash;
   - Operator yoki turoperator darhol qo‘ng‘iroq qilib, sayohatni muvofiqlashtiradi.

Javob berish uslubingiz:
- Xushmuomala, do‘stona, aniq va lo‘nda o‘zbek tilida so‘zlang.
- Chiroyli emojilardan o‘rinli foydalaning.
- Foydalanuvchiga to‘g‘ri qaror qabul qilishda amaliy maslahatlar bering.`;

// Intelligent fallback helper if Gemini API experiences network interruption
function getFallbackTravelAdvice(message: string): string {
  const q = message.toLowerCase();
  if (q.includes("nasiya") || q.includes("bo'lib") || q.includes("bolib") || q.includes("to'lash") || q.includes("kredit") || q.includes("foiz")) {
    return "💡 **0% Halol Nasiya tartibi:**\n\n«Guzasht» platformasida barcha turlarni **3, 6, 12 va 24 oyga** hech qanday foizsiz (0% ustama) bo‘lib to‘lashga olishingiz mumkin!\n\n1. O‘zingizga yoqqan turni tanlang;\n2. «Bo‘lib to‘lash» tugmasini bosing va oylar sonini tanlang;\n3. Ma’lumotlaringizni kiritib tasdiqlang — ortiqcha hujjatlarsiz tez rasmiylashtiriladi!";
  }
  if (q.includes("2233") || q.includes("telefon") || q.includes("qo'ng'iroq") || q.includes("operator") || q.includes("keksa") || q.includes("ota-ona")) {
    return "📞 **2233 Yagona Call-markazi:**\n\nKeksa avlod vakillari yoki ilovadan foydalanishga qiynaladigan fuqarolarimiz uchun maxsus **2233** qisqa raqami ishlamoqda. Qo‘ng‘iroq qilishingiz bilan malakali operatorlarimiz barcha savollarga javob beradi va turga buyurtma qilib beradi!";
  }
  if (q.includes("samarqand") || q.includes("buxoro") || q.includes("xiva")) {
    return "🏛️ **Tarixiy shaharlarimiz turlari:**\n\nSamarqand (Registon, Shohi Zinda), Buxoro (Labi Hovuz, Ark) va Xiva (Ichan Qal’a) bo‘yicha 2-4 kunlik qulay guruhli va oilaviy turlarimiz mavjud. Turlar ichiga tezyurar Afrosiyob poyezdi, mehmonxona, gid va ekskursiyalar kiradi. Narxlar 1.2 mln so‘mdan boshlanadi va 0% nasiyaga olish mumkin!";
  }
  if (q.includes("dubay") || q.includes("antaliya") || q.includes("turkiya") || q.includes("misr") || q.includes("sharm")) {
    return "✈️ **Xorijiy ommabop sayohatlar:**\n\nDubay, Antaliya va Sharm ash-Shayx bo‘yicha to‘g‘ridan-to‘g‘ri aviaparvozli paketlar mavjud. 7-10 kunlik to‘liq paketlar (aviabilet, 4-5★ mehmonxona, all-inclusive ovqatlanish va sug‘urta) o‘z ichiga oladi. Oylik to‘lov esa 1.5 - 2 mln so‘mdan to‘g‘ri keladi!";
  }
  if (q.includes("coin") || q.includes("tanga") || q.includes("o'yin") || q.includes("chegirma")) {
    return "🪙 **Coinlar va Chegirmalar tizimi:**\n\nHar kuni «O‘yinlar» bo‘limiga kirib daily streak bonusini oling va sayohat viktorinalarida qatnashing! Yig‘ilgan har 1 000 coin tur xaridida 100 000 so‘mgacha real chegirma beradi!";
  }
  return "Assalomu alaykum! Men «Guzasht» AI Sayohat Maslahatchisiman 🚀.\n\nSizga O‘zbekiston bo‘ylab (Samarqand, Buxoro, Zomin) yoki xorijiy (Dubay, Antaliya, Umra) sayohatlarni tanlashda, 0% Halol Nasiyaga rasmiylashtirishda yoki 2233 xizmatidan foydalanishda jon deb yordam beraman! Qanday savolingiz bor?";
}

// Telegram Bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
// Use Vercel public URL for Web App button so Telegram users don't hit Cloud Run auth walls
const PUBLIC_WEBAPP_URL = "https://guzasht.vercel.app";
const APP_URL = process.env.APP_URL || PUBLIC_WEBAPP_URL;

// Helper: send request to Telegram Bot API
async function callTelegramApi(method: string, body: Record<string, any>) {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API error on ${method}:`, err);
    return null;
  }
}

// Send welcoming /start message with Web App button
async function handleStartCommand(chatId: number | string, firstName?: string) {
  const greetingName = firstName ? ` ${firstName}` : "";

  const messageText = `👋 <b>Assalomu alaykum${greetingName}!</b>\n\n` +
    `🚀 <b>Guzasht — O‘zbekistondagi B2B2C TravelTech marketplace platformasiga xush kelibsiz!</b>\n\n` +
    `Bu yerda siz 740+ rasmiy turoperatorlarning eng yaxshi sayohatlarini to‘g‘ridan-to‘g‘ri Telegram ichida ko‘rishingiz va bron qilishingiz mumkin.\n\n` +
    `✨ <b>Bizning asosiy imkoniyatlar:</b>\n` +
    `• 🏷️ <b>0% Halol Nasiya:</b> Turlarni 3 oydan 24 oygacha ustamasiz bo‘lib to‘lash\n` +
    `• 🎥 <b>Stories & Reels:</b> Tur firmalarning jonli video lavhalari\n` +
    `• 🎁 <b>O‘yinlar & Coinlar:</b> Har kuni bepul coin yig‘ish va chegirmaga almashtirish\n` +
    `• 📞 <b>2233 Call-markaz:</b> Telefon orqali maslahat va buyurtma berish\n\n` +
    `Quyidagi tugmani bosing va platformaga kiring 👇`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🚀 Guzasht ilovasini ochish",
          web_app: { url: PUBLIC_WEBAPP_URL },
        },
      ],
      [
        {
          text: "🌐 Vercel sayti",
          url: PUBLIC_WEBAPP_URL,
        },
        {
          text: "📞 2233 Call-markaz",
          url: "https://t.me/guzasht_support",
        },
      ],
    ],
  };

  return await callTelegramApi("sendMessage", {
    chat_id: chatId,
    text: messageText,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
  });
}

// Configure Telegram Bot permanent Menu Button to open Web App
async function setupBotMenuButton() {
  if (!BOT_TOKEN) return;
  try {
    const res = await callTelegramApi("setChatMenuButton", {
      menu_button: {
        type: "web_app",
        text: "Guzasht 🚀",
        web_app: { url: PUBLIC_WEBAPP_URL },
      },
    });
    console.log("Telegram Bot Menu Button successfully configured for Web App:", res?.ok);
  } catch (err) {
    console.warn("Could not set bot menu button:", err);
  }
}

// ---------------- API ROUTES ----------------

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasBotToken: Boolean(BOT_TOKEN),
    appUrl: APP_URL,
    timestamp: new Date().toISOString(),
  });
});

// Telegram status & test info
app.get("/api/telegram/status", async (_req: Request, res: Response) => {
  if (!BOT_TOKEN) {
    return res.json({
      connected: false,
      message: "TELEGRAM_BOT_TOKEN belgilanmagan. Iltimos, Secrets panelidan tokenni qo'shing.",
    });
  }

  const me = await callTelegramApi("getMe", {});
  const webhookInfo = await callTelegramApi("getWebhookInfo", {});

  res.json({
    connected: Boolean(me?.ok),
    bot: me?.result || null,
    webhook: webhookInfo?.result || null,
    appUrl: APP_URL,
  });
});

// Orders storage in-memory
const ordersDatabase: any[] = [];

// Orders API endpoints
app.get("/api/orders", (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: ordersDatabase.length,
    orders: ordersDatabase,
  });
});

app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ error: "Invalid order data" });
    }
    ordersDatabase.unshift({
      ...order,
      receivedAt: new Date().toISOString(),
    });
    console.log(`New booking order registered: ${order.id} by ${order.customerName}`);
    return res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Error saving order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Gemini AI Travel Assistant endpoint
app.post("/api/ai-assistant", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Xabar matni kiritilmadi" });
    }

    // Build multi-turn contents array for GoogleGenAI
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.text && (item.role === "user" || item.role === "model")) {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: AI_TRAVEL_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackTravelAdvice(message);
    return res.json({ reply });
  } catch (err: any) {
    console.error("AI Assistant request error, using fallback:", err?.message || err);
    const fallbackReply = getFallbackTravelAdvice(req.body?.message || "");
    return res.json({ reply: fallbackReply });
  }
});

// Setup Webhook endpoint
app.post("/api/telegram/setup", async (req: Request, res: Response) => {
  if (!BOT_TOKEN) {
    return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN is missing" });
  }

  const customUrl = req.body?.url || APP_URL;
  const webhookUrl = `${customUrl.replace(/\/$/, "")}/api/telegram/webhook`;

  const webhookRes = await callTelegramApi("setWebhook", {
    url: webhookUrl,
    drop_pending_updates: true,
  });

  await setupBotMenuButton();

  res.json({
    setupSuccess: Boolean(webhookRes?.ok),
    webhookResult: webhookRes,
    webhookUrl,
  });
});

// Telegram Webhook Handler
app.post("/api/telegram/webhook", async (req: Request, res: Response) => {
  try {
    const update = req.body;

    if (update && update.message) {
      const { chat, text, from } = update.message;
      if (chat && chat.id) {
        // If user sends /start or any message
        if (text && (text.startsWith("/start") || text.toLowerCase() === "start")) {
          await handleStartCommand(chat.id, from?.first_name || from?.username);
        } else {
          // Reply with quick reminder & web app button
          await handleStartCommand(chat.id, from?.first_name);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing telegram webhook:", error);
    res.status(200).send("OK"); // Acknowledge to avoid Telegram retries
  }
});

// Optional: Background long-polling for local dev when Webhook is not configured
let isPolling = false;
let lastUpdateId = 0;

async function startLongPolling() {
  if (!BOT_TOKEN || isPolling) return;
  isPolling = true;
  console.log("Clearing conflicting webhook and starting Telegram Bot listener...");

  // Delete any active webhook so Telegram allows getUpdates
  await callTelegramApi("deleteWebhook", { drop_pending_updates: false });

  // Setup permanent Menu Button (Guzasht 🚀)
  await setupBotMenuButton();

  while (isPolling) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`
      );
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }
      const data = await res.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;
          if (update.message?.chat?.id) {
            console.log(`Telegram Bot received command from chatId ${update.message.chat.id}: ${update.message.text}`);
            await handleStartCommand(
              update.message.chat.id,
              update.message.from?.first_name
            );
          }
        }
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

// ---------------- VITE MIDDLEWARE & STATIC SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Guzasht Full-Stack Server running on port ${PORT}`);
    if (BOT_TOKEN) {
      console.log("TELEGRAM_BOT_TOKEN detected. Starting active bot polling...");
      startLongPolling();
    } else {
      console.log("TELEGRAM_BOT_TOKEN not provided yet. Bot is in standby mode.");
    }
  });
}

startServer();
