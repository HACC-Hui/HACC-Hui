import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from './DeveloperCollection';
import { Skills } from '../skill/SkillCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * DeveloperSkillCollection, collection of developer-skill-skillLevel tuples.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class DeveloperSkillCollection extends BaseCollection {
  constructor() {
    super('DeveloperSkill', new SimpleSchema({
      skillID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
      skillLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param skill {String} the skill slug or ID.
   * @param developer {String} the developer slug or ID.
   * @return {String} the ID of the tuple.
   */
  define({ skill, developer }) {
    console.log(skill);
    console.log(developer);
    const skillID = Skills.findIdBySlug(skill);
    const developerID = Developers.findIdBySlug(developer);
    console.log(skillID);
    console.log(developerID);
    return this._collection.insert({ skillID, developerID });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the tuple.
   * @param skill {String} the new skill slug or ID (optional).
   * @param developer {String} the new developer slug or ID (optional).
   * @param skillLevel {String} the new skillLevel (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { skill, developer, skillLevel }) {
    console.log(docID);
    this.assertDefined(docID);
    console.log(skillLevel);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (skill) {
      updateData.skillID = Skills.getID(skill);
    }
    if (skillLevel) {
      console.log(skillLevel);
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
   * Removes all the tuples for the given developer.
   * @param developer {String} the developer slug or ID to remove.
   * @throws {Meteor.Error} if developer is not defined.
   */
  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

/**
 * Singleton instance of the DeveloperSkillCollection.
 * @type {api/user.DeveloperSkillCollection}
 * @memberOf api/user
 */
export const DeveloperSkills = new DeveloperSkillCollection();
