import { Selector } from 'testcafe';
import { Credentials, signInAs } from './tests.testcafe';

class SignoutPageTest {
  constructor() {
    this.pageId = '#signout-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  /** @type {(tc: TestController, creds: Credentials) => Promise<void>} */
  async test(tc, creds) {
    // await tc.debug();
    await signInAs(tc, creds);
    await tc.navigateTo('/#/signout');
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

export const signoutPageTest = new SignoutPageTest();
