import React from 'react';

import ExternalLink from '../ExternalLink.react';

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
    title: 'serovar',
  },
  SeroBA: {
    link: (
      <a
        href="https://mgen.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000186"
        target="_blank"
        rel="noopener"
      >
        SeroBA
      </a>
    ),
    docs: 'https://cgps.gitbook.io/pathogenwatch/technical-descriptions/typing-methods/seroba',
  },
};

export default ({ genome }) => {
  const { speciator, serotype } = genome.analysis;
  const { link = <span>(unspecified source)</span>, title = 'serotype', docs } =
    sources[serotype.source] || {};

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Serotype</h2>
        <p>{link}</p>
      </header>
      <dl className="flex">
        {serotype.subspecies && (
          <div className="pw-genome-report-metadata">
            <dt>Subspecies</dt>
            <dd>
              <em>{serotype.subspecies}</em>
            </dd>
          </div>
        )}
        <div className="pw-genome-report-metadata">
          <dt className="pw-capitalise">{title}</dt>
          <dd>
            {serotype.value}
            {serotype.warn && docs &&
              <a href={docs} target="_blank" rel="noopener" className="pw-genome-report-secondary-link">
                Guidance on this result
              </a>
            }
          </dd>
        </div>
      </dl>
      <ExternalLink
        to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
          speciator.speciesId
        }&serotype=${serotype.value}`}
      >
        View all {title} {serotype.value}
      </ExternalLink>
    </React.Fragment>
  );
};
