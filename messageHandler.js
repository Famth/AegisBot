// Importer les modules nécessaires
const { chat } = require('openai');
const {apiKey,channelId,background,tokenId} = require('./env');

// Fonction de gestion des messages
async function handleMessage(message, openai, client) {
    if (message.author.bot || message.channel.id !== channelId || message.content.startsWith('!')) {
        return;
      }
    
      // Initialiser un journal de conversation avec un message système
      let conversationLog = [{ role: 'system', content: background }];
    
      try {
        // Indiquer que le bot est en train de taper une réponse
        await message.channel.sendTyping();
    
        // Récupérer les 15 messages précédents dans le canal
        const prevMessages = await message.channel.messages.fetch({ limit: 6 });
        // Inverser l'ordre des messages pour commencer par le plus ancien
        prevMessages.reverse().forEach((msg) => {
          // Ignorer les messages commençant par '!' ou les messages d'autres bots (sauf le bot actuel)
          if (msg.content.startsWith('!') || (msg.author.bot && msg.author.id !== client.user.id)) {
            return;
          }
    
          // Déterminer le rôle (utilisateur ou assistant) du message et nettoyer le nom d'utilisateur
          const role = msg.author.id === client.user.id ? 'assistant' : 'user';
          const name = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    
          // Ajouter le message au journal de conversation
          msg.content = msg.content;
          //console.log(msg.content);
          conversationLog.push({ role, content: msg.content, name });
        });
    
        // Générer une réponse en utilisant l'API OpenAI avec le journal de conversation
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: conversationLog,
          
        });
      
    
        // Envoyer la première réponse générée en tant que réponse au message original
        if (completion.choices.length > 0 && completion.choices[0].message) {
          await message.reply(completion.choices[0].message);
        }
      } catch (error) {
        // Gérer les erreurs en affichant un message d'erreur dans la console
        console.error(`Error: ${error.message}`);
      }
}

// Exporter la fonction pour pouvoir l'utiliser dans d'autres modules
module.exports = handleMessage;