import {Collection} from '@discordjs/collection';
import {Command} from './Command.js';
import Counter from './commands/Counter.js';
import Ping from './commands/Ping.js';
import Source from './commands/Source.js';

const CommandList = new Collection<string, Command>();
CommandList.set(Ping.data.name, Ping);
CommandList.set(Source.data.name, Source);
CommandList.set(Counter.data.name, Counter);

export default CommandList;