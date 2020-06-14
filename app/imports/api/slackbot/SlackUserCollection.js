import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import BaseCollection from '../base/BaseCollection';
import { Slugs } from '../slug/SlugCollection';

class SlackUserCollection extends BaseCollection {
  constructor() {
    super('SlackUser', new SimpleSchema({
      username: { type: String },
      slackUser: { type: String },
      dmChannel: { type: String },
    }));
  }

  define({ username, slackUser, dmChannel }) {
    if (!Slugs.isDefined(username)) {
      throw new Meteor.Error(`${username} is not a defined user.`);
    }
    this._collection.insert({ username, slackUser, dmChannel });
  }

  removeIt(name) {
    return super.removeIt(name);
  }

  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, slackUser, dmChannel } = this.findDoc(docID);
    return { username, slackUser, dmChannel };
  }
}

export const SlackUsers = new SlackUserCollection();
