import {SlashCommandBuilder} from '@discordjs/builders';
import {ChatInputCommandInteraction, InteractionResponse} from 'discord.js';
import CounterModel from '../database/counter-model.js';
import {SlashCommand} from '../SlashCommand.js';

const Counter: SlashCommand = {
  data: new SlashCommandBuilder()
      .setName('counter')
      .setDescription('create, increment, or decrement a counter')
      .addSubcommand(subcommand => {
        return subcommand.setName('create')
            .setDescription('create a new counter')
            .addStringOption(option => {
              return option.setName('name')
                  .setDescription('name of counter to be created')
                  .setRequired(true);
            })
            .addStringOption(option => {
              return option.setName('description')
                  .setDescription('description of what the counter counts')
                  .setRequired(true);
            })
            .addIntegerOption(option => {
              return option.setName('initial')
                  .setDescription('initial value of the counter')
                  .setRequired(false);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('get')
            .setDescription('get the value of a counter')
            .addStringOption(option => {
              return option.setName('name')
                  .setDescription('name of counter to fetch value of')
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('increment')
            .setDescription('increment a counter')
            .addStringOption(option => {
              return option.setName('name')
                  .setDescription('name of counter to increment')
                  .setRequired(true);
            })
            .addIntegerOption(option => {
              return option.setName('val')
                  .setDescription('integer to increment the counter by')
                  .setRequired(false);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('decrement')
            .setDescription('decrement a counter')
            .addStringOption(option => {
              return option.setName('name')
                  .setDescription('name of counter to decrement')
                  .setRequired(true);
            })
            .addIntegerOption(option => {
              return option.setName('val')
                  .setDescription('integer to decrement the counter by')
                  .setRequired(false);
            });
      }),

  execute: async (interaction: ChatInputCommandInteraction): Promise<InteractionResponse> => {
    if (interaction.options.getSubcommand() === 'create') {
      const counterName = interaction.options.getString('name');
      const counterDescription = interaction.options.getString('description');
      let initialVal = interaction.options.getInteger('initial') ?? 0;// nullish coalescing -- deals with optional input

      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const counter = await CounterModel.create({
          name: counterName,
          description: counterDescription,
          count: initialVal
        });
        return interaction.reply(`Counter \"${counter.get('name')}\" added.`);
      } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return interaction.reply({content: `Counter \"${counterName}\" already exists.`, ephemeral: true});
        }

        return interaction.reply(
            {content: 'Something went wrong with adding a counter: tell rob he sucks', ephemeral: true});
      }
    } else {
      const countName = interaction.options.getString('name');
      const val = interaction.options.getInteger('val') ?? 1;

      const counter = await CounterModel.findOne({where: {name: countName}});
      if (counter) {
        if (interaction.options.getSubcommand() === 'get') {
          return interaction.reply('Count of ' + countName + ': ' + await counter.get('count'));
        } else if (interaction.options.getSubcommand() === 'increment') {
          await counter.increment('count', {by: (val)});
          return interaction.reply(
              countName + '\'s value is now: '
              + await (await CounterModel.findOne({where: {name: countName}}))?.get('count'));
        } else if (interaction.options.getSubcommand() === 'decrement') {
          await counter.decrement('count', {by: (val | 1)});
          return interaction.reply(
              countName + '\'s value is now: '
              + await (await CounterModel.findOne({where: {name: countName}}))?.get('count'));
          // HACK WARNING: above 2 uses off ? are technically bad but let u compile and we know to be ok
        }
      }

      return interaction.reply({content: `No counter with name \"${countName}\"`, ephemeral: true});
    }
  }
};

export default Counter;