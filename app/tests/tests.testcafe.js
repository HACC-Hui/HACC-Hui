import {} from 'testcafe';
import { landingPageTest } from './landingPage.e2e';
import { helpPageTest } from './HelpPage.e2e'

/**
 * @typedef {object} Credentials
 * @property {string} username
 * @property {string} password
 */

/** @type {Credentials} */
const participantCredentials = {
  username: 'john@foo.com',
  password: 'changeme',
};

/** @type {Credentials} */
const adminCredentials = {
  username: 'admin@hacchui.ics.hawaii.edu',
  password: 'changeme',
};

fixture('HACC-Hui').page('http://localhost:3400');

test('Test landing page', async (testController) => {
  await landingPageTest.test(testController);
});

test('Test Help Page', async (testController) => {
  await helpPageTest.test(testController);
});
