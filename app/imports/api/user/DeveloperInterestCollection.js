import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';

class DeveloperInterestCollection extends BaseCollection {
  constructor() {
    super('DeveloperInterest', new SimpleSchema({
      interestID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  define({ interest, developer }) {
    const interestID = Interests.findIdBySlug(interest);
    const developerID = Developers.findIdBySlug(developer);
    return this._collection.insert({ interestID, developerID });
  }

  update(docID, { interest, developer }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (interest) {
      updateData.interestID = Interests.getID(interest);
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const DeveloperInterests = new DeveloperInterestCollection();
