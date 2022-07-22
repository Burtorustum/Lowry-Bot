import {REST} from "@discordjs/rest";
import {Routes} from 'discord-api-types/v10';
import {config} from "dotenv";
import fs from 'fs';
import path from 'path';
import url from 'url';

config();

const commands = [];
const commandsPath = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import('./commands/' + file);
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationCommands(process.env.APP_ID), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);