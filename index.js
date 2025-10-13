const mineflayer = require('mineflayer');
const express = require('express');

// Servidor web básico para o Render manter o bot ativo
const app = express();
app.get('/', (req, res) => res.send('Bot Minecraft está online!'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor web ativo.'));

const bot = mineflayer.createBot({
  host: 'observetados.aternos.me', // 🧠 Coloque o IP do seu servidor Aternos
  port: 30805,                     // 🔢 Se tiver porta, coloque aqui. Se não, apague essa linha.
  username: 'BotMinecraft',        // 🤖 Nome do bot (sem senha)
  version: '1.21'                  // ✅ Força o uso da versão compatível
});

// Mensagens no console
bot.on('login', () => console.log('✅ Bot conectado ao servidor Minecraft!'));
bot.on('spawn', () => console.log('🟢 Bot spawnou no mundo!'));
bot.on('error', err => console.log('❌ Erro no bot:', err));
bot.on('end', () => console.log('🔴 Bot desconectado do servidor.'));
