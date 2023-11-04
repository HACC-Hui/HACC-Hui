import { Selector } from 'testcafe';
import { adminCredentials, signInAs } from './_helpers';

class AdminEditTeamPageTest {
  constructor() {
    this.pageId = '#admin-edit-team-page';
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
    await tc.navigateTo('/#/view-teams');
    await tc.click(Selector('.team-item'));
    await tc.click(Selector('button').withExactText('Edit'));
    await this.isDisplayed(tc);
  }
}

export const adminEditTeamPageTest = new AdminEditTeamPageTest();
