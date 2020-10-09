import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { slugify, Slugs } from '../slug/SlugCollection';

/** @namespace api/challenge */

/**
 * ChallengeCollection holds all the HACC-Hui challenges.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/challenge
 */
class ChallengeCollection extends BaseSlugCollection {
  constructor() {
    super('Challenge', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      interests: { type: Array },
      'interests.$': { type: String },
      submissionDetail: { type: String },
      pitch: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new challenge.
   * @param title {string} the challenge's title.
   * @param description {string} the challenge's description.
   * @param interests {string[]} the interest slugs associated with the challenge.
   * @param submissionDetail {string} the submission details.
   * @param pitch {string} the URL to the pitch.
   * @return {string} the id of the new challenge.
   */
  define({ title, description, interests, submissionDetail, pitch }) {
    const docs = this.find({ title, description, submissionDetail, pitch }).fetch();
    if (docs && docs.length > 0) {
      const challengeID = docs[0]._id;
      return challengeID;
    }
    const challenge = slugify(title);
    const slugID = Slugs.define({ name: challenge });
    const challengeID = this._collection.insert({ title, slugID, description, submissionDetail, pitch, interests });
    // Connect the Slug to this Challenge
    Slugs.updateEntityID(slugID, challengeID);
    return challengeID;
  }

  /**
   * Updates the given challenge.
   * @param docID {string} the docID of the challenge to update.
   * @param description {string} the new description, optional.
   * @param interests {string[]} the new interest slugs, optional.
   * @param submissionDetail {string} the new submission details, optional.
   * @param pitch {string} the new pitch URL, optional.
   */
  update(docID, { description, interests, submissionDetail, pitch }) {
    this.assertDefined(docID);
    const updateData = {};
    if (description) {
      updateData.description = description;
    }
    if (submissionDetail) {
      updateData.submissionDetail = submissionDetail;
    }
    if (pitch) {
      updateData.pitch = pitch;
    }
    if (interests) {
      updateData.interests = interests;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(docID) {
    super.removeIt(docID);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { title, description, submissionDetail, pitch, interests } = doc;
    return { title, description, interests, submissionDetail, pitch };
  }
}

/**
 * Singleton instance of the ChallengeCollection.
 * @type {api/challenge.ChallengeCollection}
 * @memberOf api/challenge
 */
export const Challenges = new ChallengeCollection();
