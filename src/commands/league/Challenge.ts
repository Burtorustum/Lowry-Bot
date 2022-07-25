import {Collection} from '@discordjs/collection';
import challengeInfoJson from './challenge-info.json' assert {type: 'json'};

const Challenges: Collection<string, string[]> = new Collection<string, string[]>();
const Champions: Collection<string, string[]> = new Collection<string, string[]>();

for (const challenge of challengeInfoJson.challengeList) {
  Challenges.set(challenge.name, challenge.champs);

  for (const champ of challenge.champs) {
    let alreadyAddedChallenges: string[] = Champions.get(champ) ?? [];
    alreadyAddedChallenges.push(challenge.name);
    Champions.set(champ, alreadyAddedChallenges);
  }
}

export {Challenges, Champions};