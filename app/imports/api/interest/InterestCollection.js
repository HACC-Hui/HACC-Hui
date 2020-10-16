import SimpleSchema from 'simpl-schema';
import { slugify, Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';

/** @namespace api/interest */

/**
 * Represents a specific interest, such as "Sustainability".
 * @extends api/base.BaseSlugCollection
 * @memberOf api/interest
 */
class InterestCollection extends BaseSlugCollection {
  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Interest', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
    }));
  }

  /**
   * Defines a new Interest and its associated Slug.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems',
   * });
   * @param { Object } description Object with keys name, slug, description.
   * Slug must be previously undefined.
   * @throws {Meteor.Error} If the interest definition includes a defined slug.
   * @returns {string} The newly created docID.
   */
  define({
           name,
           description,
         }) {
    const slug = slugify(name); // we automatically build the slug from the name.
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug });
    // Define the Interest and get its ID
    const interestID = this._collection.insert({
      name, description, slugID,
    });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
    return interestID;
  }

  /**
   * Update an Interest.
   * @param docID {string} The docID to be updated.
   * @param name {string} The new name (optional).
   * @param description {string} The new description (optional).
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
   * Remove the Interest.
   * @param instance {string} The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If Interest is associated with any Challenge.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    // Check that this interest is not referenced by any Team, Participant, or Challenge.

    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Returns an object representing the given interest.
   * @param docID {string} the ID to get.
   * @return {{name: *, description: *}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { name, description } = doc;
    return { name, description };
  }
}

/**
 * Singleton instance of the InterestCollection.
 * @type {api/interest.InterestCollection}
 * @memberOf api/interest
 */
export const Interests = new InterestCollection();
