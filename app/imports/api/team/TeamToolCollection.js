import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Tools } from '../tool/ToolCollection';
import { Teams } from './TeamCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * TeamToolCollection holds team, tool, and toolLevel tuples.
 * @memberOf api/team
 * @extends api/base.BaseCollection
 */
class TeamToolCollection extends BaseCollection {
  constructor() {
    super('TeamTool', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      toolID: { type: SimpleSchema.RegEx.Id },
      toolLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param team {String} the team slug or ID.
   * @param tool {String} the tool slug or ID.
   * @param toolLevel {String} one of the valid tool levels, optional.
   * @return {String} the ID of the new tuple.
   */
  define({ team, tool, toolLevel }) {
    // console.log('TeamTools.define', team, tool, toolLevel);
    const teamID = Teams.findIdBySlug(team);
    const toolID = Tools.findIdBySlug(tool);
    return this._collection.insert({ teamID, toolID, toolLevel });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the tuple to update.
   * @param team {String} the new team slug or ID (optional).
   * @param tool {String} the new tool slug or ID (optional).
   * @param toolLevel {String} the new tool level (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { team, tool, toolLevel }) {
    this.assertDefined(docID);
    const updateData = {};
    if (tool) {
      updateData.toolID = Tools.getID(tool);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
    }
    if (toolLevel) {
      updateData.toolLevel = toolLevel;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the tuple.
   * @param docID {String} the ID of the tuple to remove.
   * @throws {Meteor.Error} if docID is not defined.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Remove all tuples for the given team.
   * @param team {String} the team's slug or ID.
   * @throws {Meteor.Error} if the team is not defined.
   */
  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  /**
   * Remove all tuples for the given tool.
   * @param tool {String} the tool's slug or ID.
   * @throws {Meteor.Error} if the tool is not defined.
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
 * Singleton instance of TeamToolCollection.
 * @type {api/team.TeamToolCollection}
 * @memberOf api/team
 */
export const TeamTools = new TeamToolCollection();
