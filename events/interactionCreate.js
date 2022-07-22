export const name = 'interactionCreate';

export async function execute(interaction) {
  console.log(
      `${interaction.user.tag} in #${interaction.channel.name}:${interaction.guild} triggered \/${interaction.commandName}`
  );

  const command = interaction.client.commands.get(interaction.commandName);

  try {
    command.execute(interaction)
        .then(message => console.log(`Replied to ${interaction.user.tag} with \"${message.content}\"`));
    // TODO: figure out reply content logging
  } catch (error) {
    console.error(error);
    interaction.reply(
        {content: 'There was an error while executing this command! Tell Rob he sucks!', ephemeral: true});
  }
}