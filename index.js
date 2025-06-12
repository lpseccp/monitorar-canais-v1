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
      const html = response.data;

      // Frase que aparece quando o anúncio saiu do ar
      const anuncioRemovidoMsg = "This listing either doesn’t exist, has been removed, or is already in the middle of a deal.";

      // Verifica se a frase aparece no HTML
      const anuncioForaDoAr = html.includes(anuncioRemovidoMsg);

      if (anuncioForaDoAr && statusAnuncios[link] !== false) {
        console.log(`❌ ${link} saiu do ar!`);
        bot.sendMessage(CHAT_ID, `⚠️ O anúncio saiu do ar: ${link}`);
        statusAnuncios[link] = false;
      } else if (!anuncioForaDoAr && statusAnuncios[link] !== true) {
        console.log(`✅ ${link} voltou ao ar.`);
        bot.sendMessage(CHAT_ID, `✅ O anúncio voltou ao ar: ${link}`);
        statusAnuncios[link] = true;
      } else {
        console.log(`✅ ${link} está no ar normalmente.`);
      }
    } catch (err) {
      console.log(`Erro ao acessar ${link}:`, err.message);
    }
  }
}

// Executa a verificação a cada 5 minutos
setInterval(verificarAnuncios, 5 * 60 * 1000);

// Executa assim que iniciar
verificarAnuncios();