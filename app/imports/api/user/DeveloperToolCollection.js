import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Tools } from '../tool/ToolCollection';
import { skillAndToolLevels } from '../level/Levels';

class DeveloperToolCollection extends BaseCollection {
  constructor() {
    super('DeveloperTool', new SimpleSchema({
      toolID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
      toolLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  define({ tool, developer }) {
    const toolID = Tools.findIdBySlug(tool);
    const developerID = Developers.findIdBySlug(developer);
    return this._collection.insert({ toolID, developerID });
  }

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

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  removeTool(tool) {
    const toolID = Tools.getID(tool);
    this._collection.remove({ toolID });
  }
}

export const DeveloperTools = new DeveloperToolCollection();
