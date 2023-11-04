import { Selector } from 'testcafe';

class LandingPageTest {
  constructor() {
    this.pageId = '#landing-page';
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
    await tc.navigateTo('/#/');
    await this.isDisplayed(tc);
  }
}

export const landingPageTest = new LandingPageTest();
