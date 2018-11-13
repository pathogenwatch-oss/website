import React from 'react';

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
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Kleborate</h2>
      <a href="https://github.com/katholt/Kleborate" target="_blank" rel="noopener">https://github.com/katholt/Kleborate</a>
    </header>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Typing</caption>
      <table cellSpacing="0">
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
      <table cellSpacing="0">
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
    </table>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Predicted AMR</caption>
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
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>BLA Genes</caption>
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
  </React.Fragment>
);



