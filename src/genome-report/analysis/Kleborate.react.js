import React from 'react';

import { Section } from '../components';

const kleborateTypingFields2 = [
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
];

const kleborateTypingFields1 = [
  'species',
  'ST',
  'virulence_score',
  'resistance_score',
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
];

const klebBlaFields = [
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
    <table className="pw-kleborate-typing1" cellSpacing="0">
      <caption>Kleborate Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields1.map((klebType) =>
          <th key={klebType}>{klebType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields1.map((klebType) =>
          <td key={klebType}>{result[klebType]}</td>)}
      </tr>
      </tbody>
    </table>
    <table className="pw-kleborate-typing2" cellSpacing="0">
      <caption>Kleborate Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <th key={klebType}>{klebType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <td key={klebType}>{result[klebType]}</td>)}
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
        {kleborateAmrFields.map((klebAmr) =>
          <td key={klebAmr}>{result[klebAmr]}</td>)}
      </tr>
      </tbody>
    </table>
    <table className="pw-kleborate-bla" cellSpacing="0">
      <caption>Kleborate BLA Genes</caption>
      <thead>
      <tr>
        {klebBlaFields.map((klebBa) =>
          <th key={klebBa}>{klebBa}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {klebBlaFields.map((klebBla) =>
          <td key={klebBla}>{result[klebBla]}</td>)}
      </tr>
      </tbody>
    </table>
  </Section>
);



