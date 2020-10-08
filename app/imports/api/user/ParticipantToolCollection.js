import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Participants } from './ParticipantCollection';
import { Tools } from '../tool/ToolCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * ParticipantToolCollection, collection of participant-tool-toolLevel tuples.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class ParticipantToolCollection extends BaseCollection {
  constructor() {
    super('ParticipantTool', new SimpleSchema({
      toolID: { type: SimpleSchema.RegEx.Id },
      participantID: { type: SimpleSchema.RegEx.Id },
      toolLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param tool {String} tool slug or ID.
   * @param participant {String} participant slug or ID.
   * @param toolLevel {String} one of the valid tool levels, optional.
   * @return {String} the ID of the new tuple.
   */
  define({ tool, participant, toolLevel }) {
    const toolID = Tools.findIdBySlug(tool);
    const participantID = Participants.findIdBySlug(participant);
    return this._collection.insert({ toolID, participantID, toolLevel });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the tuple to update.
   * @param tool {String} the new tool slug or ID (optional).
   * @param participant {String} the new participant slug or ID (optional).
   * @param toolLevel {String} the new toolLevel (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { tool, participant, toolLevel }) {
    // console.log('ParticipantTool.update', tool, participant, toolLevel);
    this.assertDefined(docID);
    const updateData = {};
    if (participant) {
      updateData.participantID = Participants.getID(participant);
    }
    if (tool) {
      updateData.toolID = Tools.getID(tool);
    }
    if (toolLevel) {
      updateData.toolLevel = toolLevel;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the tuple.
   * @param docID {String} the ID to remove.
   * @throws {Meteor.Error} if docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all tuples for the given participant.
   * @param participant {String} the participant slug or ID.
   * @throws {Meteor.Error} if participant is not defined.
   */
  removeParticipant(participant) {
    const participantID = Participants.getID(participant);
    this._collection.remove({ participantID });
  }

  /**
   * Removes all tuples for the given tool.
   * @param tool {String} the tool slug or ID.
   * @throws {Meteor.Error} if tool is not defined.
   */
  removeTool(tool) {
    const toolID = Tools.getID(tool);
    this._collection.remove({ toolID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of ParticipantToolCollection.
 * @type {api/user.ParticipantToolCollection}
 * @memberOf api/user
 */
export const ParticipantTools = new ParticipantToolCollection();
