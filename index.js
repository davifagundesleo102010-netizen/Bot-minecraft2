import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import pvp from "mineflayer-pvp";
import armorManager from "mineflayer-armor-manager";
import express from "express";
import OpenAI from "openai";
import dns from "dns";

// ===============================
// 🔧 CONFIGURAÇÕES
// ===============================
const HOST = "osbrenrotados.aternos.me"; // IP do servidor
const PORT = 30805;                      // Porta do servidor
const USERNAME = "BotIA";                // Nome do bot
const VERSION = false;                   // false = detecta versão automática

const CHECK_INTERVAL = 60000; // tempo entre tentativas (1 min)

// ===============================
// 🌐 Servidor Express (mantém Render acordado)
// ===============================
const app = express();
const PORT_WEB = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("🤖 Bot IA online e monitorando o servidor Minecraft!"));
app.listen(PORT_WEB, () => console.log(`🌍 Servidor web rodando na porta ${PORT_WEB}`));

// ===============================
// 🧠 OpenAI
// ===============================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===============================
// 🤖 Função principal do bot
// ===============================
function createBot() {
  console.log("🚀 Iniciando o bot...");

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp.plugin);
  bot.loadPlugin(armorManager);

  bot.once("spawn", () => {
    console.log("✅ Bot entrou no servidor com sucesso!");
  });

  bot.on("end", () => {
    console.log("❌ Bot desconectado. Tentando reconectar em 1 minuto...");
    setTimeout(checkServerAndReconnect, CHECK_INTERVAL);
  });

  bot.on("error", err => {
    console.error("⚠️ Erro no bot:", err.message);
  });

  // 💬 Respostas automáticas com IA
  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;

    console.log(`[${username}] ${message}`);

    try {
      const resposta = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente simpático dentro do Minecraft." },
          { role: "user", content: message }
        ]
      });

      const reply = resposta.choices[0].message.content;
      bot.chat(reply);
      console.log(`🤖 → ${reply}`);
    } catch (err) {
      console.error("❌ Erro ao gerar resposta:", err.message);
      bot.chat("Tive um erro ao pensar 😅");
    }
  });
}

// ===============================
// 🔁 Verifica se o servidor está online antes de reconectar
// ===============================
function checkServerAndReconnect() {
  dns.lookup(HOST, (err) => {
    if (err) {
      console.log("🕒 Servidor ainda offline. Tentando novamente em 1 minuto...");
      setTimeout(checkServerAndReconnect, CHECK_INTERVAL);
    } else {
      console.log("🟢 Servidor online detectado! Reconectando o bot...");
      createBot();
    }
  });
}

// Inicializa o bot pela primeira vez
checkServerAndReconnect();
