
// index.js
const mineflayer = require('mineflayer');
const express = require('express');

const HOST = process.env.MC_HOST || 'osbrenrotados.aternos.me';
const PORT = parseInt(process.env.MC_PORT || '30805', 10); // porta correta
const USERNAME = process.env.MC_USERNAME || 'BotMinecraft';
const AUTH = process.env.MC_AUTH || 'offline'; // 'offline' para cracked, 'microsoft' para premium
const VERSION = process.env.MC_VERSION || '1.21.10';

let bot = null;
let connecting = false;

function createBot() {
  if (connecting) return;
  connecting = true;

  console.log(`🔌 Tentando conectar: ${HOST}:${PORT} como ${USERNAME} (auth=${AUTH})`);
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: AUTH,
    version: VERSION
  });

  bot.on('login', () => {
    connecting = false;
    console.log('✅ Bot entrou no servidor com sucesso!');
  });

  bot.on('spawn', () => {
    console.log('🟢 Bot spawnou no mundo.');
  });

  bot.on('error', (err) => {
    console.log('❌ Erro do bot:', err && err.message ? err.message : err);
  });

  bot.on('end', () => {
    console.log('⛔ Bot desconectado. Tentando reconectar em 10s...');
    connecting = false;
    setTimeout(createBot, 10000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === 'ping') {
      bot.chat('pong');
    }
  });
}

createBot();

const app = express();
app.get('/', (req, res) => res.send('bot online'));
const WEB_PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(WEB_PORT, () => {
  console.log(`🌐 Web server rodando na porta ${WEB_PORT}`);
});
