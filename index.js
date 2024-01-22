// Importer les modules nécessaires
const dotenv = require('dotenv');
const { Client, IntentsBitField } = require('discord.js');
const OpenAI = require('openai');
const handleMessage = require('./messageHandler.js');
const {apiKey,channelId,background,tokenId} = require('./env');

// Charger les variables d'environnement
dotenv.config();

// Créer une instance de l'API OpenAI en utilisant la clé d'API stockée dans les variables d'environnement
const openai = new OpenAI({
  apiKey,
});

// Créer une instance du client Discord
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Événement déclenché lorsque le bot Discord est prêt
client.on('ready', () => {
  console.log('Le Bot est en ligne');
});

// Événement déclenché lorsqu'un message est créé dans un serveur Discord
client.on('messageCreate', (message) => {
  handleMessage(message, openai, client);
});

// Connecter le bot en utilisant le jeton d'authentification stocké dans les variables d'environnement
client.login(tokenId);