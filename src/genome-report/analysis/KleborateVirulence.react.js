import React from 'react';

const fields = [
  'Yersiniabactin',
  'YbST',
  'Colibactin',
  'CbST',
  'Aerobactin',
  'AbST',
  'Salmochelin',
  'SmST',
];

const scores = {
  0: 'no virulence loci',
  1: 'yersiniabactin only',
  2: 'yersiniabactin and colibactin, or colibactin only',
  3: 'aerobactin and/or salmochelin only (without yersiniabactin or colibactin)',
  4: 'aerobactin and/or salmochelin with yersiniabactin (without colibactin)',
  5: 'yersiniabactin, colibactin and aerobactin and/or salmochelin',
};

export default ({ result }) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="https://github.com/katholt/Kleborate#virulence-loci" target="_blank"
        rel="noopener" className="pw-genome-report-secondary-link"
      ><strong>Kleborate Virulence</strong> - https://github.com/katholt/Kleborate#virulence-loci</a>
    </p>
    <div className="pw-genome-report-column two thirds">
      <dl className="pw-genome-report-unsized">
        <div>
          <dt>Virulence Score</dt>
          <dd>{result.virulence_score} &ndash; {scores[result.virulence_score]}</dd>
        </div>
      </dl>
    </div>
    <div className="pw-genome-report-column one third">
      <dl className="pw-genome-report-unsized">
        <div>
          <dt>Hypermucoidy (<em>rmpA</em> / <em>rmpA2</em>)</dt>
          <dd>{result.rmpA} / {result.rmpA2}</dd>
        </div>
      </dl>
    </div>
    { result.virulence_score !== '0' &&
      <table className="wide bordered" cellSpacing="0">
        <thead>
          <tr>
            {fields.map((klebType) =>
              <th key={klebType}>{klebType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fields.map((klebType) => <td key={klebType}>{result[klebType].replace('0', '-')}</td>)}
          </tr>
        </tbody>
      </table>
    }
  </React.Fragment>
);
