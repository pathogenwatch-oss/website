import React from 'react';
import classnames from 'classnames';
import { displayAMRField, formatAMRMatch, formatAMRName, mergeInhibitorColumns, sortKleborateProfile } from '~/task-utils/kleborate';

export default ({ result }) => {
  const profile = mergeInhibitorColumns(result.amr.profile);

  return (
    <React.Fragment>
      <p className="pw-genome-report-section-header">
        <a
          href="https://kleborate.readthedocs.io/en/latest/index.html"
          target="_blank"
          rel="noopener" className="pw-genome-report-secondary-link"
        >
          <strong>Sourced from Kleborate</strong>
        </a>
      </p>
      <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
        <caption>Resistance profile</caption>
        <thead>
          <tr>
            <th>Drug/Class</th>
            <th>Resistance Determinants</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(profile)
            .sort(sortKleborateProfile())
            .filter((record) => displayAMRField(record))
            .map((record) => (
              <tr
                key={record.name}
                className={classnames({
                  'pw-genome-report-amr-present': record.resistant,
                  'pw-genome-report-amr-resistant': record.resistant,
                })}
              >
                <td>{formatAMRName(record)}
                </td>
                <td className="pw-genome-report-amr-mechanisms">
                  {formatAMRMatch(record)}
                </td>
              </tr>))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

