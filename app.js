import {ActivityType, Client, Collection, IntentsBitField} from "discord.js";
import {config} from "dotenv";
import fs from 'fs';

config();
const client = new Client({
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

// Events
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = await import('./events/' + file);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Commands
// TODO: Ideas for commands:
//  auto counting channel moderation,
//  auto maymays moderation,
//  counter modal/gui w/ select + text fields
//  counter auto-refreshing view (either a command that gets rerun or possibly an actual app?)
//  quotes {add, random, random from user}
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import('./commands/' + file);
  client.commands.set(command.data.name, command);
}

client.login(process.env.DISCORD_TOKEN);