import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { HACCHui } from '../hacc-hui/HACCHui';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the HACC-Hui database.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'base.dumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..');
    } else {
      const profile = Users.getProfile(this.userId);
      if (profile.role !== ROLE.ADMIN) {
        throw new Meteor.Error('unauthorized', 'You must be an admin to dump the database.');
      }
    }
    // Don't do the dump except on server side (disable client-side simulation).
    // Return an object with fields timestamp and collections.
    if (Meteor.isServer) {
      const collections = _.sortBy(HACCHui.collectionLoadSequence.map((collection) => collection.dumpAll()),
          (entry) => entry.name);
      const timestamp = new Date();
      return { timestamp, collections };
    }
    return null;
  },
});

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const defineMethod = new ValidatedMethod({
  name: 'BaseCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, definitionData }) {
    console.log(collectionName, this.userId, definitionData);
    const collection = HACCHui.getCollection(collectionName);
    console.log('    const collection = HACCHui.getCollection(collectionName);')
    collection.assertValidRoleForMethod(this.userId);
    console.log('collection.assertValidRoleForMethod(this.userId);')

    return collection.define(definitionData);
  },
});

/**
 * Meteor method used to update a document in the given collection.
 * @param collectionName the name of the collection to update.
 * @param updateData an object containing the document ID and the update data.
 * @type {ValidatedMethod}
 * @memberOf api/base
 */
export const updateMethod = new ValidatedMethod({
  name: 'BaseCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, updateData }) {
    // console.log('updateMethod(%o, %o)', collectionName, updateData);
    const collection = HACCHui.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.update(updateData.id, updateData);
    return true;
  },
});

/**
 * Meteor method used to remove a document from a collection.
 * @param collectionName the name of the collection.
 * @param instance the document ID to remove.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const removeItMethod = new ValidatedMethod({
  name: 'BaseCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, instance }) {
    const collection = HACCHui.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.removeIt(instance);
    return true;
  },
});
