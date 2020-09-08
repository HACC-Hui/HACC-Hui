import { Meteor } from 'meteor/meteor';

const accountDeleteMethod = 'Account.delete';

Meteor.methods({
    'Account.delete'() {
    if (!Meteor.isServer) return;

    try {
    Meteor.users.remove(this.userId);
    } catch (e) {
        // handle this however you want
        throw new Meteor.Error('self-delete', 'Failed to remove yourself');
    }
    },
  });

export { accountDeleteMethod };
