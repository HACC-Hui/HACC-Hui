import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Administrators } from '../user/AdmininistratorCollection';
import { slackBot } from '../../startup/server/Slack';
import { SlackUsers } from './SlackUserCollection';

let pathToDotEnv = `${process.cwd()}`;
pathToDotEnv = pathToDotEnv.substring(0, pathToDotEnv.indexOf('.meteor'));
pathToDotEnv = `${pathToDotEnv}.env`;
// console.log(pathToDotEnv);
// const result = require('dotenv').config({ path: pathToDotEnv });
require('dotenv').config({ path: pathToDotEnv });
// console.log(result);

export const sendDM2AdministratorsMethod = new ValidatedMethod({
  name: 'slack.sendToAdmins',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ message }) {
    const administrators = _.map(Administrators.find({}).fetch(), (admin) => admin.username);
    _.each(administrators, (username) => {
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

export const sendDM2DeveloperMethod = new ValidatedMethod({
  name: 'slack.sendToDeveloper',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ developer, message }) {
    const { slackUser, dmChannel } = SlackUsers.findDoc({ username: developer });
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
