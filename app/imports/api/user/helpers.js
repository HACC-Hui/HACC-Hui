import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';

export const isAdminEmail = (email) => _.contains(Meteor.settings.administrators, email);
