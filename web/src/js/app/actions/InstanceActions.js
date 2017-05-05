/* @flow */

import BaseAction from './BaseAction.js';

export class InstanceActions extends BaseAction {
  changeTab(activeTab: string) {
    this.trigger({className: 'TabChangeEvent', activeTab: activeTab});
  }
}

export default new InstanceActions();
