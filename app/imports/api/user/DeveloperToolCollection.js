import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Tools } from '../tool/ToolCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * DeveloperToolCollection, collection of developer-tool-toolLevel tuples.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class DeveloperToolCollection extends BaseCollection {
  constructor() {
    super('DeveloperTool', new SimpleSchema({
      toolID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
      toolLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param tool {String} tool slug or ID.
   * @param developer {String} developer slug or ID.
   * @return {String} the ID of the new tuple.
   */
  define({ tool, developer }) {
    const toolID = Tools.findIdBySlug(tool);
    const developerID = Developers.findIdBySlug(developer);
    return this._collection.insert({ toolID, developerID });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the tuple to update.
   * @param tool {String} the new tool slug or ID (optional).
   * @param developer {String} the new developer slug or ID (optional).
   * @param toolLevel {String} the new toolLevel (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { tool, developer, toolLevel }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
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
   * Removes all tuples for the given developer.
   * @param developer {String} the developer slug or ID.
   * @throws {Meteor.Error} if developer is not defined.
   */
  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

/**
 * Singleton instance of DeveloperToolCollection.
 * @type {api/user.DeveloperToolCollection}
 * @memberOf api/user
 */
export const DeveloperTools = new DeveloperToolCollection();
