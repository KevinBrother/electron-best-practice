// @ts-check

const builder = require('electron-builder');
const Platform = builder.Platform;

const config = require('../../../electron-linux-builder.json');
config.linux.target = ['rpm', 'AppImage'];

builder
  .build({
    targets: Platform.LINUX.createTarget(null, builder.Arch.arm64, builder.Arch.x64),
    config
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
    throw error;
  });
