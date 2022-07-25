import {Collection} from '@discordjs/collection';
import Counter from './commands/Counter.js';
import LeagueChallenges from './commands/league/LeagueChallenges.js';
import Ping from './commands/Ping.js';
import Source from './commands/Source.js';
import {Autocomplete, SelectSlashCommand, SlashCommand} from './SlashCommand.js';

const SlashCommandList = new Collection<string, SlashCommand>();
SlashCommandList.set(Ping.data.name, Ping);
SlashCommandList.set(Source.data.name, Source);
SlashCommandList.set(Counter.data.name, Counter);
SlashCommandList.set(LeagueChallenges.data.name, LeagueChallenges);

const SelectCommandList = new Collection<string, SelectSlashCommand>();
SelectCommandList.set(LeagueChallenges.customId, LeagueChallenges);

const AutocompleteCommandList = new Collection<string, Autocomplete>();
AutocompleteCommandList.set(LeagueChallenges.data.name, LeagueChallenges);

export {SlashCommandList, SelectCommandList, AutocompleteCommandList};