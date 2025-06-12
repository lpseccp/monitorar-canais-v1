const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

// Token do seu bot do Telegram (adicione no Render como variável de ambiente)
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID; // Seu ID de chat ou canal

const bot = new TelegramBot(BOT_TOKEN);

// Lista de anúncios a monitorar
let linksMonitorados = [
  "https://accs-market.com/group/427586",
  "https://accs-market.com/group/427822",
];

// Objeto para controlar status anterior
let statusAnuncios = {};

// Verifica os anúncios
async function verificarAnuncios() {
  for (const link of linksMonitorados) {
    try {
      const response = await axios.get(link);
      if (response.status === 200) {
        console.log(`✅ ${link} ainda está no ar.`);
        statusAnuncios[link] = true;
      }
    } catch (err) {
      if (statusAnuncios[link] !== false) {
        console.log(`❌ ${link} saiu do ar!`);
        bot.sendMessage(CHAT_ID, `⚠️ O anúncio saiu do ar: ${link}`);
        statusAnuncios[link] = false;
      }
    }
  }
}

// Executa a verificação a cada 5 minutos
setInterval(verificarAnuncios, 5 * 60 * 1000);

// Executa assim que iniciar
verificarAnuncios();
