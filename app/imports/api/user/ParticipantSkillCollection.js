import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Participants } from './ParticipantCollection';
import { Skills } from '../skill/SkillCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * ParticipantSkillCollection, collection of participant-skill-skillLevel tuples.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class ParticipantSkillCollection extends BaseCollection {
  constructor() {
    super('ParticipantSkill', new SimpleSchema({
      skillID: { type: SimpleSchema.RegEx.Id },
      participantID: { type: SimpleSchema.RegEx.Id },
      skillLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param skill {String} the skill slug or ID.
   * @param participant {String} the participant slug or ID.
   * @param skillLevel {String} one of the valid skill levels, optional.
   * @return {String} the ID of the tuple.
   */
  define({ skill, participant, skillLevel }) {
    // console.log('ParticipantSkills.define', skill, participant, skillLevel);
    const skillID = Skills.findIdBySlug(skill);
    const participantID = Participants.findIdBySlug(participant);
    return this._collection.insert({ skillID, participantID, skillLevel });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the tuple.
   * @param skill {String} the new skill slug or ID (optional).
   * @param participant {String} the new participant slug or ID (optional).
   * @param skillLevel {String} the new skillLevel (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { skill, participant, skillLevel }) {
    this.assertDefined(docID);
    const updateData = {};
    if (participant) {
      updateData.participantID = Participants.getID(participant);
    }
    if (skill) {
      updateData.skillID = Skills.getID(skill);
    }
    if (skillLevel) {
      updateData.skillLevel = skillLevel;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the tuple.
   * @param docID {String} the ID of the tuple.
   * @throws {Meteor.Error} if docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the tuples for the given participant.
   * @param participant {String} the participant slug or ID to remove.
   * @throws {Meteor.Error} if participant is not defined.
   */
  removeParticipant(participant) {
    const participantID = Participants.getID(participant);
    this._collection.remove({ participantID });
  }

  /**
   * Removes all the tuples for the given skill.
   * @param skill {String} the skill slug or ID to remove.
   * @throws {Meteor.Error} if skill is not defined.
   */
  removeSkill(skill) {
    const skillID = Skills.getID(skill);
    this._collection.remove({ skillID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of the ParticipantSkillCollection.
 * @type {api/user.ParticipantSkillCollection}
 * @memberOf api/user
 */
export const ParticipantSkills = new ParticipantSkillCollection();
