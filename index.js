import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import pvp from "mineflayer-pvp";
import armorManager from "mineflayer-armor-manager";
import express from "express";
import OpenAI from "openai";
import dns from "dns";

// ===============================
// ⚙️ CONFIGURAÇÕES
// ===============================
const HOST = "osbrenrotados.aternos.me"; // IP do servidor
const PORT = 30805;                      // Porta
const USERNAME = "Lucas_Agent";          // Nome do bot
const VERSION = "1.21.1";                // Define a versão manualmente (evita erro de compatibilidade)
const CHECK_INTERVAL = 180000;           // 3 minutos entre tentativas

// ===============================
// 🌐 Servidor Express (mantém o Render ativo)
// ===============================
const app = express();
const PORT_WEB = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("🤖 Bot IA está online e monitorando o servidor Minecraft!"));
app.listen(PORT_WEB, () => console.log(`🌍 Servidor web rodando na porta ${PORT_WEB}`));

// ===============================
// 🧠 OpenAI (IA de chat)
// ===============================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===============================
// 🚀 Função principal do bot
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

  // Quando o bot entra no servidor
  bot.once("spawn", () => {
    console.log("✅ Bot entrou no servidor com sucesso!");

    // Muda o modo de jogo (caso entre em modo espectador)
    setTimeout(() => {
      bot.chat("/gamemode survival");
    }, 5000);

    // Faz movimentos leves automáticos a cada 20s (anti-ban Aternos)
    setInterval(() => {
      if (!bot.entity || !bot.entity.position) return;
      const x = bot.entity.position.x + (Math.random() - 0.5) * 4;
      const z = bot.entity.position.z + (Math.random() - 0.5) * 4;
      const y = bot.entity.position.y;
      bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
    }, 20000);
  });

  // Respawn automático
  bot.on("death", () => {
    console.log("💀 Bot morreu — tentando respawnar...");
    setTimeout(() => bot.chat("/respawn"), 3000);
  });

  // Se desconectar, tenta voltar
  bot.on("end", () => {
    console.log("❌ Bot desconectado. Tentando reconectar em 3 minutos...");
    setTimeout(checkServerAndReconnect, CHECK_INTERVAL);
  });

  // Tratamento de erros
  bot.on("error", err => {
    console.error("⚠️ Erro no bot:", err.message);
  });

  // Chat com IA
  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;

    console.log(`[${username}] ${message}`);

    try {
      const resposta = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente simpático dentro do Minecraft, ajude e responda como se fosse um jogador humano." },
          { role: "user", content: message }
        ]
      });

      const reply = resposta.choices[0].message.content;
      bot.chat(reply);
      console.log(`🤖 → ${reply}`);
    } catch (err) {
      console.error("❌ Erro ao gerar resposta:", err.message);
      bot.chat("Ops... acho que buguei 😅");
    }
  });
}

// ===============================
// 🔁 Verifica se o servidor está online
// ===============================
function checkServerAndReconnect() {
  dns.lookup(HOST, (err) => {
    if (err) {
      console.log("🕒 Servidor ainda offline. Tentando novamente em 3 minutos...");
      setTimeout(checkServerAndReconnect, CHECK_INTERVAL);
    } else {
      console.log("🟢 Servidor online detectado! Reconectando o bot...");
      createBot();
    }
  });
}

// Inicializa o bot pela primeira vez
checkServerAndReconnect();
