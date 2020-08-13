import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Developers } from './DeveloperCollection';
import { ROLE } from '../role/Role';

/**
 * DeveloperChallengeCollection a collection of developer-challenge pairs.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class DeveloperChallengeCollection extends BaseCollection {
  constructor() {
    super('DeveloperChallenge', new SimpleSchema({
      challengeID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Creates a new pair.
   * @param challenge {String} the challenge slug or ID.
   * @param developer {String} the developer slug or ID.
   * @return {String} the ID of the pair.
   */
  define({ challenge, developer }) {
    const challengeID = Challenges.getID(challenge);
    const developerID = Developers.getID(developer);
    return this._collection.insert({ challengeID, developerID });
  }

  /**
   * Updates the give pair.
   * @param docID {String} the ID of the pair to update.
   * @param challenge {String} the new challenge slug or ID (optional).
   * @param developer {String} the new developer slug or ID (optional).
   */
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

  /**
   * Removes the given pair.
   * @param docID {String} the ID of the pair.
   * @throws {Meteor.Error} if docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the pairs with the given challenge.
   * @param challenge {String} the challenge slug or ID.
   * @throws {Meteor.Error} if challenge is not defined.
   */
  removeChallenge(challenge) {
    const challengeID = Challenges.getID(challenge);
    this._collection.remove({ challengeID });
  }

  /**
   * Removes all the pairs with the given developer.
   * @param developer {String} the developer slug or ID.
   * @throws {Meteor.Error} if developer is not defined.
   */
  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

/**
 * Singleton instance of the DeveloperChallengeCollection.
 * @type {api/user.DeveloperChallengeCollection}
 * @memberOf api/user
 */
export const DeveloperChallenges = new DeveloperChallengeCollection();
