import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from './ChallengeCollection';
import { Interests } from '../interest/InterestCollection';

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

  define({ challenge, interest }) {
    const challengeID = Challenges.getID(challenge);
    const interestID = Interests.findIdBySlug(interest);
    const docID = this._collection.insert({ challengeID, interestID });
    return docID;
  }

  /**
   * Updates the Challenge-Interest pair.
   * @param docID the id of the record.
   * @param challenge the challenge slug or ID.
   * @param interest the interest slug or ID.
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

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeChallenge(challenge) {
    const challengeID = Challenges.getID(challenge);
    this._collection.remove({ challengeID });
  }

  removeInterest(interest) {
    const interestID = Interests.getID(interest);
    this._collection.remove({ interestID });
  }
}

/**
 * Provides the singleton instance of the ChallengeInterestCollection.
 * @type {ChallengeInterestCollection}
 */
export const ChallengeInterests = new ChallengeInterestCollection();
