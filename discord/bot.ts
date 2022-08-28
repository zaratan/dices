import { Client, MessageEmbed } from 'discord.js';
import { resolve } from 'path';
import { config } from 'dotenv';
import { parseAndRoll } from '../helpers/cmd';

config({ path: resolve(__dirname, '../.env.discord') });

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  const diceMatch = /!roll\s+(?<cmd>.*$)/.exec(msg.content);
  console.log(`New message received: ${msg.content}`);
  if (diceMatch?.groups?.cmd) {
    console.log(`Parsing dice command: ${diceMatch.groups.cmd}`);
    const result = parseAndRoll(diceMatch.groups.cmd);
    const resultEmbed = new MessageEmbed();
    resultEmbed.setTitle(result.successString);
    resultEmbed.setDescription(result.explString);

    msg.reply('');
    msg.reply(resultEmbed);
  }
});

client.login(process.env.DISCORD_TOKEN);
