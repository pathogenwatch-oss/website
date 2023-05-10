module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.spn_pbp_amr.__v,
    PBP1a: doc.analysis.spn_pbp_amr.pbp1a,
    PBP2b: doc.analysis.spn_pbp_amr.pbp2b,
    PBP2x: doc.analysis.spn_pbp_amr.pbp2x,
  };

  /* eslint-disable no-return-assign */
  Object.keys(doc.analysis.spn_pbp_amr)
    .filter((prop) => !prop.match(/^pbp/))
    .filter((prop) => prop !== '__v')
    .sort()
    .forEach((prop) =>
      (record[prop.replace(/_/g, ' ')] = doc.analysis.spn_pbp_amr[prop])
    );
  return record;
};
