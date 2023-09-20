import { fixture, test } from 'testcafe';

import { landingPageTest } from './landingPage.e2e';
import { signinPageTest } from './SigninPage.e2e';
import { signoutPageTest } from './SignoutPage.e2e';
import { notFoundPageTest } from './NotFoundPage.e2e';
import { helpPageTest } from './HelpPage.e2e';
import { addToolPageTest } from './addToolPage.e2e';
import { dumpDatabasePageTest } from './dumpDatabasePage.e2e';
import { configureHaccPageTest } from "./configureHacc.e2e";

fixture('HACC-Hui').page('http://localhost:3400');

test('Test landing page', async (testController) => {
  await landingPageTest.test(testController);
});

test('Test sign in page', async (testController) => {
  await signinPageTest.test(testController);
});

test('Test sign out page', async (testController) => {
  await signoutPageTest.test(testController);
});

test('Test not found page', async (testController) => {
  await notFoundPageTest.test(testController);
});

test('Test Help Page', async (testController) => {
  await helpPageTest.test(testController);
});

test('Test Add Tool page', async (testController) => {
  await addToolPageTest.test(testController);
});

test('Test dump database page', async (testController) => {
  await dumpDatabasePageTest.test(testController);
});

test('Test Configure HACC page', async (testController) => {
  await configureHaccPageTest.test(testController);
});
