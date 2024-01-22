// env.js
require('dotenv').config();

module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  channelId: process.env.CHANNEL_ID,
  background: process.env.BACKGROUND,
  tokenId: process.env.TOKENID,
};