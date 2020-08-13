import { Meteor } from 'meteor/meteor';
import { App } from '@slack/bolt';
import { isAdminEmail } from '../../api/user/helpers';
import { Developers } from '../../api/user/DeveloperCollection';
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
      const { email, first_name, last_name } = profile;
      // console.log(email, first_name, last_name);
      if (!isAdminEmail(email)) { // they are a developer
        if (!Developers.isDefined(email)) {
          const firstName = first_name;
          const lastName = last_name;
          const username = email;
          const { password } = Developers.define({ username, firstName, lastName });
          // record this user
          SlackUsers.define({ username, slackUser: event.user, dmChannel: event.channel });
          await say(`
      Welcome to HACC-Hui! Here are your credentials
      Host: https//hackhui.com
      Username: ${username}
      Password: ${password}`);
        } else {
          await say(`<@${event.user}> You've already registered. You can login to HACC-Hui.`);
        }
      } else
        if (!Administrators.isDefined(email)) {
          const firstName = first_name;
          const lastName = last_name;
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
          await say(`<@${event.user}> You've already registered. You can login to HACC-Hui.`);
        }
    } else {
      await say(`<@${event.user}> I don't understand '${event.text}'. To register say register me.`);
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
