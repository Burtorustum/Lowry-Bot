import {REST} from "@discordjs/rest";
import {Routes} from 'discord-api-types/v10';
import {config} from "dotenv";

config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationCommands(process.env.APP_ID), {body: []})
    .then(() => console.log('Successfully removed application commands.'))
    .catch(console.error);