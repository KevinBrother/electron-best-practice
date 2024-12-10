// @ts-check
const { build, Platform, Arch } = require('electron-builder');
const config = require('../../../electron-win-builder.json');

/**
 *  @interface PlatFormBuilder
 */
module.exports = class Windows {
  /**
   * Represents a Windows.
   * @constructor
   * @param {string[]} target - The string of the Windows.
   * @param {Arch[]} arch - The Archs of the Windows.
   */
  constructor(target, arch) {
    this.target = target;
    this.arch = arch;
  }

  format() {
    config.win.target = this.target;
    return this;
  }

  exec() {
    return build({
      targets: Platform.WINDOWS.createTarget(null, ...this.arch),
      // @ts-ignore
      config
    });
  }
};
