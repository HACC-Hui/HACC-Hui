import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

/** @namespace api/slug */

/**
 * Slugs are unique strings that can be used to identify entities and can be used in URLs.
 * @extends api/base.BaseCollection
 * @memberOf api/slug
 */
class SlugCollection extends BaseCollection {
  /**
   * Creates the Slug collection.
   */
  constructor() {
    super('Slug', new SimpleSchema({
      name: { type: String },
      entityID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
  }

  /**
   * Creates a new Slug instance and adds it to the collection.
   * @example
   * Slugs.define({ name: 'software-engineering' });
   * @param { String } name The name of the slug. Must be globally unique across all entities.
   * @returns { String } The docID of the created Slug.
   * @throws { Meteor.Error } If the slug already exists.
   */
  define({ name }) {
    check(name, String);
    if (super.isDefined(name)) {
      throw new Meteor.Error(`Attempt to redefine slug: ${name}`, '', Error().stack);
    }
    if (!this.isValidSlugName(name)) {
      throw new Meteor.Error(`Slug is not a-zA-Z0-9 or dash, period, underscore, or @: ${name}`, '', Error().stack);
    }
    const docID = this._collection.insert({ name });
    return docID;
  }

  /**
   * Returns true if slugName is syntactically valid (i.e. consists of a-zA-Z0-9 or dash or underscore.)
   * @param slugName {string} The slug name.
   * @returns {boolean} True if it's OK.
   */
  isValidSlugName(slugName) {
    const slugRegEx = new RegExp('^[a-zA-Z0-9@.]+(?:[_-][a-zA-Z0-9@.]+)*$');
    return (typeof slugName === 'string') && slugName.length > 0 && slugRegEx.test(slugName);
  }

  /**
   * Updates a Slug with the docID of the associated entity.
   * @param { String } slugID The docID of this Slug.
   * @param { String } entityID The docID of the entity to be associated with this Slug.
   */
  updateEntityID(slugID, entityID) {
    this._collection.update(slugID, { $set: { entityID } });
  }

  /**
   * Returns the docID of the entity associated with this Slug.
   * @param { String } slugName The slug name or docID.
   * @returns { String } The docID of the entity.
   * @throws { Meteor.Error } If the slug or entity cannot be found or is the wrong type.
   */
  getEntityID(slugName) {
    if (!this.isDefined(slugName)) {
      console.log('error');
      throw new Meteor.Error(`Undefined slug ${slugName}.`, '', Error().stack);
    }
    console.log('getId', slugName);
    const doc = this.findDoc(slugName);
    console.log('getdoc',doc);
    return doc.entityID;
  }

  /**
   * Returns true if the passed slugID is defined in this collection.
   * In the case of SlugCollection, hasSlug is a synonym for isDefined, and you should use isDefined instead.
   * @param { String } slugID A docID.
   * @returns {boolean} True if the slugID is in this collection.
   */
  hasSlug(slugID) {
    return this.isDefined(slugID);
  }

  /**
   * Returns the slug name associated with this ID.
   * @param slugID The slug ID.
   * @returns The slug name.
   * @throws { Meteor.Error } If the passed slugID is not valid.
   */
  getNameFromID(slugID) {
    this.assertDefined(slugID);
    return this.findDoc(slugID).name;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } docOrID A document or docID in this collection.
   */
  removeIt(docOrID) {
    super.removeIt(docOrID);
  }

  /**
   * Throws an Error if the passed slugName is not a slugName.
   * @param slugName The SlugName
   * @throws { Meteor.Error } If the passed slugName is not a slug name.
   */
  assertSlug(slugName) {
    if (!this._collection.findOne({ name: slugName })) {
      throw new Meteor.Error(`Undefined slug ${slugName}.`, '', Error().stack);
    }
  }

  /**
   * Returns an empty array (no integrity checking done on Slugs.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    return [];
  }

  /**
   * Returns an object representing the passed slug docID in a format acceptable to define().
   * @param docID The docID of a Slug.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { name } = doc;
    return { name };
  }
}

/**
 * Singleton instance of the SlugCollection.
 * @type {api/slug.SlugCollection}
 * @memberOf api/slug
 */
export const Slugs = new SlugCollection();

/**
 * Slugifies the given text. Slugs can be used in URLs.
 * @param text {string} the text to slugify.
 * @return {string} a slugified string.
 * @memberOf api/slug
 */
export function slugify(text) {
  return text.toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
}
