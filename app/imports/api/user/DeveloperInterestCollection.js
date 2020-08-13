import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';

/**
 * DeveloperInterestCollection, collection of developer-interest pairs.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class DeveloperInterestCollection extends BaseCollection {
  constructor() {
    super('DeveloperInterest', new SimpleSchema({
      interestID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines a new pair.
   * @param interest {String} the interest slug or ID.
   * @param developer {String} the developer slug or ID.
   * @return {String} the ID of the pair.
   */
  define({ interest, developer }) {
    const interestID = Interests.findIdBySlug(interest);
    const developerID = Developers.findIdBySlug(developer);
    return this._collection.insert({ interestID, developerID });
  }

  /**
   * Updates the given pair.
   * @param docID {String} the ID of the pair to update.
   * @param interest {String} the new interest slug or ID.
   * @param developer {String} the new developer slug or ID.
   * @throws {Meteor.Error} if docID is not defined.
   */
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

  /**
   * Removes the pair.
   * @param docID {String} the ID of the pair to remove.
   * @throws {Meteor.Error} if docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all pairs for the given developer.
   * @param developer {String} the developer slug or ID.
   * @throws {Meteor.Error} if developer is not defined.
   */
  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  /**
   * Removes all pairs for the given interest.
   * @param interest {String} the interest slug or ID.
   * @throws {Meteor.Error} if interest is not defined.
   */
  removeInterest(interest) {
    const interestID = Interests.getID(interest);
    this._collection.remove({ interestID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

/**
 * Singleton instance of DeveloperInterestCollection
 * @type {api/user.DeveloperInterestCollection}
 * @memberOf api/user
 */
export const DeveloperInterests = new DeveloperInterestCollection();
