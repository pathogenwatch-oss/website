const argv = require('named-argv');
const geocoding = require('geocoding');

const mongoConnection = require('utils/mongoConnection');
const CollectionGenome = require('models/collectionGenome');

const readMetadata = require('./read-metadata');

console.log(argv.opts);

const { csvFile, collectionId } = argv.opts;

if (!csvFile || !collectionId) {
  console.log('Missing arguments');
  process.exit(1);
}

function getCountryCode(latitude, longitude) {
  if (latitude && longitude) {
    return geocoding.getCountryCode(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude)
    );
  }
  return null;
}

mongoConnection.connect().
  then(() =>
    Promise.all([
      readMetadata(csvFile),
      CollectionGenome.find({ _collection: collectionId }),
    ])
  ).
  then(([ rows, records ]) => Promise.all(
    rows.map(row => {
      console.log(row.filename);
      const record = records.find(_ => _.name === row.filename);
      if (!record) {
        console.log('No matching record, continuing');
        return Promise.resolve();
      }
      const { name, year, month, day, latitude, longitude, pmid, userDefined } = row;
      record.name = name;
      record.date = { year, month, day };
      record.position = { latitude, longitude };
      record.country = getCountryCode(latitude, longitude);
      record.pmid = pmid;
      record.userDefined = userDefined;
      return record.save();
    })
  )).
  then(() => { console.log('done.'); process.exit(0); }).
  catch(error => { console.error(error); process.exit(1); });
