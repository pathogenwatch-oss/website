import React from 'react';
import classnames from 'classnames';

export default ({ result }) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="https://github.com/katholt/Kleborate/wiki/Antimicrobial-resistance" target="_blank"
         rel="noopener" className="pw-genome-report-secondary-link"
      >
        <strong>Sourced from Kleborate</strong>
      </a>
    </p>
    <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
      <caption>Resistance profile</caption>
      <thead>
        <tr>
          <th>Agent</th>
          <th>Predicted phenotype</th>
          <th>Genotypes</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(result.amr.profile)
          .filter((record) => record.key !== 'SHVM')
          .map((record) => (
            <tr
              key={record.name}
              className={classnames({
                'pw-genome-report-amr-present': record.resistant,
                'pw-genome-report-amr-resistant': record.resistant,
              })}
            >
              <td>{record.name}</td>
              <td className="wgsa-genome-report-amr-state">
                {record.resistant ? 'Resistant' : 'Not Found'}
              </td>
              <td className="pw-genome-report-amr-mechanisms">
                {record.matches === '-' ? '' : record
                  .matches
                  .replace(/;/gi, ', ')
                  .replace(/\^/gi, '')
                  .replace(/\*\?/gi, ' (homolog, fragment)')
                  .replace(/\*/gi, ' (homolog)')
                  .replace(/\?/gi, ' (fragment)')
                  .replace(/\.v\d/g, '')
                }
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </React.Fragment>
);

