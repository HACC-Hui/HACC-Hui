import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

export const isAdminEmail = (email) => _.includes(Meteor.settings.administrators, email);
