import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Teams } from './TeamCollection';
import { ROLE } from '../role/Role';

/**
 * TeamChallengeCollection holds team challenge pairs.
 * @memberOf api/team
 * @extends api/base.BaseCollection
 */
class TeamChallengeCollection extends BaseCollection {
  constructor() {
    super('TeamChallenge', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      challengeID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines a new pair.
   * @param team {String} the team slug or ID.
   * @param challenge {String} the challenge slug or ID.
   * @return {String} the ID of the new pair.
   */
  define({ team, challenge }) {
    // console.log('TeamChallenge.define', team, challenge);
    const teamID = Teams.findIdBySlug(team);
    const challengeID = Challenges.findIdBySlug(challenge);
    // console.log(teamID, challengeID);
    return this._collection.insert({ teamID, challengeID });
  }

  /**
   * Updates the given team-challenge pair.
   * @param docID {String} the ID of the pair.
   * @param team {String} the slug or ID of the new team (optional).
   * @param challenge {String} the slug or ID of the new challenge (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
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

  /**
   * Removes the pair.
   * @param docID {String} the ID of the pair.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the pairs with the given challenge.
   * @param challenge {String} challenge slug or ID.
   */
  removeChallenge(challenge) {
    const challengeID = Challenges.getID(challenge);
    this._collection.remove({ challengeID });
  }

  /**
   * Removes all the pairs with the given team.
   * @param team {String} the team slug or ID.
   */
  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  /**
   * Checks to see if the user is in the valid role to execute the ValidatedMethods.
   * @param userId {String} the user ID.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of the TeamChallengeCollection.
 * @type {api/team.TeamChallengeCollection}
 * @memberOf api/team
 */
export const TeamChallenges = new TeamChallengeCollection();
