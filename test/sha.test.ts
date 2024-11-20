import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import YAML from 'yaml';
import { expect } from 'chai';

describe('SHA512 Verification', () => {
  const releasePath: string = path.resolve(__dirname, '..', 'release');
  const latestYmlPath: string = path.join(releasePath, 'latest.yml');
  const latestYml: { files: { url: string }[]; sha512: string } = YAML.parse(fs.readFileSync(latestYmlPath, 'utf8'));

  const filePath: string = path.join(releasePath, latestYml.files[0].url);
  const expectedSha512: string = latestYml.sha512;

  it('should match the SHA512 hash of the file with the expected value', (done) => {
    const hash: crypto.Hash = crypto.createHash('sha512');
    const fileStream: fs.ReadStream = fs.createReadStream(filePath);

    fileStream.on('data', (data: Buffer) => {
      hash.update(new Uint8Array(data));
    });

    fileStream.on('end', () => {
      const calculatedSha512: string = hash.digest('base64');
      console.log('calculatedSha512:', calculatedSha512);
      console.log('expectedSha512:', expectedSha512);
      expect(calculatedSha512).to.equal(expectedSha512);
      done();
    });

    fileStream.on('error', (err: Error) => {
      done(err);
    });
  });
});
