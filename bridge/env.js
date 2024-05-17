const packageJson = require('../package.json');

process.versions['app'] = packageJson.version;
process.versions['name'] = packageJson.name;
