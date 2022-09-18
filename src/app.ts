import {ActivityType, Client, IntentsBitField} from 'discord.js';
import {config} from 'dotenv';
import interactionCreate from './listeners/interactionCreate.js';
import messageCreate from './listeners/messageCreate.js';
import ready from './listeners/ready.js';

config();
const client: Client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
  presence: {
    status: 'online',
    afk: false,
    activities: [{
      name: 'Searching for my scissors ✂️',
      type: ActivityType.Playing
    }]
  }
});

// Register event listeners
ready(client);
interactionCreate(client);
messageCreate(client);
// Login
client.login(process.env.DISCORD_TOKEN);

export {client};