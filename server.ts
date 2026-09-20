import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Telegram Bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const APP_URL = process.env.APP_URL || "https://guzasht.vercel.app";

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
  const webAppUrl = APP_URL.startsWith("http") ? APP_URL : `https://${APP_URL}`;

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
          web_app: { url: webAppUrl },
        },
      ],
      [
        {
          text: "🌐 Vercel sayti",
          url: "https://guzasht.vercel.app",
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
  const webAppUrl = APP_URL.startsWith("http") ? APP_URL : `https://${APP_URL}`;
  try {
    await callTelegramApi("setChatMenuButton", {
      menu_button: {
        type: "web_app",
        text: "Guzasht 🚀",
        web_app: { url: webAppUrl },
      },
    });
    console.log("Telegram Bot Menu Button successfully configured for Web App.");
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
  console.log("Starting Telegram Bot long-polling fallback...");

  // Setup Menu Button
  await setupBotMenuButton();

  while (isPolling) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`
      );
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      const data = await res.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;
          if (update.message?.chat?.id) {
            await handleStartCommand(
              update.message.chat.id,
              update.message.from?.first_name
            );
          }
        }
      }
    } catch (e) {
      // pause on network error
      await new Promise((r) => setTimeout(r, 5000));
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
      console.log("TELEGRAM_BOT_TOKEN detected. Configuring bot...");
      // Auto-start polling if no external domain, or setup webhook
      if (APP_URL && APP_URL.includes("run.app")) {
        const webhookUrl = `${APP_URL.replace(/\/$/, "")}/api/telegram/webhook`;
        callTelegramApi("setWebhook", { url: webhookUrl }).then(() => {
          console.log(`Telegram webhook set to: ${webhookUrl}`);
          setupBotMenuButton();
        });
      } else {
        startLongPolling();
      }
    } else {
      console.log("TELEGRAM_BOT_TOKEN not provided yet. Bot is in standby mode.");
    }
  });
}

startServer();
