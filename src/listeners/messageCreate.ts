import {Client, Message} from 'discord.js';
import {currency} from '../database/dbObjects.js';
import CounterModel from '../database/models/counter-model.js';
import GIFModel from '../database/models/GIFModel.js';

// TODO: regex patterning for dog (with no LETTERS on either side), awooga, etc
const illegalWords: string[] = [
  'sniff', 'horny', 'goodness gracious', ' girl ', 'eggplant', ' dog ', 'pee', 'esex', '🍆', 'wife', 'women', 'bark',
  'woof', 'cum'
];

export default (client: Client): void => {
  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) {
      return;
    }

    // For each message someone sends, give them one monocoin
    // @ts-ignore
    currency.add(message.author.id, 1);

    // For each unique gif someone sends, give them 25 monocoins
    if (message.content.includes('tenor.com/')) {
      if (!await GIFModel.findOne({where: {url: message.content}})) {
        console.log(`User ${message.author.username} sent a unique gif! Awarding 25 monocoins`);
        message.react('<:monocoin:1015842384816394260>');
        await GIFModel.create({url: message.content});
        // @ts-ignore
        currency.add(message.author.id, 25);
      }
    }

    //if msg from crawley
    if (message.author.id === '223051830991650816') {// || message.author.id === '116311192162664452') {
      console.log(`${message.author.username} sent a message: ${message.content}`);
      if (illegalWords.some((word: string) => {return message.content.toLowerCase().includes(word);})) {
        console.log(`%cUh Oh Crawley`, 'color: orange');
        const counter = await CounterModel.findOne({where: {name: 'crawley is horny'}});
        if (counter) {
          await counter.increment('count', {by: (1)});
          //TODO: working?
          //message.channel.send(
          message.reply(
              `Crawley is being horny! New count is: `
              + await (await CounterModel.findOne({where: {name: 'crawley is horny'}}))?.get('count'));
        }
      }
    }
  });
}

