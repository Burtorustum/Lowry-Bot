import {SlashCommandBuilder} from '@discordjs/builders';
import {ChatInputCommandInteraction, InteractionResponse} from 'discord.js';
import {SlashCommand} from '../SlashCommand.js';

const Source: SlashCommand = {
  data: new SlashCommandBuilder()
      .setName('source')
      .setDescription('Links to the repo'),

  execute(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
    return interaction.reply({content: 'https://github.com/Burtorustum/Lowry-Bot', ephemeral: true});
  }
};
export default Source;