// @ts-check
const { build, Platform, Arch } = require('electron-builder');
const config = require('../../../electron-linux-builder.json');

/**
 *  @interface PlatFormBuilder
 */
module.exports = class Linux {
  /**
   * Represents a Linux.
   * @constructor
   * @param {string[]} target - The string of the Linux.
   * @param {Arch[]} arch - The Archs of the Linux.
   */
  constructor(target, arch) {
    this.target = target;
    this.arch = arch;
  }

  format() {
    //@ts-ignore
    config.linux.target = this.target;
    return this;
  }

  exec() {
    return build({
      targets: Platform.LINUX.createTarget(null, ...this.arch),
      config
    });
  }
};
