const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Cria o servidor web (Render exige isso)
app.get('/', (req, res) => {
  res.send('Bot Minecraft está rodando!');
});
app.listen(port, () => {
  console.log(`Servidor web online na porta ${port}`);
});

// Função para criar o bot
function criarBot() {
  const bot = mineflayer.createBot({
    host: 'observetados.aternos.me', // 🔹 troque pelo IP do seu servidor
    port: 30805,                     // 🔹 troque pela porta correta do Aternos
    username: 'taligado',        // nome do bot
    version: '1.21.1',               // força versão compatível
  });

  // Loga quando entrar
  bot.on('login', () => {
    console.log('🤖 Bot entrou no servidor com sucesso!');
  });

  // Mostra mensagens do chat no console
  bot.on('chat', (username, message) => {
    console.log(`[${username}]: ${message}`);
  });

  // Caso desconecte, tenta reconectar sozinho
  bot.on('end', () => {
    console.log('⛔ Bot foi desconectado. Tentando reconectar em 10s...');
    setTimeout(criarBot, 10000);
  });

  // Mostra erros no console (evita crash)
  bot.on('error', (err) => {
    console.log('⚠️ Erro no bot:', err.message);
  });
}

criarBot();
