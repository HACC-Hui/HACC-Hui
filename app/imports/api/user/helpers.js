import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';

export const isAdminEmail = (email) => _.contains(Meteor.settings.administrators, email);
