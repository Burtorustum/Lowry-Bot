import sequelize from '../src/database/define-sequelize-model.js';
import CounterModel from '../src/database/models/counter-model.js';
import CurrencyShop from '../src/database/models/CurrencyShop.js';
import GIFModel from '../src/database/models/GIFModel.js';
import UserItems from '../src/database/models/UserItems.js';
import Users from '../src/database/models/Users.js';

/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue on the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

await CounterModel.sync();
await CurrencyShop.sync();
await Users.sync();
await UserItems.sync();
await GIFModel.sync();

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
  const shop = [
    CurrencyShop.upsert({name: '+1 to Crawley Is Horny', cost: 300}),
    CurrencyShop.upsert({name: 'Nominate a server name', cost: 500}),
    CurrencyShop.upsert({name: 'tomato ping', cost: 1000}),
    CurrencyShop.upsert({name: 'Timout a user (10 mins)', cost: 5000}),
    CurrencyShop.upsert({name: 'Ultrakill', cost: 100000})
  ];

  await Promise.all(shop);
  console.log('Database synced');

  sequelize.close();
}).catch(console.error);