import {Client, Message} from 'discord.js';
import CounterModel from '../database/counter-model.js';

// TODO: regex patterning for dog (with no LETTERS on either side), awooga, etc
const illegalWords: string[] = [
  'sniff', 'horny', 'goodness gracious', ' girl ', 'eggplant', ' dog ', 'pee', 'esex', '🍆', 'wife', 'women', 'bark',
  'woof'
];

export default (client: Client): void => {
  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) {
      return;
    }

    //if msg from crawley
    if (message.author.id === '223051830991650816') {// || message.author.id === '116311192162664452') {
      console.log(`${message.author.username} sent a message: ${message.content}`);
      if (illegalWords.some((word: string) => {return message.content.includes(word);})) {
        console.log(`%cUh Oh Crawley`, 'color: orange');
        const counter = await CounterModel.findOne({where: {name: 'crawley is horny'}});
        if (counter) {
          await counter.increment('count', {by: (1)});
          message.channel.send(
              `Crawley is being horny! New count is: `
              + await (await CounterModel.findOne({where: {name: 'crawley is horny'}}))?.get('count'));
        }
      }
    }
  });
}

