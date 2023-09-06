import { Selector } from 'testcafe';
import { Credentials } from './tests.testcafe';

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
    await tc.navigateTo('/#/page-path');
    await this.isDisplayed(tc);
  }

  // IN CASE YOUR TEST NEEDS TO SIGN IN FIRST, YOU CAN DO SOMETHING LIKE THIS
  // /** @type {(tc: TestController) => Promise<void>} */
  // async test(tc, creds) {
  //   // await tc.debug();
  //   await signInAs(tc, participantCredentials or adminCredentials);
  //   await tc.navigateTo('/#/page-path');
  //   await this.isDisplayed(tc);
  // }
}

export const pageNameTest = new PageNameTest();
