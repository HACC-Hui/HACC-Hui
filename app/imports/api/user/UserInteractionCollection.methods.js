import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserInteractions } from './UserInteractionCollection';

/**
 * The validated method for defining UserInteractions.
 * @param interactionData {Object} the UserInteractions define data.
 * @type {ValidatedMethod}
 * @memberOf api/user
 */
export const userInteractionDefineMethod = new ValidatedMethod({
  name: 'UserInteraction.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(interactionData) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    return UserInteractions.define(interactionData);
  },
});

/**
 * The validated method for removing UserInteractions.
 * @param username {String} the name of the user to remove.
 * @type {ValidatedMethod}
 * @memberOf api/user
 */
export const userInteractionRemoveUserMethod = new ValidatedMethod({
  name: 'UserInteraction.removeUser',
  validate: null,
  mixins: [CallPromiseMixin],
  run(username) {
    UserInteractions.assertAdminRoleForMethod(this.userId);
    return UserInteractions.removeUser(username);
  },
});

/**
 * The validated method for finding UserInteractions.
 * @param selector {Object} the find selector.
 * @param options {Object} the find options.
 * @type {ValidatedMethod}
 * @memberOf api/user
 */
export const userInteractionFindMethod = new ValidatedMethod({
  name: 'UserInteraction.find',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ selector, options }) {
    UserInteractions.assertAdminRoleForMethod(this.userId);
    const results = UserInteractions.find(selector, options);
    return results.fetch();
  },
});

export const deleteAccountMethod = new ValidatedMethod({
  name: 'Users.deleteAccount',
  validate: null,
  mixins: [CallPromiseMixin],
  run() {
    try {
      Meteor.users.remove(this.userId);
    } catch (e) {
      throw new Meteor.Error('user-delete', 'Failed to remove your account');
    }
  },
});
