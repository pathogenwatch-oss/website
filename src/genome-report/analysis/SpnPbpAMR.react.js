import React from 'react';
import classnames from 'classnames';
// {
//   "pbp1a": "2",
//   "pbp2b": "6",
//   "pbp2x": "0"
//   "amxMic": "<= 0.03",
//   "amx": "S",
//   "croMeningitis": "S",
//   "croMic": "<= 0.5",
//   "croNonMeningitis": "S",
//   "ctxMic": "<= 0.06",
//   "ctxNonMeningitis": "S",
//   "ctxMeningitis": "S",
//   "cxmMic": "<= 0.5",
//   "cxm": "S",
//   "memMic": "<= 0.06",
//   "mem": "S",
//   "penMic": "<= 0.03",
//   "penNonMeningitis": "S",
//   "penMeningitis": "S",
// }
const antimicrobials = {
  amx: { name: 'Amoxicillin', type: 'Beta-lactams' },
  cro: { name: 'Ceftriaxone', type: 'Extended-Spectrum Beta-lactams' },
  ctx: { name: 'Cefotaxime', type: 'Broad-spectrum cephalosporins' },
  cxm: { name: 'Cefuroxime', type: 'Beta-lactams' },
  mem: { name: 'Meropenem', type: 'Carbapenems' },
  pen: { name: 'Penicillin', type: 'Beta-lactams' },
};

function formatPhenotype(phenotype) {
  return phenotype
    .replace(/R/g, 'Resistant')
    .replace(/I/g, 'Intermediate')
    .replace(/S/g, 'Sensitive');
}

export default ({ result }) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="https://www.ncbi.nlm.nih.gov/pubmed/27302760" target="_blank"
        rel="noopener" className="pw-genome-report-secondary-link"
      >
        <strong>PBP Analysis</strong> - Li et al, 2016
      </a>
    </p>
    <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
      <caption>Predicted resistance profile</caption>
      <thead>
        <tr>
          <th>Agent</th>
          <th>Predicted MIC</th>
          <th>Inferred phenotype (non/meningitis)</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(antimicrobials).map((agentKey) => (
          <tr
            key={antimicrobials[agentKey].name}
            className={classnames({
              'pw-genome-report-amr-present': true,
              'pw-genome-report-amr-resistant': result[agentKey] === 'R'
                || result[`${agentKey}Meningitis`] === 'R'
                || result[`${agentKey}NonMeningitis`] === 'R',
            })}
          >
            <td>{antimicrobials[agentKey].name}</td>
            <td className="wgsa-genome-report-amr-state">
              {result[`${agentKey}Mic`]}
            </td>
            <td className="wgsa-genome-report-amr-state">
              {formatPhenotype(result.hasOwnProperty(agentKey) ?
                result[agentKey] :
                `${result[`${agentKey}NonMeningitis`]} / ${result[`${agentKey}Meningitis`]}`)
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </React.Fragment>
);
