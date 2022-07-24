import {REST} from "@discordjs/rest";
import {Routes} from 'discord-api-types/v10';
import {config} from "dotenv";
import CommandList from '../src/CommandList.js';

config();

const commands = [];
for (const command of CommandList.values()) {
  commands.push(command.data.toJSON());
}

// @ts-ignore
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// @ts-ignore
rest.put(Routes.applicationCommands(process.env.APP_ID), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);