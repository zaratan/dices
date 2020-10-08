import { Client } from 'discord.js';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env.discord') });

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(process.env.DISCORD_TOKEN);
