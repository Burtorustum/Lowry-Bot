import CounterModel from '../database/counter-model.js';

export const name = 'ready';
export const once = true;

export function execute(client) {
  CounterModel.sync();

  console.log(`Ready! Logged in as ${client.user.tag}`);
}