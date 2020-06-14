import { Meteor } from 'meteor/meteor';
import { App } from '@slack/bolt';
import { isAdminEmail } from '../../api/user/helpers';
import { Developers } from '../../api/user/DeveloperCollection';

if (!Meteor.isAppTest) {
  let pathToDotEnv = `${process.cwd()}`;
  pathToDotEnv = pathToDotEnv.substring(0, pathToDotEnv.indexOf('.meteor'));
  pathToDotEnv = `${pathToDotEnv}.env`;
// console.log(pathToDotEnv);
// const result = require('dotenv').config({ path: pathToDotEnv });
  require('dotenv').config({ path: pathToDotEnv });
// console.log(result);

  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  });

  app.event('message', async ({ event, say, context }) => {
    // console.log('message', event, context);
    if (event.text.includes('register me')) {
      const { profile } = await app.client.users.profile.get({
        token: context.botToken,
        user: event.user,
      });
      // console.log(profile);
      const { email, first_name, last_name } = profile;
      // console.log(email, first_name, last_name, real_name_normalized);
      if (!isAdminEmail(email)) { // they are a developer
        if (!Developers.isDefined(email)) {
          const firstName = first_name;
          const lastName = last_name;
          const username = email;
          const { password } = Developers.define({ username, firstName, lastName });
          await say(`
      Welcome to HACC Hui! Here are your credentials
      Host: https//hackhui.com
      Username: ${username}
      Password: ${password}`);
        } else {
          await say(`<@${event.user}> You've already registered. You can login to HACC Hui.`);
        }
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
