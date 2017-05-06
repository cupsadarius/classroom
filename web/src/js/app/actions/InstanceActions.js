/* @flow */

import BaseAction from './BaseAction.js';

export class InstanceActions extends BaseAction {
  changeTab(activeTab: string) {
    this.trigger({className: 'TabChangeEvent', activeTab: activeTab});
  }
  changeColor(color: string) {
    this.trigger({className: 'ChangeColorEvent', color: color});
  }
  changeTool(tool: string) {
    this.trigger({className: 'ChangeToolEvent', tool: tool});
  }
}

export default new InstanceActions();
