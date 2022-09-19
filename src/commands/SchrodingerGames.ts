import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder
} from '@discordjs/builders';
import {ChatInputCommandInteraction, ModalSubmitInteraction, TextInputStyle} from 'discord.js';
import GamesModel from '../database/models/GamesModel.js';
import {Modal, SlashCommand} from '../SlashCommand.js';

const SchrodingerGames: SlashCommand & Modal = {
  data: new SlashCommandBuilder()
      .setName('schrodinger')
      .setDescription('The games we have and plan to play')
      .addSubcommand(subcommand => {
        return subcommand.setName('unplayed')
            .setDescription('games we have yet to play');
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('finished')
            .setDescription('finished games');
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('hof')
            .setDescription('the best of the best');
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('hos')
            .setDescription('the worst of the worst');
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('add')
            .setDescription('add a game');
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('markfinished')
            .setDescription('mark a game as finished')
            .addStringOption(option => {
              return option.setName('game')
                  .setDescription('The name of the game to mark finished')
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('markhof')
            .setDescription('Add a game to the hall of fame')
            .addStringOption(option => {
              return option.setName('game')
                  .setDescription('The game to add to the HoF')
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand.setName('markhos')
            .setDescription('Add a game to the hall of shame')
            .addStringOption(option => {
              return option.setName('game')
                  .setDescription('The game to add to the HoS')
                  .setRequired(true);
            });
      }),

  execute: async (interaction: ChatInputCommandInteraction): Promise<any> => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'unplayed') {
      const gamesList = await GamesModel.findAll({where: {status: 'unplayed'}});
      const gamesListString = gamesList.map(g => g.get('name') + ` (${g.get('player')})`).join('\n - ');
      return interaction.reply({content: `**Games to play** \n - ${gamesListString}`, ephemeral: false});
    }

    if (subcommand === 'finished') {
      const gamesList = await GamesModel.findAll({where: {status: 'finished'}});
      const gamesListString = gamesList.map(g => g.get('name') + ` (${g.get('player')})`).join('\n - ');
      return interaction.reply({content: `**Completed Games** \n - ${gamesListString}`, ephemeral: false});
    }

    if (subcommand === 'hof') {
      const gamesList = await GamesModel.findAll({where: {status: 'hof'}});
      const gamesListString = gamesList.map(g => g.get('name') + ` (${g.get('player')})`).join('\n - ');
      return interaction.reply({content: `**The Hall of Fame** \n - ${gamesListString}`, ephemeral: false});
    }

    if (subcommand === 'hos') {
      const gamesList = await GamesModel.findAll({where: {status: 'hos'}});
      const gamesListString = gamesList.map(g => g.get('name') + ` (${g.get('player')})`).join('\n - ');
      return interaction.reply({content: `**The Hall of Shame** \n - ${gamesListString}`, ephemeral: false});
    }

    if (subcommand === 'markfinished') {
      const game = interaction.options.getString('game');
      return GamesModel.update(
              {status: 'finished'},
              {where: {name: game}}
          )
          .then(() => {return interaction.reply({content: 'Done!', ephemeral: true});});

    }

    if (subcommand === 'markhof') {
      const game = interaction.options.getString('game');
      return GamesModel.update(
              {status: 'hof'},
              {where: {name: game}}
          )
          .then(() => {return interaction.reply({content: 'Done!', ephemeral: true});});
    }

    if (subcommand === 'markhos') {
      const game = interaction.options.getString('game');
      return GamesModel.update(
              {status: 'hos'},
              {where: {name: game}}
          )
          .then(() => {return interaction.reply({content: 'Done!', ephemeral: true});});
    }

    const modal = new ModalBuilder()
        .setCustomId('schrodingerGames')
        .setTitle('Add a Game!');

    const gameTitleInput = new TextInputBuilder()
        .setCustomId('gameTitleInput')
        .setLabel('What\'s the game\'s name?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const gamePlayerInput = new TextInputBuilder()
        .setCustomId('gamePlayerInput')
        .setLabel('Who will play the game?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const aRow1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gameTitleInput);
    const aRow2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gamePlayerInput);

    modal.addComponents(aRow1, aRow2);

    return await interaction.showModal(modal);
  },

  handleResponse: async (interaction: ModalSubmitInteraction): Promise<void> => {
    const gameName = interaction.fields.getTextInputValue('gameTitleInput');
    const playerName = interaction.fields.getTextInputValue('gamePlayerInput');

    await GamesModel.upsert({
      name: gameName,
      player: playerName,
      status: 'unplayed'
    });

    await interaction.reply({content: `Game added.`, ephemeral: true});
  },

  customId: 'schrodingerGames'
};

export default SchrodingerGames;