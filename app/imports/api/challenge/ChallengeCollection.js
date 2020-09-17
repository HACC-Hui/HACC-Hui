import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { ChallengeInterests } from './ChallengeInterestCollection';
import { Interests } from '../interest/InterestCollection';
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
      submissionDetail: { type: String },
      pitch: { type: String },
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
    console.log('define()');
    console.log(description);
    const docs = this.find({ title, description, submissionDetail, pitch }).fetch();
    console.log(`docs = ${docs}`);
    console.log(docs);
    if (docs && docs.length > 0) {
      console.log('    if (docs && docs.length > 0) {');
      const challengeID = docs[0]._id;
      const cis = _.map(ChallengeInterests.find({ challengeID }).fetch(), (ci) => ci.interestID);
      const interestIDs = Interests.getIDs(interests);
      if (cis.length === interestIDs.length) {
        console.log('if (cis.length === interestIDs.length) {');
        let same = true;
        _.forEach(cis, (ci) => {
          if (!_.includes(interestIDs, ci)) {
            same = false;
          }
        });
        if (same) {
          console.log('the same');
          return challengeID;
        }
      }
    }
    const challenge = slugify(title);
    console.log('const challenge = slugify(title);');
    const slugID = Slugs.define({ name: challenge });
    console.log('const slugID = Slugs.define({ name: challenge });');
    console.log(`slugID = ${slugID}`);
    const challengeID = this._collection.insert({ title, slugID, description, submissionDetail, pitch });
    console.log('const challengeID = this._collection.insert({ title, slugID, description, submissionDetail, pitch });');
    // Connect the Slug to this Challenge
    Slugs.updateEntityID(slugID, challengeID);
    _.forEach(interests, (interest) => ChallengeInterests.define({ challenge, interest }));
    return challengeID;
  }

  /**
   * Updates the given challenge.
   * @param docID {string} the docID of the challenge to update.
   * @param description {string} the new description, optional.
   * @param interestIDs {string[]} the new interest slugs, optional.
   * @param submissionDetail {string} the new submission details, optional.
   * @param pitch {string} the new pitch URL, optional.
   */
  update(docID, { description, interestIDs, submissionDetail, pitch }) {
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
    this._collection.update(docID, { $set: updateData });
    if (interestIDs && interestIDs.length > 0) {
      const challengeName = this.findDoc(docID).title;
      // remove the old interests
      const oldInterests = ChallengeInterests.find({ challengeID: docID }).fetch();
      _.forEach(oldInterests, (old) => ChallengeInterests.removeIt(old._id));
      // add the new interests
      _.forEach(interestIDs, (interestID) => {
        const interest = Interests.findSlugByID(interestID);
        ChallengeInterests.define({ challengeName, interest });
      });
    }
  }

  removeIt(docID) {
    const challengeInterests = ChallengeInterests.find({ challengeID: docID }).fetch();
    _.forEach(challengeInterests, (ci) => {
      ChallengeInterests.removeIt(ci._id);
    });
    super.removeIt(docID);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { title, description, submissionDetails, pitch } = doc;
    const challengeInterests = ChallengeInterests.find({ challengeID: docID }).fetch();
    const interests = _.map(challengeInterests, (ci) => Interests.findSlugByID(ci.interestID));
    return { title, description, interests, submissionDetails, pitch };
  }
}

/**
 * Singleton instance of the ChallengeCollection.
 * @type {api/challenge.ChallengeCollection}
 * @memberOf api/challenge
 */
export const Challenges = new ChallengeCollection();
