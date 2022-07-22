export const name = 'interactionCreate';

export function execute(interaction) {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
}
