import { Selector } from 'testcafe';
import { Credentials } from './tests.testcafe';

class NotFoundPageTest {
  constructor() {
    this.pageId = '#not-found-page';
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
    await tc.navigateTo('/#/56456gfdf');
    await this.isDisplayed(tc);
  }

  // IN CASE YOUR TEST WANTS CREDENTIALS, YOU CAN DO SOMETHING LIKE THIS
  // /** @type {(tc: TestController, creds: Credentials) => void} */
  // async test(tc, creds) {
  //   // await tc.debug();
  //   await this.isDisplayed(tc);
  //   await this.somethingThatNeedsCreds(tc, creds);
  // }
}

export const notFoundPageTest = new NotFoundPageTest();
