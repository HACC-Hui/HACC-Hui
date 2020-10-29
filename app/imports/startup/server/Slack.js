import { Meteor } from 'meteor/meteor';
import { App } from '@slack/bolt';
import _ from 'lodash';
import { isAdminEmail } from '../../api/user/helpers';
import { Participants } from '../../api/user/ParticipantCollection';
import { Administrators } from '../../api/user/AdministratorCollection';
import { SlackUsers } from '../../api/slackbot/SlackUserCollection';

let app;
if (!Meteor.isAppTest) {
  let pathToDotEnv = `${process.cwd()}`;
  pathToDotEnv = pathToDotEnv.substring(0, pathToDotEnv.indexOf('.meteor'));
  pathToDotEnv = `${pathToDotEnv}.env`;
// console.log(pathToDotEnv);
// const result = require('dotenv').config({ path: pathToDotEnv });
// eslint-disable-next-line global-require
  require('dotenv').config({ path: pathToDotEnv });
// console.log(result);

  app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  });

  app.event('message', async ({ event, say, context }) => {
    // console.log('message', event, context);
    if (event.text.toLowerCase().includes('register')) {
      const { profile } = await app.client.users.profile.get({
        token: context.botToken,
        user: event.user,
      });
      // console.log(profile);
      const { email, first_name, last_name, real_name } = profile;
      // console.log(email, first_name, last_name);
      if (!isAdminEmail(email)) { // they are a participant
        if (!Participants.isDefined({ username: email })) {
          let firstName = first_name;
          let lastName = last_name;
          if (_.isNil(firstName)) {
            const names = real_name.split(' ');
            firstName = names[0];
          }
          if (_.isNil(lastName)) {
            const names = real_name.split(' ');
            lastName = names[1];
          }
          if (_.isNil(firstName) || firstName === '') {
            firstName = 'ChangeMe';
          }
          if (_.isNil(lastName) || lastName === '') {
            lastName = 'ChangeMe';
          }
          const username = email;
          try {
            const { password } = Participants.define({ username, firstName, lastName });
            // record this user
            SlackUsers.define({ username, slackUser: event.user, dmChannel: event.channel });
            await say(`
 <@${event.user}> Welcome to HACC-Hui! Here are your credentials.
 Host: https://hacchui.ics.hawaii.edu/#/signin
 Username: ${username}
 Password: ${password}`);
          } catch (err) {
            await say(`<@${event.user}> Error: I could not get your first and last names.
             Make sure your Slack profile has a full name and display name with your first and last names.`);
          }
        } else {
          await say(`
              <@${event.user}> You've already registered. You can login to HACC-Hui.
 Host: https://hacchui.ics.hawaii.edu/#/signin`);
        }
      } else
        if (!Administrators.isDefined({ username: email })) {
          let firstName = first_name;
          let lastName = last_name;
          if (_.isNil(firstName)) {
            const names = real_name.split(' ');
            firstName = names[0];
          }
          if (_.isNil(lastName)) {
            const names = real_name.split(' ');
            lastName = names[1];
          }
          if (_.isNil(firstName || firstName === '')) {
            firstName = 'ChangeMe';
          }
          if (_.isNil(lastName || lastName === '')) {
            lastName = 'ChangeMe';
          }
          const username = email;
          try {
            const { password } = Administrators.define({ username, firstName, lastName });
            // record this user
            SlackUsers.define({ username, slackUser: event.user, dmChannel: event.channel });
            await say(`
 <@${event.user}> Welcome to HACC-Hui! Here are your credentials.
 Host: https://hacchui.ics.hawaii.edu/#/signin
 Username: ${username}
 Password: ${password}`);
          } catch (err) {
            await say(`<@${event.user}> Error: I could not get your first and last names.
             Make sure your Slack profile has a full name and display name with your first and last names.`);
          }
        } else {
          await say(`<@${event.user}> You've already registered. You can login to HACC-Hui.
 Host: https://hacchui.ics.hawaii.edu/#/signin`);
        }
    } else
      if (event.text.toLowerCase().includes('help')) { // user says help to receive dialogue
        await say(`<@${event.user}> I can see that you need help, please refer to our help page.
 Help Page: https://hacchui.ics.hawaii.edu/#/help-page`);
      } else {
        await say(`<@${event.user}> I don't understand '${event.text}'. 
 To register for HACC-Hui, please type 'register me'. 
 If you require assistance, please type 'help me'.`);
      }
  });

// Start your app
  (async () => {
    const port = Meteor.settings.slackbotPort || 3000;
    await app.start(port);
    console.log(`⚡️ Bolt app is running on port ${port}!`);
  })();

}

/**
 * Exports the singleton slackBot for use in HACC-Hui.
 * @type {BoltApp}
 * @memberOf startup/server
 */
export const slackBot = app;
