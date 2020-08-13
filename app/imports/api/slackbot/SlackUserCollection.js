import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import BaseCollection from '../base/BaseCollection';
import { Slugs } from '../slug/SlugCollection';

/**
 * SlackUserCollection stores the username, slackUser and dmChannel tuple for the users.
 * @memberOf api/slackbot
 * @extends api/base.BaseCollection
 */
class SlackUserCollection extends BaseCollection {
  constructor() {
    super('SlackUser', new SimpleSchema({
      username: { type: String },
      slackUser: { type: String },
      dmChannel: { type: String },
    }));
  }

  /**
   * Defines a new tuple.
   * @param username {string} the user's name (e.g. their email address).
   * @param slackUser {string} the user's slack user.
   * @param dmChannel {string} the user's direct message channel id.
   */
  define({ username, slackUser, dmChannel }) {
    if (!Slugs.isDefined(username)) {
      throw new Meteor.Error(`${username} is not a defined user.`);
    }
    this._collection.insert({ username, slackUser, dmChannel });
  }

  /**
   * Removes the tuple.
   * @param name {string} the name/username.
   * @return {boolean}
   */
  removeIt(name) {
    return super.removeIt(name);
  }

  /**
   * Returns an object representing the given docID.
   * @param docID {string} the ID of the document.
   * @return {{dmChannel: *, slackUser: *, username: *}}
   * @throws {Meteor.Error} if docID is not defined.
   */
  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, slackUser, dmChannel } = this.findDoc(docID);
    return { username, slackUser, dmChannel };
  }
}

/**
 * Singleton instance of the SlackUserCollection.
 * @type {api/slackbot.SlackUserCollection}
 * @memberOf api/slackbot
 */
export const SlackUsers = new SlackUserCollection();
