import _ from 'lodash';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Administrators } from '../user/AdministratorCollection';
import { slackBot } from '../../startup/server/Slack';
import { SlackUsers } from './SlackUserCollection';

let pathToDotEnv = `${process.cwd()}`;
pathToDotEnv = pathToDotEnv.substring(0, pathToDotEnv.indexOf('.meteor'));
pathToDotEnv = `${pathToDotEnv}.env`;
// console.log(pathToDotEnv);
// const result = require('dotenv').config({ path: pathToDotEnv });
require('dotenv').config({ path: pathToDotEnv });
// console.log(result);

/** @namespace api/slackbot */

/**
 * Meteor method used to send direct messages to Administrators.
 * @param message {string} the message to send.
 * @type {ValidatedMethod}
 * @memberOf api/slackbot
 */
export const sendDM2AdministratorsMethod = new ValidatedMethod({
  name: 'slack.sendToAdmins',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ message }) {
    const administrators = _.map(Administrators.find({}).fetch(), (admin) => admin.username);
    _.forEach(administrators, (username) => {
      const { slackUser, dmChannel } = SlackUsers.findDoc({ username });
      const text = `<@${slackUser}> ${message}`;
      (async () => {
        await slackBot.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          text,
          channel: dmChannel,
        });
      })();
    });
  },
});

/**
 * Meteor method used to send direct messages to an individual participant.
 * @param participant {string} the participant's Slack userID.
 * @param message {string} the message to send.
 * @type {ValidatedMethod}
 * @memberOf api/slackbot
 */
export const sendDM2ParticipantMethod = new ValidatedMethod({
  name: 'slack.sendToParticipant',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ participant, message }) {
    const { slackUser, dmChannel } = SlackUsers.findDoc({ username: participant });
    const text = `<@${slackUser}> ${message}`;
    (async () => {
      await slackBot.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        text,
        channel: dmChannel,
      });
    })();
  },
});
