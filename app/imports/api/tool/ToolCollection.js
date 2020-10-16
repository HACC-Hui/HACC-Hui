import SimpleSchema from 'simpl-schema';
import { slugify, Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';

/** @namespace api/tool */

/**
 * Represents a specific Tool, such as Java, Postgres, etc.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/tool
 */
class ToolCollection extends BaseSlugCollection {
  /**
   * Creates the Tool collection.
   */
  constructor() {
    super('Tool', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
    }));
  }

  /**
   * Defines a new Tool and its associated Slug.
   * @example
   * Tools.define({ name: 'Java',
   *                    description: 'The Java programming language.',
   * });
   * @param { Object } description Object with keys name, slug, description.
   * Slug must be previously undefined.
   * @throws {Meteor.Error} If the Tool definition includes a defined slug.
   * @returns The newly created docID.
   */
  define({
           name,
           description,
         }) {
    const slug = slugify(name);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug });
    // Define the Tool and get its ID
    const ToolID = this._collection.insert({
      name, description, slugID,
    });
    // Connect the Slug to this Tool
    Slugs.updateEntityID(slugID, ToolID);
    return ToolID;
  }

  /**
   * Update an Tool.
   * @param docID {String} The docID to be updated.
   * @param name {String} The new name (optional).
   * @param description {String} The new description (optional).
   * @throws { Meteor.Error } If docID is not defined.
   */
  update(docID, {
    name, description,
  }) {
    this.assertDefined(docID);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Tool.
   * @param instance {String} The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If Tool is associated with any Challenge.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    // Check that this Tool is not referenced by any Team, Participant, or Challenge.

    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Returns an object representing the Tool.
   * @param docID {String} the ID of the tool.
   * @return {{name: *, description: *}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { name, description } = doc;
    return { name, description };
  }
}

/**
 * Singleton instance of the ToolCollection.
 * @type {api/tool.ToolCollection}
 * @memberOf api/tool
 */
export const Tools = new ToolCollection();
