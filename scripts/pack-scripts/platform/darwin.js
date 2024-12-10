// @ts-check
const { build, Platform, Arch } = require('electron-builder');
const config = require('../../../electron-mac-builder.json');

/**
 *  @interface PlatFormBuilder
 */
module.exports = class Darwin {
  /**
   * Represents a Darwin.
   * @constructor
   * @param {string[]} target - The string of the Darwin.
   * @param {Arch[]} arch - The Archs of the Darwin.
   */
  constructor(target, arch) {
    this.target = target;
    this.arch = arch;
  }

  format() {
    //@ts-ignore
    config.mac.target = this.target;
    return this;
  }

  exec() {
    return build({
      targets: Platform.MAC.createTarget(null, ...this.arch),
      //@ts-ignore
      config
    });
  }
};
