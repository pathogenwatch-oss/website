import React from 'react';

const sources = {
  SISTR: {
    link: (
      <a
        href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0147101"
        target="_blank"
        rel="noopener"
      >
        <em>Salmonella In Silico</em> Typing Resource (SISTR)
      </a>
    ),
    title: 'Serovar',
  },
};

export default ({ result }) => {
  const source = sources[result.source];
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Serotype</h2>
        {source.link}
      </header>
      <dl className="pw-genome-report-unsized">
        {result.subspecies && (
          <div className="pw-genome-report-metadata">
            <dt>Subspecies</dt>
            <dd>
              <em>{result.subspecies}</em>
            </dd>
          </div>
        )}
        <div className="pw-genome-report-metadata">
          <dt>{source.title}</dt>
          <dd>{result.value}</dd>
        </div>
      </dl>
    </React.Fragment>
  );
};
