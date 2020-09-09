import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Tools } from './ToolCollection';

/**
 * Meteor method used to define new instances of Stuff.
 * @param definitionData {Object} the object used in the Stuffs.define method.
 * @memberOf api/stuff
 * @type {ValidatedMethod}
 */
export const toolDefineMethod = new ValidatedMethod({
  name: 'ToolCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    console.log('toolDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Tools.define(definitionData);
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
export const toolUpdateMethod = new ValidatedMethod({
  name: 'ToolCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run(updateData) {
    Tools.update(updateData.id, updateData);
    return true;
  },
});

/**
 * Meteor method to remove an instance of Stuff.
 * @type {ValidatedMethod}
 * @memberOf api/stuff
 */
export const toolRemoveItMethod = new ValidatedMethod({
  name: 'ToolCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    return Tools.removeIt(instance);
  },
});
