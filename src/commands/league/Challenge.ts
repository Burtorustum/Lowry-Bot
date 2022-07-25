import {Collection} from '@discordjs/collection';
import challengeInfoJson from './challenge-info.json' assert {type: 'json'};

const Challenges: Collection<string, string[]> = new Collection<string, string[]>();

for (const challenge of challengeInfoJson.challengeList) {
  Challenges.set(challenge.name, challenge.champs);
}
// TODO: precompute all champ's challenges

export default Challenges;