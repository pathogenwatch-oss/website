import React from 'react';
import {Metadata} from "../components";

// const kleborateTypingFields1 = [
//   'species',
//   'virulence_score',
//   'resistance_score',
//   'K_locus',
//   'K_locus_confidence',
//   'O_locus',
//   'O_locus_confidence',
//   'wzi',
// ];

export default ({ genome }) => {

  const { kleborate } = genome.analysis;

  const kLocus = kleborate.K_locus + ' (' + kleborate.K_locus_confidence + ')';
  const oLocus = kleborate.O_locus + ' (' + kleborate.O_locus_confidence + ') [' + kleborate.wzi +']';

  const species = kleborate.species === genome.analysis.speciator.species;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h3>Kleborate</h3>
        <a href="https://github.com/katholt/Kleborate" target="_blank"
           rel="noopener">https://github.com/katholt/Kleborate</a>
      </header>
      <dl>
        {species && <Metadata label="Species" children={kleborate.species}/>}
        <Metadata label="K Locus (Confidence)" children={kLocus} />
        <Metadata label="O Locus (Confidence) [wzi]" children={oLocus} />
      </dl>
    </React.Fragment>
  );
}
