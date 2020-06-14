import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Tools } from '../tool/ToolCollection';
import { Teams } from './TeamCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

class TeamToolCollection extends BaseCollection {
  constructor() {
    super('TeamTool', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      toolID: { type: SimpleSchema.RegEx.Id },
      toolLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  define({ team, tool }) {
    const teamID = Teams.findIdBySlug(team);
    const toolID = Tools.findIdBySlug(tool);
    return this._collection.insert({ teamID, toolID });
  }

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

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  removeTool(tool) {
    const toolID = Tools.getID(tool);
    this._collection.remove({ toolID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const TeamTools = new TeamToolCollection();
