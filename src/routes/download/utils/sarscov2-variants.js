module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis['sarscov2-variants'].__v,
  };

  doc.analysis["sarscov2-variants"].variants
    .sort((a, b) => {
      if (a.type === b.type) {
        if (a.name < b.name) {
          return -1;
        }
        return 1;
      } else if (a.type === 'Deletion' || a.type === 'SNP') {
        if (a.type === 'SNP') {
          return 1;
        } else if (b.type === 'SNP') {
          return -1;
        }
        return 1;
      }
      return -1;
    })
    .forEach((variant) => {
      record[variant.name] = variant.state === 'other' ? `${variant.state} (${variant.found})` : variant.state;
    });
  return record;
};
