import mineflayer from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import pvp from "mineflayer-pvp";
import armorManager from "mineflayer-armor-manager";
import express from "express";
import OpenAI from "openai";
import dns from "dns";

// ===============================
// ⚙️ CONFIGURAÇÕES
// ===============================
const HOST = "osbrenrotados.aternos.me"; // IP do servidor
const PORT = 30805; // Porta do servidor
const USERNAME = "BotIA"; // Nome do bot
const VERSION = false; // Detecta automaticamente
const RETRY_DELAY = 60_000; // 1 minuto entre tentativas

// ===============================
// 🌍 Servidor web para o Render
// ===============================
const app = express();
const PORT_WEB = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("🤖 Bot IA está ativo e monitorando o servidor!"));
app.listen(PORT_WEB, () => console.log(`🌐 Servidor web ativo na porta ${PORT_WEB}`));

// ===============================
// 🧠 OpenAI (IA do bot)
// ===============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===============================
// 🔁 Função de reconexão segura
// ===============================
function startBot() {
  console.log("🚀 Tentando conectar o bot...");

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp.plugin);
  bot.loadPlugin(armorManager);

  bot.once("spawn", () => {
    console.log("✅ Bot entrou no servidor com sucesso!");
  });

  bot.on("end", () => {
    console.log("❌ Bot desconectado! Tentando reconectar...");
    setTimeout(checkServerAndReconnect, RETRY_DELAY);
  });

  bot.on("kicked", (reason) => {
    console.log("⚠️ Bot foi kickado:", reason);
    setTimeout(checkServerAndReconnect, RETRY_DELAY);
  });

  bot.on("error", (err) => {
    console.error("❌ Erro no bot:", err.message);
    setTimeout(checkServerAndReconnect, RETRY_DELAY);
  });

  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;

    console.log(`[${username}] ${message}`);

    try {
      const resposta = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um bot simpático dentro do Minecraft, que responde mensagens no chat." },
          { role: "user", content: message },
        ],
      });

      const reply = resposta.choices[0].message.content;
      bot.chat(reply);
      console.log(`🤖 → ${reply}`);
    } catch (err) {
      console.error("Erro ao responder com IA:", err.message);
      bot.chat("Desculpe, tive um erro ao pensar 😅");
    }
  });
}

// ===============================
// 🕹️ Checa servidor antes de conectar
// ===============================
function checkServerAndReconnect() {
  dns.lookup(HOST, (err) => {
    if (err) {
      console.log("🕒 Servidor Aternos ainda offline, tentando novamente em 1 minuto...");
      setTimeout(checkServerAndReconnect, RETRY_DELAY);
    } else {
      console.log("🟢 Servidor online detectado! Iniciando bot...");
      startBot();
    }
  });
}

// Inicia o ciclo
checkServerAndReconnect();
