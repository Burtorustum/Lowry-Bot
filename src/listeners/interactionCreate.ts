import {ChatInputCommandInteraction, Client, Interaction, TextChannel} from "discord.js";
import CommandList from '../CommandList.js';

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    } else if (interaction.isContextMenuCommand()) {
      // Context menu command handler here, etc...
    }
  });
};

async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const command = CommandList.get(interaction.commandName);
  if (!command) {
    return;
  }

  console.log(
      `${interaction.user.tag} in #${(interaction.channel as TextChannel).name}:${interaction.guild} triggered ${interaction.toString()}`);

  command.execute(interaction)
      .then(async () => console.log(`Replied to ${interaction.user.tag} with \"${await interaction.fetchReply()}\"`))
      .catch(error => {
        console.error(error);
        interaction.reply({content: 'There was an error! Tell Rob he sucks!', ephemeral: true});
      });

}