import { fixture, test } from 'testcafe';

import { landingPageTest } from './landingPage.e2e';
import { signinPageTest } from './SigninPage.e2e';
import { signoutPageTest } from './SignoutPage.e2e';
import { notFoundPageTest } from './NotFoundPage.e2e';
import { helpPageTest } from './HelpPage.e2e';
import { addToolPageTest } from './addToolPage.e2e';
import { dumpDatabasePageTest } from './dumpDatabasePage.e2e';
import { listSuggestionsPageTest } from './ListSuggestionsPage.e2e';

fixture('HACC-Hui').page('http://localhost:3400');



test('Test List Suggestions page', async (testController) => {
  await listSuggestionsPageTest.test(testController);
});
