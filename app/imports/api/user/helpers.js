import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

export const isAdminEmail = (email) => _.contains(Meteor.settings.administrators, email);
