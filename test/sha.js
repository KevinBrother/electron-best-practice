const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const YAML = require('yaml');

describe('SHA512 Verification', () => {
  const releasePath = path.resolve(__dirname, '..', 'release');
  const latestYmlPath = path.join(releasePath, 'latest.yml');
  const latestYml = YAML.parse(fs.readFileSync(latestYmlPath, 'utf8'));
  const filePath = path.join(releasePath, latestYml.files[0].url);
  const expectedSha512 = latestYml.sha512;

  it('should match the SHA512 hash of the file with the expected value', async () => {
    const { expect } = await import('chai'); // 动态导入 chai

    const hash = crypto.createHash('sha512');
    const fileStream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('data', (data) => {
        hash.update(data);
      });

      fileStream.on('end', () => {
        const calculatedSha512 = hash.digest('base64');
        try {
          console.log('calculatedSha512:', calculatedSha512);
          console.log('expectedSha512:', expectedSha512);
          expect(calculatedSha512).to.equal(expectedSha512);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      fileStream.on('error', (err) => {
        reject(err);
      });
    });
  });
});
