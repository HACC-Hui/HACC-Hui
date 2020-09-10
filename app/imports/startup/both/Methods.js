import { Meteor } from 'meteor/meteor';
import { Developers } from '../../api/user/DeveloperCollection';

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

const developerDeleteMethod = 'Developer.delete';

Meteor.methods({
  'Developer.delete'() {
  const owner = Meteor.user().username;
  if (!Meteor.isServer) return;

  try {
  // Meteor.users.remove(this.userId);
  console.log(Developers.hasProfile(owner));
  // Developers.removeIt(this.userId);
  } catch (e) {
      // handle this however you want
      throw new Meteor.Error(owner, 'Failed to remove yourself');
  }
  },
});

export { developerDeleteMethod };
