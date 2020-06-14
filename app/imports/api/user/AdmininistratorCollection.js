import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

class AdmininistratorCollection extends BaseSlugCollection {
  constructor(props) {
    super('Administrator', new SimpleSchema({
      username: { type: String },
      slugID: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
  }

  define({ username, firstName, lastName }) {
    if (Meteor.isServer) {
      const role = ROLE.ADMIN;
      const slugID = Slugs.define({ name: username }); // ensure the usernames are unique
      const profileID = this._collection.insert({ username, slugID, firstName, lastName });
      Slugs.updateEntityID(slugID, profileID);
      const { userID, password } = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      return { profileID, password };
    }
    return undefined;
  }

  update(docID, { firstName, lastName }) {
    this.assertDefined(docID);
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(docID) {
    super.removeIt(docID);
  }

  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, firstName, lastName } = this.findDoc(docID);
    return { username, firstName, lastName };
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this.collection.findOne({ userID });
  }


}

export const Administrators = new AdmininistratorCollection();
