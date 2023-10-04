import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class EditChallengePageTest {
  constructor() {
    this.pageId = '#edit-challenge-page';
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
    await signInAs(tc, adminCredentials);
    await tc.navigateTo('/#/edit-challenge/3aRmn3k2GAvCRtSMH');
    await this.isDisplayed(tc);
  }
}

export const editChallengePageTest = new EditChallengePageTest();
