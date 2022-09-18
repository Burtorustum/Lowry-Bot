import {SlashCommandBuilder} from '@discordjs/builders';
import {ChatInputCommandInteraction, Formatters, InteractionResponse} from 'discord.js';
import {Op} from 'sequelize';
import {client} from '../app.js';
import {currency, CurrencyShop, Users} from '../database/dbObjects.js';
import {SlashCommand} from '../SlashCommand.js';

/**
 * TODO:
 * Betting
 * Stock market
 * Item purchase/use logic
 */
const Monocoins: SlashCommand = {
  data: new SlashCommandBuilder()
      .setName('monocoins')
      .setDescription('Do things with your monocoins!')
      .addSubcommand(subcommand => {
        return subcommand
            .setName('balance')
            .setDescription('Get a user\'s monocoin balance')
            .addUserOption(option => {
              return option
                  .setName('user')
                  .setDescription('the user to check the balance of')
                  .setRequired(false);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand
            .setName('inventory')
            .setDescription('View a user\'s item inventory')
            .addUserOption(option => {
              return option
                  .setName('user')
                  .setDescription('the user to check the inventory of')
                  .setRequired(false);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand
            .setName('transfer')
            .setDescription('Transfer monocoins to another user')
            .addUserOption(option => {
              return option
                  .setName('user')
                  .setDescription('the user to transfer to')
                  .setRequired(true);
            })
            .addIntegerOption(option => {
              return option
                  .setName('amount')
                  .setDescription('number of monocoins to transfer')
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand
            .setName('buy')
            .setDescription('Buy an item from the shop')
            .addStringOption(option => {
              return option
                  .setName('item')
                  .setDescription('The name of the item to buy')
                  .setRequired(true);
            });
      })
      .addSubcommand(subcommand => {
        return subcommand
            .setName('shop')
            .setDescription('View the item shop');
      })
      .addSubcommand(subcommand => {
        return subcommand
            .setName('leaderboard')
            .setDescription('Display the monocoin leaderboard');
      }),
  execute: async (interaction: ChatInputCommandInteraction): Promise<InteractionResponse> => {
    const commandName = interaction.options.getSubcommand();

    if (commandName === 'balance') {
      const target = interaction.options.getUser('user') || interaction.user;

      return interaction.reply(
          {
            // @ts-ignore
            content: `${target.tag} has ${currency.getBalance(target.id)}` + ' <:monocoin:1015842384816394260>',
            ephemeral: true
          });
    }

    if (commandName === 'inventory') {
      const target = interaction.options.getUser('user') || interaction.user;
      const user = await Users.findOne({where: {user_id: target.id}});
      // @ts-ignore
      const items = await user.getItems();

      if (!items || !items.length) {
        return interaction.reply({content: `${target.tag} has nothing!`, ephemeral: true});
      }

      return interaction.reply(
          {
            // @ts-ignore
            content: `${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`,
            ephemeral: true
          });
    }

    if (commandName === 'transfer') {
      // @ts-ignore
      const currentAmount = currency.getBalance(interaction.user.id);
      const transferAmount = interaction.options.getInteger('amount');
      const transferTarget = interaction.options.getUser('user');

      // @ts-ignore
      if (transferAmount > currentAmount) {
        return interaction.reply(
            {content: `Sorry ${interaction.user} you don't have that much.`, ephemeral: true});
      }
      // @ts-ignore
      if (transferAmount <= 0) {
        return interaction.reply(
            {content: `Please enter an amount greater than zero, ${interaction.user}`, ephemeral: true});
      }

      // @ts-ignore
      currency.add(interaction.user.id, - transferAmount);
      // @ts-ignore
      currency.add(transferTarget.id, transferAmount);

      return interaction.reply(
          // @ts-ignore
          `Successfully transferred ${transferAmount} <:monocoin:1015842384816394260> to ${transferTarget.tag}. Your current balance is ${currency.getBalance(
              interaction.user.id)} <:monocoin:1015842384816394260>`);
    }

    // TODO: Autocomplete
    if (commandName === 'buy') {
      const itemName = interaction.options.getString('item');
      const item = await CurrencyShop.findOne({where: {name: {[Op.like]: itemName}}});

      if (!item) {
        return interaction.reply({content: 'That item doesn\'t exist.', ephemeral: true});
      }
      // @ts-ignore
      if (item.cost > currency.getBalance(interaction.user.id)) {
        return interaction.reply({content: `You don't have enough monocoins, ${interaction.user}`, ephemeral: true});
      }

      const user = await Users.findOne({where: {user_id: interaction.user.id}});
      // @ts-ignore
      currency.add(interaction.user.id, - item.cost);
      // @ts-ignore
      await user.addItem(item);
      // @ts-ignore
      return interaction.reply({content: `You've bought a ${item.name}`, ephemeral: true});
    }
    if (commandName === 'shop') {
      const items = await CurrencyShop.findAll();
      // @ts-ignore
      return interaction.reply(
          Formatters.blockQuote('WIP!! DONT BUY THINGS\n' + items.map(
              // @ts-ignore
              i => `**${i.name}**: ${i.cost} <:monocoin:1015842384816394260>`).join('\n')));
    }

    return interaction.reply(
        Formatters.codeBlock(
            // @ts-ignore
            currency.sort((a, b) => b.balance - a.balance)
                // @ts-ignore
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                // @ts-ignore
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(
                    // @ts-ignore
                    user.user_id).tag)}: ${user.balance} :monocoin:`)
                .join('\n')
        )
    );
  }
};

export default Monocoins;