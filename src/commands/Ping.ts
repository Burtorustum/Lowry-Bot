import {MessageActionRowComponentBuilder, SlashCommandBuilder} from '@discordjs/builders';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionResponse
} from 'discord.js';
import {SlashCommand} from '../SlashCommand.js';

const Ping: SlashCommand = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),

  execute: async (interaction: ChatInputCommandInteraction): Promise<InteractionResponse> => {

    if (interaction.commandName === 'ping') {
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('primary')
                  .setLabel('Primary')
                  .setStyle(ButtonStyle.Primary),
          );

      await interaction.reply({content: 'Pong!', components: [row]});
    }

    return interaction.reply({content: 'Pong!'});
  }
};

export default Ping;