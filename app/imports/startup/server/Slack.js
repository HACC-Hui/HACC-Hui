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
    if (event.text.includes('register')) {
      const { profile } = await app.client.users.profile.get({
        token: context.botToken,
        user: event.user,
      });
      // console.log(profile);
      const { email, first_name, last_name, real_name } = profile;
      // console.log(email, first_name, last_name);
      if (!isAdminEmail(email)) { // they are a participant
        if (!Participants.isDefined({ username: email })) {
          if (last_name !== '') { // last name is provided
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
            if (_.isNil(firstName)) {
              firstName = 'ChangeMe';
            }
            if (_.isNil(lastName)) {
              lastName = 'ChangeMe';
            }
            const username = email;
            const { password } = Participants.define({ username, firstName, lastName });
            // record this user
            SlackUsers.define({ username, slackUser: event.user, dmChannel: event.channel });
            await say(`
        Welcome to HACC-Hui! Here are your credentials
        Host: https//hackhui.com
        Username: ${username}
        Password: ${password}`);
          } else {
            await say(`<@${event.user}> Please include a last name with your profile.
You can do this by going to 'edit profile' and entering your full name under 'Full name' then try to register again.`);
          }
        } else {
          await say(`<@${event.user}> You've already registered. You can login to HACC-Hui.`);
        }
      } else
        if (!Administrators.isDefined({ username: email })) {
          if (last_name !== '') { // last name is provided
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
            if (_.isNil(firstName)) {
              firstName = 'ChangeMe';
            }
            if (_.isNil(lastName)) {
              lastName = 'ChangeMe';
            }
            const username = email;
            const { password } = Administrators.define({ username, firstName, lastName });
            // record this user
            SlackUsers.define({ username, slackUser: event.user, dmChannel: event.channel });
            await say(`
        Welcome to HACC-Hui! Here are your credentials
        Host: https//hackhui.com
        Username: ${username}
        Password: ${password}`);
          } else {
            await say(`<@${event.user}> Please include a last name with your profile.
You can do this by going to 'edit profile' and entering your full name under 'Full name' then try to register again.`);
          }
        } else {
          await say(`<@${event.user}> You've already registered. You can login to HACC-Hui.`);
        }
    } else
      if (event.text.includes('help')) {
        // url = '/signin';
        /* Could we add a hyperlink into slack? Need to check Slack API */
        // Need to wait for help page issue to be complete, talk to moore about this
        await say(`<@${event.user}> I can see that you need help, please refer to our help page at: [temp url]`);
      } else {
        await say(`<@${event.user}> I don't understand '${event.text}'. To register say register me. 
        If you need help say help me.`);
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
