import React from 'react';

const name = 'Salmonella Typhi';
const formattedName = (() => {
  const [ species, serovar ] = name.split(' ');
  return (
    <span><em>{species}</em> {serovar}</span>
  );
})();

const shortName = 'S. Typhi';
const formattedShortName = (() => {
  const [ species, serovar ] = name.split(' ');
  return (
    <span><em>{species[0]}.</em> {serovar}</span>
  );
})();

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  definitionText: (<span>A common serovar of <em>Salmonella enterica</em> subsp. <em>enterica</em>.</span>),
  desc: (
    <span>
      <p>
        <strong><em>Salmonella enterica</em> subsp. <em>enterica</em> serovar Typhi</strong> causes typhoid (enteric) fever, a disease that affects approximately 20-30 million of new patients every year,<sup>[1,2]</sup> predominantly in Asia and sub-Saharan Africa. Mortality rates in patients who are not administered antibiotic treatment can be as high as 26%.<sup>[1]</sup> The emergence of multi-drug resistant Salmonella Typhi and the shortage of local surveillance data from endemic regions both challenge the management of typhoid fever.
      </p>
      <p>
        For more information go to <a href="http://www.stoptyphoid.org" target="_blank" rel="noopener">www.stoptyphoid.org</a>.
      </p>
      <ol className="wgsa-species-citations">
        <li><cite>Wain J., Hendriksen R.S., Mikoleit M.L., Keddy K.H. and Ochiai R.L. 2015. Typhoid Fever. Lancet 385:1136-1145.</cite></li>
        <li><cite>Crump J.A. and Mintz E.D. 2010. Global trends in typhoid and paratyphoid fever. Clinical Infectious Diseases 50:241-246.</cite></li>
      </ol>
    </span>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1224, scientificName: 'Proteobacteria', rank: 'phylum' },
    { taxId: 1236, scientificName: 'Gammaproteobacteria', rank: 'class' },
    { taxId: 91347, scientificName: 'Enterobacterales', rank: 'order' },
    { taxId: 543, scientificName: 'Enterobacteriaceae', rank: 'family' },
    { taxId: 590, scientificName: 'Salmonella', rank: 'genus' },
    { taxId: 28901, scientificName: 'Salmonella enterica', rank: 'species' },
    { taxId: 59201,
      scientificName: 'Salmonella enterica subsp. enterica',
      rank: 'subspecies' },
    { taxId: 90370,
      scientificName: 'Salmonella enterica subsp. enterica serovar Typhi',
      rank: 'no rank' },
  ],
  imageAltText: 'Salmonella Typhimurium colonies on a Hektoen enteric agar plate',
  publicMetadataColumnNames: [],
  collections: [],
  amrOptions: {
    customLabels: {
      SIL: 'OTHER',
    },
    hiddenColumns: new Set([ 'SIL' ]),
    paarOverrides: [
      { gene: 'tetR(A)', from: 'SIL', to: 'TCY' },
      { gene: 'tetR(B)', from: 'SIL', to: 'TCY' },
    ],
  },
  uiOptions: {
    genotyphi: true,
    // defaultTree: 'radial',
  },
};
