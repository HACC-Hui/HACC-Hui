import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class AddToolPageTest {
  constructor() {
    this.pageId = '#add-tool-page';
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
    await tc.navigateTo('/#/add-tool');
    await this.isDisplayed(tc);
  }
}

export const addToolPageTest = new AddToolPageTest();
