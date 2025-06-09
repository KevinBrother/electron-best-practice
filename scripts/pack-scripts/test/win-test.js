// @ts-check
const builder = require('electron-builder');
const Platform = builder.Platform;
const config = require('../../../electron-win-builder.json');
/* config.win.target = {
  target: 'portable',
  arch: ['x64', 'ia32']
}; */

config.win.target = ['portable', 'nsis'];

builder
  .build({
    targets: Platform.WINDOWS.createTarget(null, builder.Arch.x64, builder.Arch.ia32),
    // targets: Platform.WINDOWS.createTarget(),
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
