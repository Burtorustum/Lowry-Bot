import {SlashCommandBuilder} from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('source')
    .setDescription('Links to the repo');

export async function execute(interaction) {
  return await interaction.reply({content: 'https://github.com/Burtorustum/Lowry-Bot', ephemeral: true});
}