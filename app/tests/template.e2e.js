import { Selector } from 'testcafe';
import {} from './_helpers';

class PageNameTest {
  constructor() {
    this.pageId = '#PAGE-ID';
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
    // await signInAs(tc, participantCredentials or adminCredentials);
    await tc.navigateTo('/#/page-path');
    await this.isDisplayed(tc);
  }
}

export const pageNameTest = new PageNameTest();
