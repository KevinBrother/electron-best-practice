// @ts-check
const { Arch } = require('electron-builder');

async function buildMain() {
  const { RPA_PACK_ARCH = '', RPA_PACK_PLATFORM = '', RPA_PACK_TARGET_FORMAT = '', RPA_PACK_FORCE_REBUILD = false } = process.env;

  const archs = RPA_PACK_ARCH.split(',');
  const formats = RPA_PACK_TARGET_FORMAT.split(',');

  const ArchMap = {
    x86: Arch.ia32,
    x64: Arch.x64,
    arm32: Arch.armv7l,
    arm64: Arch.arm64
  };

  const archArr = archs.map((arch) => ArchMap[arch]);

  const linuxPlatforms = ['linux', 'UOS', 'kylinOS'];

  const platform = linuxPlatforms.includes(RPA_PACK_PLATFORM) ? 'linux' : RPA_PACK_PLATFORM;
  const PlatformBuilder = require(`./${platform}.js`);
  const platformBuilder = new PlatformBuilder(formats, archArr);

  return platformBuilder.format().exec();
}

module.exports = {
  buildMain
};
