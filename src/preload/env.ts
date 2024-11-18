import packageJson from '../../package.json';

process.versions['app'] = packageJson.version;
process.versions['name'] = packageJson.name;
