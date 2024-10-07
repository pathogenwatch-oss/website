import React from 'react';

const scores = {
  0: 'no virulence loci',
  1: 'yersiniabactin only',
  2: 'yersiniabactin and colibactin, or colibactin only',
  3: 'aerobactin and/or salmochelin only (without yersiniabactin or colibactin)',
  4: 'aerobactin and/or salmochelin with yersiniabactin (without colibactin)',
  5: 'yersiniabactin, colibactin and aerobactin and/or salmochelin',
};

const virulenceFields = [
  'Yersiniabactin',
  'YbST',
  'Colibactin',
  'CbST',
  'Aerobactin',
  'AbST',
  'Salmochelin',
  'SmST',
];

const Value = ({ className, children }) => (
  <td className={className}>
    {children.replace('0', '-')}
  </td>
);

export default ({ result }) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="https://github.com/katholt/Kleborate/wiki/Acquired-virulence-loci" target="_blank"
        rel="noopener" className="pw-genome-report-secondary-link"
      ><strong>Sourced from Kleborate</strong></a>
    </p>
    <div >
      <dl className="pw-genome-report-unsized">
        <div>
          <dt>Virulence score</dt>
          <dd>{result.virulence.virulence_score} &ndash; {scores[result.virulence.virulence_score]}</dd>
        </div>
      </dl>
    </div>
    <div >
      <dl className="pw-genome-report-unsized">
        <div>
          <dt>Hypermucoidy (<em>RmpADC</em> / <em>rmpA2</em>)</dt>
          <dd>{result.virulence.profile.RmpADC} / {result.virulence.profile.rmpA2}</dd>
        </div>
      </dl>
    </div>
    { result.virulence_score !== '0' &&
      <table className="wide bordered" cellSpacing="0">
        <thead>
          <tr>
            {virulenceFields.map((field) => (
              <th>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {virulenceFields.map((field) => (
              <Value>{result.virulence.profile[field]}</Value>
            ))}
          </tr>
        </tbody>
      </table>
    }
  </React.Fragment>
);
