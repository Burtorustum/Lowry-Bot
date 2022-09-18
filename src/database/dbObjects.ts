import {Collection} from '@discordjs/collection';
import CurrencyShop from './models/CurrencyShop.js';
import UserItems from './models/UserItems.js';

import Users from './models/Users.js';

UserItems.belongsTo(CurrencyShop, {foreignKey: 'item_id', as: 'item'});

Reflect.defineProperty(Users.prototype, 'addItem', {
  // @ts-ignore
  value: async function addItem(item) {
    const userItem = await UserItems.findOne({
      where: {user_id: this.user_id, item_id: item.id}
    });

    if (userItem) {
      // @ts-ignore
      userItem.amount += 1;
      return userItem.save();
    }

    return UserItems.create({user_id: this.user_id, item_id: item.id, amount: 1});
  }
});

Reflect.defineProperty(Users.prototype, 'getItems', {
  /* eslint-disable-next-line func-name-matching */
  value: function getItems() {
    return UserItems.findAll({
      where: {user_id: this.user_id},
      include: ['item']
    });
  }
});

const currency = new Collection();

/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue On the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

Reflect.defineProperty(currency, 'add', {
  // @ts-ignore
  value: async (id, amount) => {
    const user = currency.get(id);

    if (user) {
      // @ts-ignore
      user.balance += Number(amount);
      // @ts-ignore
      return user.save();
    }

    const newUser = await Users.create({user_id: id, balance: amount});
    currency.set(id, newUser);

    return newUser;
  }
});

Reflect.defineProperty(currency, 'getBalance', {
// @ts-ignore
  value: id => {
    const user = currency.get(id);
    // @ts-ignore
    return user ? user.balance : 0;
  }
});

export {Users, CurrencyShop, UserItems, currency};
