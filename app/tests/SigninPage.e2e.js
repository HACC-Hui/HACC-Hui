import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class SigninPageTest {
  constructor() {
    this.pageId = '#signin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** @type {(tc: TestController) => Promise<void>} */
  async isDisplayed(tc) {
    await tc.expect(this.pageSelector.exists).ok();
    await tc.expect(this.pageSelector.visible).ok();
  }

  // IN CASE YOUR TEST NEEDS TO SIGN IN FIRST, YOU CAN DO SOMETHING LIKE THIS
  /** @type {(tc: TestController) => Promise<void>} */
  async test(tc) {
    // await tc.debug();
    await tc.navigateTo('/#/signin');
    await this.isDisplayed(tc);
    await signInAs(tc, adminCredentials);
  }
}

export const signinPageTest = new SigninPageTest();
