import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Skills } from '../skill/SkillCollection';
import { skillAndToolLevels } from '../level/Levels';

class DeveloperSkillCollection extends BaseCollection {
  constructor() {
    super('DeveloperSkill', new SimpleSchema({
      skillID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
      skillLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  define({ skill, developer }) {
    const skillID = Skills.findIdBySlug(skill);
    const developerID = Developers.findIdBySlug(developer);
    return this._collection.insert({ skillID, developerID });
  }

  update(docID, { skill, developer, skillLevel }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (skill) {
      updateData.skillID = Skills.getID(skill);
    }
    if (skillLevel) {
      updateData.skillLevel = skillLevel;
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

  removeSkill(skill) {
    const skillID = Skills.getID(skill);
    this._collection.remove({ skillID });
  }
}

export const DeveloperSkills = new DeveloperSkillCollection();
