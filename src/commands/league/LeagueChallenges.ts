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
import {Challenges, Champions} from './Challenge.js';

const LeagueChallenges: SelectSlashCommand & Autocomplete = {
  data: new SlashCommandBuilder()
      .setName('league-challenge')
      .setDescription('Get info about league challenges!')
      .addSubcommand(subcommand => {
        return subcommand.setName('champ')
            .setDescription('Get all the challenges a champ is in to')
            .addStringOption(option => {
              return option.setName('champion')
                  .setDescription('The name of the champion to query')
                  .setAutocomplete(true)
                  .setRequired(false);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('challenge')
            .setDescription('Get the champions in the intersection of any number of challenges');
      }),

  execute: async (interaction: ChatInputCommandInteraction): Promise<any> => {
    if (interaction.options.getSubcommand() === 'champ') {
      const champOption = interaction.options.getString('champion');
      if (!champOption) {
        const responseContent =
            `Listing all champion\'s challenges: \n ${
                Array.from(Champions.entries())
                    .sort((a, b) => {
                      return a[1].length >= b[1].length ? -1 : 1;
                    })
                    .map((value) => {
                      return `**${value[0]}**: (${value[1].length})`;
                    })
                    .slice(0, 15)
                    .join('\n')
            }`;

        return interaction.reply({
          ephemeral: false,
          content: responseContent
        });
      }
      await interaction.reply({
        ephemeral: false,
        content: `${interaction.options.getString('champion')} can be used to complete: \n ${Champions.get(
            interaction.options.getString('champion')?.toUpperCase() || '')?.join(
            ', ')}`,
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
                .addOptions(
                    Array.from(Challenges.keys())
                        .sort()
                        .map(cName => {
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
    if (interaction.options.getSubcommand() === 'champ') {
      const focusedValue = interaction.options.getFocused().toUpperCase();
      const filtered = Array.from(Champions.keys()).filter(choice => choice.startsWith(focusedValue)).slice(0, 10);
      await interaction.respond(
          filtered.map(choice => ({name: choice, value: choice})),
      );
    }
  }
};

export default LeagueChallenges;