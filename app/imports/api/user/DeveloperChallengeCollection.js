import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Developers } from './DeveloperCollection';
import { ROLE } from '../role/Role';

class DeveloperChallengeCollection extends BaseCollection {
  constructor() {
    super('DeveloperChallenge', new SimpleSchema({
      challengeID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  define({ challenge, developer }) {
    const challengeID = Challenges.getID(challenge);
    const developerID = Developers.getID(developer);
    return this._collection.insert({ challengeID, developerID });
  }

  update(docID, { challenge, developer }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (challenge) {
      updateData.challengeID = Challenges.getID(challenge);
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeChallenge(challenge) {
    const challengeID = Challenges.getID(challenge);
    this._collection.remove({ challengeID });
  }

  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const DeveloperChallenges = new DeveloperChallengeCollection();
