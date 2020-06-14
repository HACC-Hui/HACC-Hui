import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Teams } from './TeamCollection';
import { ROLE } from '../role/Role';

class TeamChallengeCollection extends BaseCollection {
  constructor() {
    super('TeamChallenge', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      challengeID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  define({ team, challenge }) {
    const teamID = Teams.findIdBySlug(team);
    const challengeID = Challenges.findIdBySlug(challenge);
    return this._collection.insert({ teamID, challengeID });
  }

  update(docID, { team, challenge }) {
    this.assertDefined(docID);
    const updateData = {};
    if (challenge) {
      updateData.challengeID = Challenges.getID(challenge);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
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

  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const TeamChallenges = new TeamChallengeCollection();
