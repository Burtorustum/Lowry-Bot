import {Collection} from '@discordjs/collection';
import Counter from './commands/Counter.js';
import LeagueChallenges from './commands/league/LeagueChallenges.js';
import Monocoins from './commands/Monocoins.js';
import SchrodingerGames from './commands/SchrodingerGames.js';
import Source from './commands/Source.js';
import {Autocomplete, Modal, SelectSlashCommand, SlashCommand} from './SlashCommand.js';

const SlashCommandList = new Collection<string, SlashCommand>();
SlashCommandList.set(Source.data.name, Source);
SlashCommandList.set(Counter.data.name, Counter);
SlashCommandList.set(LeagueChallenges.data.name, LeagueChallenges);
SlashCommandList.set(Monocoins.data.name, Monocoins);
SlashCommandList.set(SchrodingerGames.data.name, SchrodingerGames);

const SelectCommandList = new Collection<string, SelectSlashCommand>();
SelectCommandList.set(LeagueChallenges.customId, LeagueChallenges);

const AutocompleteCommandList = new Collection<string, Autocomplete>();
AutocompleteCommandList.set(LeagueChallenges.data.name, LeagueChallenges);
AutocompleteCommandList.set(Counter.data.name, Counter);

const ModalCommandList = new Collection<string, Modal>();
ModalCommandList.set(SchrodingerGames.customId, SchrodingerGames);

export {SlashCommandList, SelectCommandList, AutocompleteCommandList, ModalCommandList};