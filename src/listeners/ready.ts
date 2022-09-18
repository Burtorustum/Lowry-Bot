import {Client} from 'discord.js';
import {currency, Users} from '../database/dbObjects.js';

export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return;
    }

    const storedBalances = await Users.findAll();
    // @ts-ignore
    storedBalances.forEach(b => currency.set(b.user_id, b));

    console.log(`Ready! Logged in as ${client.user.tag}`);
  });
};