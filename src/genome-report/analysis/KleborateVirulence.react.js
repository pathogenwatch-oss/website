import React from 'react';

const kleborateTypingFields2 = [
  'virulence_score',
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

export default ({result}) => (
  <React.Fragment>
    <header>
      <a href="https://github.com/katholt/Kleborate" target="_blank"
         rel="noopener">Kleborate Virulence - https://github.com/katholt/Kleborate</a>
    </header>
    <table className="pw-kleborate-table" cellSpacing="0">
      <thead>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <th key={klebType}>{klebType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields2.map((klebType) => <td key={klebType}>{result[klebType]}</td>)}
      </tr>
      </tbody>
    </table>
  </React.Fragment>
)
