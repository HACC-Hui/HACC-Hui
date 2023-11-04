import { Selector } from 'testcafe';
import { compliantParticipantCredentials, signInAs } from './_helpers';

class OpenTeamsPageTest {
  constructor() {
    this.pageId = '#open-teams-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    // await tc.debug();
    await signInAs(tc, compliantParticipantCredentials);
    await tc.navigateTo('/#/open-teams');
    await this.isDisplayed(tc);
  }
}

export const openTeamsPageTest = new OpenTeamsPageTest();
