module.exports.transformer = function (doc) {

  if (!('klebsiella-lincodes' in doc.analysis)) {
    doc.analysis['klebsiella-lincodes'] = {
      __v: "",
      cgST: "",
      'Closest cgST': "",
      LINcode: [],
      Sublineage: "",
      'Clonal Group': "",
      identity: "",
      identical: "",
      comparedLoci: 0,
      matches: [],
    };
  }
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis['klebsiella-lincodes'].__v,
    'cgST': doc.analysis['klebsiella-lincodes'].cgST,
    'Closest cgST': doc.analysis['klebsiella-lincodes']['Closest cgST'],
    'LIN code': doc.analysis['klebsiella-lincodes'].LINcode.join(','),
    Sublineage: doc.analysis['klebsiella-lincodes'].Sublineage,
    'Clonal Group': doc.analysis['klebsiella-lincodes']['Clonal Group'],
    Identity: doc.analysis['klebsiella-lincodes'].identity,
    Identical: doc.analysis['klebsiella-lincodes'].identical,
    'Compared Loci Count': doc.analysis['klebsiella-lincodes'].comparedLoci,
    'Closest profile(s)': doc.analysis['klebsiella-lincodes']
      .matches
      .map(match => `cgST:${match.st} LIN code:${match.LINcode}`)
      .join(';'),
  };
};
