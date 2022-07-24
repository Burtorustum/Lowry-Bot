import {ActivityType, Client, IntentsBitField} from "discord.js";
import {config} from "dotenv";
import ready from './listeners/ready.js';
import interactionCreate from './listeners/interactionCreate.js';

config();
const client: Client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
  presence: {
    status: 'online',
    afk: false,
    activities: [{
      name: 'Searching for my scissors ✂️',
      type: ActivityType.Playing,
    }]
  }
});

// Register event listeners
ready(client);
interactionCreate(client);

// Login
client.login(process.env.DISCORD_TOKEN);