import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Users } from './UserCollection';

/**
 * Meteor method used to define new instances of Stuff.
 * @param definitionData {Object} the object used in the Stuffs.define method.
 * @memberOf api/stuff
 * @type {ValidatedMethod}
 */
export const usersDeleteMethod = new ValidatedMethod({
  name: 'UserCollection.deleteProfile',
  mixins: [CallPromiseMixin],
  validate: null,
  run(user) {
    console.log(user);
    if (Meteor.isServer) {
      const res = Users.deleteProfile(user);
      return res;
    }
    return '';
  },
});
