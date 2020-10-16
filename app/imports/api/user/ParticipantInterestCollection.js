import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Participants } from './ParticipantCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';

/**
 * ParticipantInterestCollection, collection of participant-interest pairs.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class ParticipantInterestCollection extends BaseCollection {
  constructor() {
    super('ParticipantInterest', new SimpleSchema({
      interestID: { type: SimpleSchema.RegEx.Id },
      participantID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines a new pair.
   * @param interest {String} the interest slug or ID.
   * @param participant {String} the participant slug or ID.
   * @return {String} the ID of the pair.
   */
  define({ interest, participant }) {
    const interestID = Interests.findIdBySlug(interest);
    const participantID = Participants.findIdBySlug(participant);
    return this._collection.insert({ interestID, participantID });
  }

  /**
   * Updates the given pair.
   * @param docID {String} the ID of the pair to update.
   * @param interest {String} the new interest slug or ID.
   * @param participant {String} the new participant slug or ID.
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { interest, participant }) {
    this.assertDefined(docID);
    const updateData = {};
    if (participant) {
      updateData.participantID = Participants.getID(participant);
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
   * Removes all pairs for the given participant.
   * @param participant {String} the participant slug or ID.
   * @throws {Meteor.Error} if participant is not defined.
   */
  removeParticipant(participant) {
    const participantID = Participants.getID(participant);
    this._collection.remove({ participantID });
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of ParticipantInterestCollection
 * @type {api/user.ParticipantInterestCollection}
 * @memberOf api/user
 */
export const ParticipantInterests = new ParticipantInterestCollection();
