import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class CanChangeChallengeCollection extends BaseCollection {
  constructor() {
    super('CanChangeChallenge', new SimpleSchema({
      canChangeChallenges: { type: Boolean },
    }));
  }

  /**
   * Defines the state for creating teams.
   * @param canChangeChallenges {Boolean} the state for creating teams (optional defaults to true).
   */
  define({ canChangeChallenges = true }) {
    return this._collection.insert({ canChangeChallenges });
  }

  update(docID, { canChangeChallenges }) {
    // console.log('CanChangeChallenges.update', docID, canChangeChallenges);
    this.assertDefined(docID);
    const updateData = {
      canChangeChallenges,
    };
    this._collection.update(docID, { $set: updateData });
  }
}

export const CanChangeChallenges = new CanChangeChallengeCollection();
