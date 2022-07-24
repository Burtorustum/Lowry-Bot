import {Client} from "discord.js";
import CounterModel from '../database/counter-model.js';

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    await CounterModel.sync();
    console.log(`Ready! Logged in as ${client.user.tag}`);
  });
};