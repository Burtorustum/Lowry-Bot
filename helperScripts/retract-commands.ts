import {REST} from "@discordjs/rest";
import {Routes} from 'discord-api-types/v10';
import {config} from "dotenv";

config();

// @ts-ignore
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// @ts-ignore
rest.put(Routes.applicationCommands(process.env.APP_ID), {body: []})
    .then(() => console.log('Successfully removed application commands.'))
    .catch(console.error);