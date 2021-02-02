import React from 'react';

export default ({ genome }) => {
  const { spn_pbp_amr } = genome.analysis;

  function formatST(type) {
    return isNaN(type) ? type.charAt(0).toUpperCase() + type.substring(1).toLowerCase() : type;
  }

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>PBP types</h2>
        <p>
          <a href="https://github.com/BenJamesMetcalf/Spn_Scripts_Reference" target="_blank" rel="noopener">
            https://github.com/BenJamesMetcalf/Spn_Scripts_Reference
          </a>
        </p>
      </header>
      <dl className="flex">
        {
          [ 'pbp1a', 'pbp2b', 'pbp2x' ].map(key => (
            <div className="pw-genome-report-metadata">
              <dt>{key.substring(0, 3).toUpperCase() + key.substring(3)}</dt>
              <dd>{formatST(spn_pbp_amr[key])}</dd>
            </div>
          ))
        }
      </dl>
    </React.Fragment>
  );
};
