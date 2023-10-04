import { Selector } from 'testcafe';
import { compliantParticipantCredentials, signInAs } from './_helpers';

class YourProfilePageTest {
  constructor() {
    this.pageId = '#your-profile-page';
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
    // IN CASE YOUR TEST NEEDS TO SIGN IN FIRST, YOU CAN DO SOMETHING LIKE THIS
    await signInAs(tc, compliantParticipantCredentials);
    await tc.navigateTo('/#/your-profile');
    await this.isDisplayed(tc);
  }
}

export const yourProfilePageTest = new YourProfilePageTest();
