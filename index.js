import mineflayer from 'mineflayer';
import http from 'http';

// Cria um pequeno servidor HTTP só pra manter o Render ativo
http.createServer((req, res) => res.end('Bot rodando no Render!')).listen(process.env.PORT || 3000);

// Função que cria o bot e tenta reconectar automaticamente
function startBot() {
  const bot = mineflayer.createBot({
    host: 'osbrenrotados.aternos.me', // IP do Aternos
    port: 30805,                      // Porta do Aternos
    username: 'BotMinecraft2',        // Nome do bot
    version: '1.21.1'                 // Compatível com Spigot 1.21.10
  });

  bot.once('spawn', () => {
    console.log('✅ Bot entrou no servidor!');
  });

  bot.on('end', () => {
    console.log('⚠️ Bot foi desconectado. Tentando reconectar em 10s...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ Erro no bot:', err.message);
  });
}

startBot();
