import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Participants } from './ParticipantCollection';
import { ROLE } from '../role/Role';

/**
 * ParticipantChallengeCollection a collection of participant-challenge pairs.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class ParticipantChallengeCollection extends BaseCollection {
  constructor() {
    super('ParticipantChallenge', new SimpleSchema({
      challengeID: { type: SimpleSchema.RegEx.Id },
      participantID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Creates a new pair.
   * @param challenge {String} the challenge slug or ID.
   * @param participant {String} the participant slug or ID.
   * @return {String} the ID of the pair.
   */
  define({ challenge, participant }) {
    const challengeID = Challenges.getID(challenge);
    const participantID = Participants.getID(participant);
    return this._collection.insert({ challengeID, participantID });
  }

  /**
   * Updates the give pair.
   * @param docID {String} the ID of the pair to update.
   * @param challenge {String} the new challenge slug or ID (optional).
   * @param participant {String} the new participant slug or ID (optional).
   */
  update(docID, { challenge, participant }) {
    this.assertDefined(docID);
    const updateData = {};
    if (participant) {
      updateData.participantID = Participants.getID(participant);
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
   * Removes all the pairs with the given participant.
   * @param participant {String} the participant slug or ID.
   * @throws {Meteor.Error} if participant is not defined.
   */
  removeParticipant(participant) {
    const participantID = Participants.getID(participant);
    this._collection.remove({ participantID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of the ParticipantChallengeCollection.
 * @type {api/user.ParticipantChallengeCollection}
 * @memberOf api/user
 */
export const ParticipantChallenges = new ParticipantChallengeCollection();
