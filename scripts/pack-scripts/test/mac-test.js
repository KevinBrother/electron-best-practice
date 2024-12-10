// @ts-check

const builder = require('electron-builder');
const Platform = builder.Platform;

const config = require('../../../electron-mac-builder.json');
config.mac.target = ['dmg', 'pkg'];

builder
  .build({
    targets: Platform.MAC.createTarget(null, builder.Arch.arm64, builder.Arch.x64),
    // @ts-ignore
    config
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
    throw error;
  });
