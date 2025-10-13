const mineflayer = require('mineflayer')

function criarBot() {
  const bot = mineflayer.createBot({
    host: 'osbrenrotados.aternos.me', // troque pelo IP do seu servidor
    port: 25565, // porta padrão
    username: 'BotMinecraft2', // nome do bot
    version: '1.21.1', // força a versão compatível
    auth: 'offline' // servidor pirata = modo offline
  })

  bot.on('login', () => {
    console.log('✅ Bot entrou no servidor com sucesso!')
  })

  bot.on('spawn', () => {
    console.log('🟢 Bot spawnado no mundo!')
  })

  bot.on('end', (reason) => {
    console.log('❌ Bot desconectado:', reason)
    setTimeout(criarBot, 10000) // tenta reconectar
  })

  bot.on('error', (err) => {
    console.log('⚠️ Erro no bot:', err.message)
  })
}

criarBot()
