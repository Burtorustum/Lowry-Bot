import {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder
} from '@discordjs/builders';
import {
  APISelectMenuOption,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SelectMenuInteraction
} from 'discord.js';
import {Autocomplete, SelectSlashCommand} from '../../SlashCommand.js';
import Challenges from './Challenge.js';
import {Champions} from './Champion.js';

const LeagueChallenges: SelectSlashCommand & Autocomplete = {
  data: new SlashCommandBuilder()
      .setName('league-challenge')
      .setDescription('Get info about league challenges')
      .addSubcommand(subcommand => {
        return subcommand.setName('champ')
            .setDescription('Get all the challenges a champ is in to')
            .addStringOption(option => {
              return option.setName('champion')
                  .setDescription('The name of the champion to query')
                  .setAutocomplete(true)
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('challenge')
            .setDescription('Get the champions in the intersection of any number of challenges');
      }),

  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.options.getSubcommand() === 'champ') {
      const championsChallenges: string[] = [];
      Array.from(Challenges.entries()).forEach(challenge => {
        const challengeName = challenge[0];
        const isAccepted = new Set(challenge[1]).has(interaction.options.getString('champion')?.toUpperCase() ?? '');

        if (isAccepted) {
          championsChallenges.push(challengeName);
        }
      });
      await interaction.reply({
        ephemeral: false,
        content: `${interaction.options.getString('champion')} can be used to complete: \n ${championsChallenges.join(
            ', ')}`,
        components: []
      });
      return;
    }
    const selectRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('selectLeagueChallenge')
                .setPlaceholder('Nothing Selected')
                .setMinValues(1)
                .setMaxValues(10)
                .addOptions(Array.from(Challenges.keys()).map(cName => {
                  return {
                    label: cName,
                    description: ' ',
                    value: cName
                  } as APISelectMenuOption;
                }))
        );
    await interaction.reply({
      ephemeral: false,
      content: 'Choose a challenge you want to know more about, or multiple to see which champs overlap',
      components: [selectRow]
    });
  },

  async update(interaction: SelectMenuInteraction): Promise<any> {

    let allowedChamps: string[] = Challenges.get(interaction.values[0]) ?? [];
    for (let i = 1; i < interaction.values.length; i++) {
      const nextChallengeChamps = new Set(Challenges.get(interaction.values[i]));
      allowedChamps = allowedChamps.filter(e => nextChallengeChamps.has(e));
    }
    // TODO: improve so it can display levels of intersection (intersects 2/3 groups, etc)
    await interaction.update({
      content: `Champs in the intersection of {${interaction.values.join(', ')}}: \n${allowedChamps.join(', ')}`
    });
  },

  customId: 'selectLeagueChallenge',

  async autocomplete(interaction: AutocompleteInteraction): Promise<any> {
    console.log(interaction);
    if (interaction.options.getSubcommand() === 'champ') {
      const focusedValue = interaction.options.getFocused().toUpperCase();
      const filtered = Champions.filter(choice => choice.startsWith(focusedValue)).slice(0, 10);
      console.log(filtered);
      await interaction.respond(
          filtered.map(choice => ({name: choice, value: choice})),
      );
    }
  }
};

export default LeagueChallenges;