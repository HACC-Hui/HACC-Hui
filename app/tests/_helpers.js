import { Selector } from 'testcafe';

/**
 * @typedef {object} Credentials
 * @property {string} email
 * @property {string} password
 */

/** @type {Credentials} */
export const incompliantParticipantCredentials = {
  email: 'john@foo.com',
  password: 'changeme',
};

/** @type {Credentials} */
export const compliantParticipantCredentials = {
  email: 'aunggum@hawaii.edu',
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
  await tc.navigateTo('/#/');
  await tc.expect(Selector('#landing-page').visible).ok();
};
