const promisify = require('promisify-node');
const fs = promisify('fs');
const path = require('path');

const storageConnection = require('utils/storageConnection');

const DOCUMENT_PATH = process.argv[2];

storageConnection.connect().
  then(() => fs.readdir(DOCUMENT_PATH)).
  then(files => {
    const filesToProcess =
      files.
        map(filename => path.join(DOCUMENT_PATH, filename)).
        filter(file => fs.statSync(file).isFile());

    const mainStorage = require('services/storage')('main');
    return filesToProcess.reduce((previous, file) =>
      previous.then(() => {
        const string = fs.readFileSync(file, 'utf-8');
        const contents = JSON.parse(string);
        const key = path.basename(file).replace(path.extname(file), '');
        console.log('inserting', key);
        return mainStorage.store(key, contents);
      }),
      Promise.resolve()
    );
  }).
  then(() => process.exit(0)).
  catch(error => {
    console.error(error);
    return process.exit(1);
  });
