import React from 'react';

function hasValue(value) {
  return (
    typeof value !== 'undefined' && value !== null
  );
}

const Metadata = ({ label, children }) => (
  hasValue(children) ?
  <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
    <dt className="wgsa-hub-stats-heading">{label}</dt>
    <dd className="wgsa-hub-stats-value">{children}</dd>
  </span> :
  null
);

const Section = ({ heading, version, children }) => (
  <div className="wgsa-analysis-section">
    <h2 className="wgsa-analysis-view-title">
      {heading}
      <span className="wgsa-analysis-version">v{version}</span>
    </h2>
    {children}
  </div>
);

export default ({ analysis }) => {
  const { specieator, mlst, metrics, ...rest } = analysis;
  return (
    <div className="wgsa-analysis-view">
      { mlst &&
        <Section heading="MLST" version={mlst.__v}>
          <dl className="wgsa-hub-stats-view">
            <Metadata label="Sequence Type">{mlst.st}</Metadata>
            <Metadata label="Profile">{mlst.code}</Metadata>
          </dl>
        </Section> }
      { specieator &&
        <Section heading="Specieation" version={specieator.__v}>
          <dl className="wgsa-hub-stats-view">
            <Metadata label="Taxonomy ID">{specieator.organismId}</Metadata>
            <Metadata label="Organism Name">{specieator.organismName}</Metadata>
            <Metadata label="Reference">
              <a href={`http://www.ncbi.nlm.nih.gov/assembly/${specieator.referenceId}/`} target="_blank" rel="noopener">
                {specieator.referenceId}
              </a>
            </Metadata>
            <Metadata label="Mash Distance">{specieator.mashDistance}</Metadata>
            <Metadata label="p-value">{specieator.pValue}</Metadata>
            <Metadata label="Matching Hashes">{specieator.matchingHashes}</Metadata>
          </dl>
        </Section> }
        { Object.keys(rest).map(key => {
          const { __v, ...props } = rest[key];
          return (
            <Section key={key} heading={key} version={__v}>
              <dl className="wgsa-hub-stats-view">
                { Object.keys(props).map(prop =>
                  <Metadata key={prop} label={prop}>{props[prop]}</Metadata>
                )}
              </dl>
            </Section>
          );
        })}
    </div>
  );
};
