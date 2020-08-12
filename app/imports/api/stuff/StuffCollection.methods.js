import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Stuffs } from './StuffCollection';

/**
 * Meteor method used to define new instances of Stuff.
 * @param definitionData {Object} the object used in the Stuffs.define method.
 * @memberOf api/stuff
 * @type {ValidatedMethod}
 */
export const stuffDefineMethod = new ValidatedMethod({
  name: 'StuffCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('stuffDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Stuffs.define(definitionData);
      // console.log(`stuffDefineMethod returning ${docID}. Now have ${Stuffs.count()}`);
      return docID;
    }
    return '';
  },
});

/**
 * Meteor method for updating a given stuff instance.
 * @param updateData {Object} an Object with .id and the update data.
 * @type {ValidatedMethod}
 * @memberOf api/stuff
 */
export const stuffUpdateMethod = new ValidatedMethod({
  name: 'StuffCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run(updateData) {
    Stuffs.update(updateData.id, updateData);
    return true;
  },
});

/**
 * Meteor method to remove an instance of Stuff.
 * @type {ValidatedMethod}
 * @memberOf api/stuff
 */
export const stuffRemoveItMethod = new ValidatedMethod({
  name: 'StuffCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    return Stuffs.removeIt(instance);
  },
});
