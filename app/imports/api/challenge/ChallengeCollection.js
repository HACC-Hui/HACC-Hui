import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import { ChallengeInterests } from './ChallengeInterestCollection';
import { Interests } from '../interest/InterestCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import slugify, { Slugs } from '../slug/SlugCollection';

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

  define({ title, description, interests, submissionDetail, pitch }) {
    const docs = this.find({ title, description, submissionDetail, pitch }).fetch();
    if (docs && docs.length > 0) {
      const challengeID = docs[0]._id;
      const cis = _.map(ChallengeInterests.find({ challengeID }).fetch(), (ci) => ci.interestID);
      const interestIDs = Interests.getIDs(interests);
      if (cis.length === interestIDs.length) {
        let same = true;
        _.each(cis, (ci) => {
          if (!_.includes(interestIDs, ci)) {
            same = false;
          }
        });
        if (same) {
          // console.log('the same');
          return challengeID;
        }
      }
    }
    const challenge = slugify(title);
    const slugID = Slugs.define({ name: challenge });
    const challengeID = this._collection.insert({ title, slugID, description, submissionDetail, pitch });
    // Connect the Slug to this Challenge
    Slugs.updateEntityID(slugID, challengeID);
    _.each(interests, (interest) => ChallengeInterests.define({ challenge, interest }));
    return challengeID;
  }

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
      _.each(oldInterests, (old) => ChallengeInterests.removeIt(old._id));
      // add the new interests
      _.each(interestIDs, (interestID) => {
        const interest = Interests.findSlugByID(interestID);
        ChallengeInterests.define({ challengeName, interest });
      });
    }
  }

  removeIt(docID) {
    const challengeInterests = ChallengeInterests.find({ challengeID: docID }).fetch();
    _.each(challengeInterests, (ci) => {
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

export const Challenges = new ChallengeCollection();
