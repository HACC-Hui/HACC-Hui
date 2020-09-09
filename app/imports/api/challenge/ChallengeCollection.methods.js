import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Challenges } from './ChallengeCollection';

/**
 * Meteor method used to define new instances of Stuff.
 * @param definitionData {Object} the object used in the Stuffs.define method.
 * @memberOf api/stuff
 * @type {ValidatedMethod}
 */
export const challengeDefineMethod = new ValidatedMethod({
  name: 'ChallengeCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    console.log('challengeDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Challenges.define(definitionData);
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
export const challengeUpdateMethod = new ValidatedMethod({
  name: 'ChallengeCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run(updateData) {
    Challenges.update(updateData.id, updateData);
    return true;
  },
});

/**
 * Meteor method to remove an instance of Stuff.
 * @type {ValidatedMethod}
 * @memberOf api/stuff
 */
export const challengeRemoveItMethod = new ValidatedMethod({
  name: 'ChallengeCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    return Challenges.removeIt(instance);
  },
});
