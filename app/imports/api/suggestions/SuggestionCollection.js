import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import BaseCollection from '../base/BaseCollection';

/** @namespace api/skill */

/**
 * Represents a specific Skill, such as "Software Engineering".
 * @extends api/base.BaseSlugCollection
 * @memberOf api/skill
 */
class SuggestionCollection extends BaseCollection {
  /**
   * Creates the Skill collection.
   */
  constructor() {
    super('Suggestion', new SimpleSchema({
      username: { type: String },
      name: { type: String },
      type: { type: String },
      description: { type: String },
    }));
  }

  /**
   * Defines a new Skill and its associated Slug.
   * Slug must be previously undefined.
   * @throws {Meteor.Error} If the Skill definition includes a defined slug.
   * @returns The newly created docID.
   */
  define({
           username, name, type,
           description,
         }) {
    // Define the Skill and get its ID
    const SuggestionID = this._collection.insert({
      username, name, type, description,
    });
    return SuggestionID;
  }

  /**
   * Update an Skill.
   * @param docID The docID to be updated.
   * @param name The new name (optional).
   * @param description The new description (optional).
   * @throws { Meteor.Error } If docID is not defined.
   */
  update(docID, {
    name, type, description,
  }) {
    this.assertDefined(docID);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (type) {
      updateData.type = type;
    }
    this._collection.update(docID, { $set: updateData });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

  /**
   * Remove the Skill.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If Skill is associated with any Challenge.
   */
  removeIt(instance) {
    super.removeIt(instance);
  }

  /**
   * Returns an object representing the given Skill.
   * @param docID {string} the ID of the Skill.
   * @return {{name: *, description: *}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { username, name, type, description } = doc;
    return { username, name, type, description };
  }
}

/**
 * Singleton instance of the SkillCollection.
 * @type {api/skill.SkillCollection}
 * @memberOf api/skill
 */
export const Suggestions = new SuggestionCollection();
