import React from 'react';
import ExternalLink from '../ExternalLink.react';


export default ({ genome }) => {
  const { pangolin } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>SARS-CoV-2 Typing</h2>
        <p>
          <a
            href="https://github.com/cov-lineages/pangolin"
            target="_blank"
            rel="noopener"
            title="View original software source at GitHub."
          >
            https://github.com/cov-lineages/pangolin
          </a>
        </p>
      </header>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>Lineage</dt>
          <dd>{pangolin.lineage}</dd>
        </div>
        {!!pangolin.probability ?
          (<div>
            <dt>Probability</dt>
            <dd>{pangolin.probability}</dd>
          </div>) :
          (<div>
            <dt>Conflict</dt>
            <dd>{pangolin.conflict}</dd>
          </div>)
        }
        <div>
          <dt>QC Status</dt>
          <dd>{pangolin.qc_status}</dd>
        </div>
        <div><dt>Pangolin version</dt><dd>{pangolin.pangolin_version}</dd></div>
        <div><dt>Pangolin-data version</dt><dd>{pangolin.pangolin_data_version}</dd></div>
      </dl>
      <dl>
        <dt>Lineage Links</dt>
        <dd>
          <ExternalLink
            to={`https://cov-lineages.org/lineages/lineage_${pangolin.lineage}.html`}
          >
          View {pangolin.lineage} at PANGO lineages.
          </ExternalLink>
          <ExternalLink
            to={`https://microreact.org/project/cogconsortium-pangolin-global/?dfc=lineage&dfo=equals&dfv=${pangolin.lineage}`}
          >
            View {pangolin.lineage} in the COG-UK Global Microreact.
          </ExternalLink>
          <ExternalLink
            to={`https://microreact.org/project/cogconsortium-pangolin/?dfc=lineage&dfo=equals&dfv=${pangolin.lineage}`}
          >
          View {pangolin.lineage} in the COG-UK Regional Microreact.
          </ExternalLink>
        </dd>
      </dl>
    </React.Fragment>
  );
};

