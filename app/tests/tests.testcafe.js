import { fixture, test } from 'testcafe';
import { landingPageTest } from './landingPage.e2e';
import { signinPageTest } from './SigninPage.e2e';
import { signoutPageTest } from './SignoutPage.e2e';
import { notFoundPageTest } from './NotFoundPage.e2e';
import { helpPageTest } from './HelpPage.e2e';
import { addChallengePageTest } from './addChallengePage.e2e';
import { addSkillPageTest } from './AddSkillPage.e2e';
import { addToolPageTest } from './addToolPage.e2e';
import { dumpDatabasePageTest } from './dumpDatabasePage.e2e';
import { listSuggestionsPageTest } from './ListSuggestionsPage.e2e';
import { allTeamInvitationsPageTest } from './AllTeamInvitationsPage.e2e';
import { openTeamsPageTest } from './openTeamsPage.e2e';
import { listTeamsPageTest } from './listTeamsPage.e2e';
import { configureHaccPageTest } from './configureHacc.e2e';
import { adminEditTeamPageTest } from './adminEditTeamPage.e2e';
import { editSkillPageTest } from './editSkillPage.e2e';
import { editToolPageTest } from './editToolPage.e2e';
import { editChallengePageTest } from './editChallengePage.e2e';
import { yourProfilePageTest } from './profilePage.e2e';

fixture('HACC-Hui').page('http://localhost:3400');

test('Test landing page', async (testController) => {
  await landingPageTest.test(testController);
});

test('Test List Suggestions page', async (testController) => {
  await listSuggestionsPageTest.test(testController);
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

test('Test Add Challenge page', async (testController) => {
  await addChallengePageTest.test(testController);
});
test('Test Edit Challenge page', async (testController) => {
  await editChallengePageTest.test(testController);
});
test('Test Add Skill page', async (testController) => {
  await addSkillPageTest.test(testController);
});
test('Test Edit Skill page', async (testController) => {
  await editSkillPageTest.test(testController);
});

test('Test Add Tool page', async (testController) => {
  await addToolPageTest.test(testController);
});
test('Test Edit Tool page', async (testController) => {
  await editToolPageTest.test(testController);
});
test('Test dump database page', async (testController) => {
  await dumpDatabasePageTest.test(testController);
});

test('Test all team invitations page', async (testController) => {
  await allTeamInvitationsPageTest.test(testController);
});

test('Test open teams page', async (testController) => {
  await openTeamsPageTest.test(testController);
});

test('Test list teams page', async (testController) => {
  await listTeamsPageTest.test(testController);
});

test('Test Configure HACC page', async (testController) => {
  await configureHaccPageTest.test(testController);
});

test('Test admin edit team page', async (tc) => {
  await adminEditTeamPageTest.test(tc);
});

test('Test your profile page', async (tc) => {
  await yourProfilePageTest.test(tc);
});
