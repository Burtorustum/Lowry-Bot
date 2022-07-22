import {Client, Collection, IntentsBitField} from "discord.js";
import {config} from "dotenv";
import fs from 'fs';
import {Tags} from './sequelize.js';

config();
const client = new Client({intents: [IntentsBitField.Flags.Guilds]});

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
//  counter slash command,
//  counter modal/gui
//  quotes {add, random, random from user}
// w/ select + text fields
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import('./commands/' + file);
  client.commands.set(command.data.name, command);
}

// Run a single time when ready
client.once('ready', () => {
  Tags.sync();
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
  }
});

client.login(process.env.DISCORD_TOKEN);