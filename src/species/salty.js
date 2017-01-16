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
  definitionText: (<span><strong><em>Salmonella</em></strong> <strong>Typhi</strong>,  a common serovar of <em>Salmonella enterica</em> subsp. <em>enterica</em>.</span>),
  desc: (
    <span>
      <p>
        <em>Salmonella enterica</em> subsp. <em>enterica</em> serovar Typhi causes typhoid (enteric) fever, a disease that affects approximately 20-30 million of new patients every year,<sup>[1,2]</sup> predominantly in Asia and sub-Saharan Africa. Mortality rates in patients who are not administered antibiotic treatment can be as high as 26%.<sup>[1]</sup> The emergence of multi-drug resistant Salmonella Typhi and the shortage of local surveillance data from endemic regions both challenge the management of typhoid fever.
      </p>
      <ol className="wgsa-species-home-citations">
        <li><cite>Wain J., Hendriksen R.S., Mikoleit M.L., Keddy K.H. and Ochiai R.L. 2015. Typhoid Fever. Lancet 385:1136-1145.</cite></li>
        <li><cite>Crump J.A. and Mintz E.D. 2010. Global trends in typhoid and paratyphoid fever. Clinical Infectious Diseases 50:241-246.</cite></li>
      </ol>
    </span>
  ),
  publicMetadataColumnNames: [],
  collections: [],
  antibioticsSeparatorIndex: -1,
  uiOptions: {
    genotyphi: true,
  },
};
