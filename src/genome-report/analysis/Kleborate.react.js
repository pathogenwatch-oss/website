import React from 'react';
import KleborateAMR from "./KleborateAMR.react";

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
  'virulence_score',
  'resistance_score',
  'K_locus',
  'K_locus_confidence',
  'O_locus',
  'O_locus_confidence',
  'wzi',
];

export default ({result}) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Kleborate</h2>
      <a href="https://github.com/katholt/Kleborate" target="_blank"
         rel="noopener">https://github.com/katholt/Kleborate</a>
    </header>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields1
          .filter(field => field !== 'wzi')
          .map((klebType) =>
            <th key={klebType}>{
              klebType
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/^K Locus$/, 'K Locus Best Match')
                .replace(/^O Locus$/, 'O Locus Best Match')
            }</th>)
        }
        <th key="wzi" className="italic">wzi</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td key="species" className="italic">{result.species}</td>
        {kleborateTypingFields1
          .filter(field => field !== 'species')
          .filter(field => field !== 'wzi')
          .map((klebType) =>
            <td key={klebType}>{result[klebType]}</td>)}
        <td key="wzi" className="italic">{result.wzi}</td>
      </tr>
      </tbody>
    </table>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Virulence Locus Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <th key={klebType}>{klebType.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <td key={klebType}>{result[klebType]}</td>)}
      </tr>
      </tbody>
    </table>
    <KleborateAMR result={result} />
  </React.Fragment>
);



