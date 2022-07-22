import {SlashCommandBuilder} from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

export async function execute(interaction) {
  return interaction.reply({content: 'Pong!'});
}