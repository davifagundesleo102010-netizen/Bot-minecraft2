const mineflayer = require('mineflayer');

function iniciarBot() {
  const bot = mineflayer.createBot({
    host: 'osbrenrotados.aternos.me', // IP do seu servidor Aternos
    port: 30805,                      // PORTA correta do servidor
    username: 'BotMinecraft2',        // Nome do bot (pode mudar se quiser)
    auth: 'offline',                  // Modo pirata (já que o servidor está como "Pirata: ativado")
    version: '1.21.1'                 // Versão mais compatível com 1.21.10
  });

  bot.on('login', () => console.log('✅ Bot entrou no servidor com sucesso!'));
  bot.on('spawn', () => console.log('🟢 Bot apareceu no mundo!'));
  bot.on('end', () => {
    console.log('⚠️ Bot foi desconectado. Tentando reconectar em 30s...');
    setTimeout(iniciarBot, 30000);
  });
  bot.on('error', (err) => {
    console.log('❌ Erro no bot:', err.message);
  });
}

console.log('⏳ Esperando 20s para o servidor iniciar...');
setTimeout(iniciarBot, 20000);
