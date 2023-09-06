import { Selector } from 'testcafe';
import { landingPageTest } from './landingPage.e2e';
import { signoutPageTest } from './SignoutPage.e2e';
import { notFoundPageTest } from './NotFoundPage.e2e';
import { helpPageTest } from './HelpPage.e2e';
import { addToolPageTest } from './addToolPage.e2e';

/**
 * @typedef {object} Credentials
 * @property {string} email
 * @property {string} password
 */

/** @type {Credentials} */
export const participantCredentials = {
  email: 'john@foo.com',
  password: 'changeme',
};

/** @type {Credentials} */
export const adminCredentials = {
  email: 'admin@hacchui.ics.hawaii.edu',
  password: 'changeme',
};

/** @type {(tc: TestController, creds: Credentials) => Promise<void>} */
export const signInAs = async (tc, creds) => {
  await tc.navigateTo('/#/signin');
  const emailInput = Selector('input[type="email"]');
  const passwordInput = Selector('input[type="password"]');
  await tc.typeText(emailInput, creds.email);
  await tc.typeText(passwordInput, creds.password);
  await tc.click(Selector('button').withText('Submit'));
  await tc.expect(Selector('#landing-page').visible).ok();
};

fixture('HACC-Hui').page('http://localhost:3400');

test('Test landing page', async (testController) => {
  await landingPageTest.test(testController);
});

test('Test signout', async (testController) => {
  await signoutPageTest.test(testController, adminCredentials);
});

test('Test not found page', async (testController) => {
  await notFoundPageTest.test(testController);

test('Test Help Page', async (testController) => {
  await helpPageTest.test(testController);
});

test('Test Add Tool page', async (testController) => {
  await addToolPageTest.test(testController);
});
