import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from './ChallengeCollection';
import { Interests } from '../interest/InterestCollection';

/**
 * ChallengeInterestsCollections maps the Interests to the Challenges.
 * @memberOf api/challenge
 * @extends api/base.BaseCollection
 */
class ChallengeInterestCollection extends BaseCollection {
  /**
   * Creates the ChallengeInterest collection.
   */
  constructor() {
    super('ChallengeInterest', new SimpleSchema({
      challengeID: { type: SimpleSchema.RegEx.Id },
      interestID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines a link between the challenge and the interest.
   * @param challenge {string} the challenge slug or id.
   * @param interest {string} the interest slug or id.
   * @return {string} The id of the record.
   */
  define({ challenge, interest }) {
    console.log('  define({ challenge, interest }) {');
    console.log(challenge);
    console.log(interest);
    const challengeID = Challenges.getID(challenge);
    const interestID = Interests.findIdBySlug(interest);
    const docID = this._collection.insert({ challengeID, interestID });
    return docID;
  }

  /**
   * Updates the Challenge-Interest pair.
   * @param docID {string} the id of the record.
   * @param challenge {string} the challenge slug or ID, optional.
   * @param interest {string} the interest slug or ID, optional.
   */
  update(docID, { challenge, interest }) {
    this.assertDefined(docID);
    const updateData = {};
    if (challenge) {
      updateData.challengeID = Challenges.getID(challenge);
    }
    if (interest) {
      updateData.interestID = Interests.getID(interest);
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the Challenge-Interest pair.
   * @param docID {string} the id of the pair.
   * @throws {Meteor.Exception} if the docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the Challenge-Interest pairs for the given challenge.
   * @param challenge {string} the challenge slug or ID.
   */
  removeChallenge(challenge) {
    const challengeID = Challenges.getID(challenge);
    this._collection.remove({ challengeID });
  }

  /**
   * Removes all the Challenge-Interest pairs for the given interest.
   * @param interest {string} the interest slug or ID.
   */
  removeInterest(interest) {
    const interestID = Interests.getID(interest);
    this._collection.remove({ interestID });
  }
}

/**
 * Singleton instance of the ChallengeInterestCollection.
 * @type {ChallengeInterestCollection}
 * @memberOf api/challenge
 */
export const ChallengeInterests = new ChallengeInterestCollection();
