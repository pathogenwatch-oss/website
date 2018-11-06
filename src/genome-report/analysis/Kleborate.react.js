import React from 'react';

import { Section } from '../components';

const kleborateTypingFields = [ 'species',
  'ST',
  'virulence_score',
  'resistance_score',
  'Yersiniabactin',
  'YbST',
  'Colibactin',
  'CbST',
  'Aerobactin',
  'AbST',
  'Salmochelin',
  'SmST',
  'rmpA',
  'rmpA2',
  'K_locus',
  'K_locus_confidence',
  'O_locus',
  'O_locus_confidence',
  'wzi',
];

const kleborateAmrFields = [ 'AGly',
  'Col',
  'Fcyn',
  'Flq',
  'Gly',
  'MLS',
  'Ntmdz',
  'Phe',
  'Rif',
  'Sul',
  'Tet',
  'Tmt',
  'Bla',
  'Bla_Carb',
  'Bla_ESBL',
  'Bla_ESBL_inhR',
  'Bla_broad',
  'Bla_broad_inhR',
];

export default ({ result }) => (
  <Section key={'Kleborate'} heading={'Kleborate'} version={''}>
    <div className="kleborate-url">
      <a href="https://github.com/katholt/Kleborate" target="_blank" rel="noopener">Source: github.com/katholt/Kleborate</a>
    </div>
    <table className="pw-kleborate-typing" cellSpacing="0">
      <caption>Kleborate Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields.map((klebType) =>
          <th key={klebType}>{klebType}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields.map((klebType) =>
          <td key={klebType}>{result[klebType]}</td>,
        )}
      </tr>
      </tbody>
    </table>
    <table className="pw-kleborate-amr" cellSpacing="0">
      <caption>Kleborate Predicted AMR</caption>
      <thead>
      <tr>
        {kleborateAmrFields.map((klebAmr) =>
          <th key={klebAmr}>{klebAmr}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields.map((klebAmr) =>
          <td key={klebAmr}>{result[klebAmr]}</td>,
        )}
      </tr>
      </tbody>
    </table>
  </Section>
);



