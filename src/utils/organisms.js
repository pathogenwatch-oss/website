const organisms = [
  {
    taxId: '90370',
    name: 'Salmonella enterica subsp. enterica serovar Typhi',
    subspecies: [
      '497977',
      '496065',
      '1156917',
      '1299275',
      '1299276',
      '1176488',
      '1192853',
      '220341',
      '497976',
      '497975',
      '497974',
      '497973',
      '496068',
      '496064',
      '496067',
      '496066',
      '1132507',
      '596159',
      '1176487',
      '1443995',
      '209261',
      '527001',
      '1169660',
      '1169661',
    ],
  },
];

function getSubspecies(taxId) {
  for (const organism of organisms) {
    if (taxId === organism.taxId || organism.subspecies.includes(taxId)) {
      return {
        taxId: organism.taxId,
        name: organism.name,
      };
    }
  }

  return null;
}

module.exports = {
  getSubspecies,
};
