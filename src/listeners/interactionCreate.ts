import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  Interaction,
  InteractionType,
  SelectMenuInteraction,
  TextChannel
} from "discord.js";
import {AutocompleteCommandList, SelectCommandList, SlashCommandList} from '../SlashCommandList.js';

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    } else if (interaction.isSelectMenu()) {
      await handleSelectMenu(interaction);
    } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      await handleAutocomplete(interaction);
    }
  });
};

async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const command = SlashCommandList.get(interaction.commandName);
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

async function handleSelectMenu(interaction: SelectMenuInteraction): Promise<void> {
  const command = SelectCommandList.get(interaction.customId);
  console.log(command);
  if (!command) {
    return;
  }

  console.log(
      `Handling selection from ${interaction.user} in #${(interaction.channel as TextChannel).name}:${interaction.guild}`);
  command.update(interaction)
      .then(() => console.log('Finished Handling'));
}

async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
  console.log(interaction.commandName);
  console;
  const command = AutocompleteCommandList.get(interaction.commandName);
  if (!command) {
    return;
  }

  await command.autocomplete(interaction);

}