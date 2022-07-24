import {SlashCommandBuilder} from '@discordjs/builders';
import {ChatInputCommandInteraction, InteractionResponse} from 'discord.js';
import {Command} from '../Command.js';

const Ping: Command = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),

  execute: async (interaction: ChatInputCommandInteraction): Promise<InteractionResponse> => {
    return interaction.reply({content: 'Pong!'});
  }
};

export default Ping;