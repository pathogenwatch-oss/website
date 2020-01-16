import React from 'react';
import classnames from 'classnames';

export default ({ result }) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="https://github.com/katholt/Kleborate#resistance-gene-detection" target="_blank"
         rel="noopener" className="pw-genome-report-secondary-link"
      >
        <strong>Kleborate</strong> - https://github.com/katholt/Kleborate#resistance-gene-detection
      </a>
    </p>
    <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
      <caption>Resistance profile</caption>
      <thead>
        <tr>
          <th>Agent</th>
          <th>Predicted phenotype</th>
          <th>Genes/variants</th>
        </tr>
      </thead>
      <tbody>
        {result.csv
          .filter((record) => record.set === 'amr')
          .map((record) => (
            <tr
              key={result.amr[record.field].name}
              className={classnames({
                'pw-genome-report-amr-present': result.amr[record.field].match !== '-',
                'pw-genome-report-amr-resistant': result.amr[record.field].match !== '-',
              })}
            >
              <td>{result.amr[record.field].name}</td>
              <td className="wgsa-genome-report-amr-state">
                {result.amr[record.field].match === '-' ? 'Not Found' : 'Resistant'}
              </td>
              <td className="pw-genome-report-amr-mechanisms">
                {result.amr[record.field].match
                  .replace(/;/gi, ', ')
                  .replace(/\^/gi, '')
                  .replace(/\*\?/gi, ' (homolog, fragment)')
                  .replace(/\*/gi, ' (homolog)')
                  .replace(/\?/gi, ' (fragment)')
                }
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </React.Fragment>
);

