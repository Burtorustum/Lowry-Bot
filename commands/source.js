import {SlashCommandBuilder} from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('source')
    .setDescription('Links to the repo');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}