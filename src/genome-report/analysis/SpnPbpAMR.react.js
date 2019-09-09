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
  amx: { name: 'Amoxicillin', key: 'amx', type: 'Beta-Lactams' },
  cro: { name: 'Ceftriaxone', key: 'cro', type: 'Extended-Spectrum Beta-Lactams' },
  ctx: { name: 'Cefotaxime', key: 'ctx', type: 'Broad-spectrum Cephalosporins' },
  cxm: { name: 'Cefuroxime', key: 'cxm', type: 'Beta-lactams' },
  mem: { name: 'Meropenem', key: 'mem', type: 'Carbapenems' },
  pen: { name: 'Penicillin', key: 'pen', type: 'Beta-Lactams' },
};

export default ({result}) => (
  <React.Fragment>
    <p className="pw-genome-report-section-header">
      <a href="" target="_blank"
         rel="noopener" className="pw-genome-report-secondary-link"
      >
        <strong>CDC PBP Analysis</strong>
      </a>
    </p>
    <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
      <caption>Predicted Resistance Profile</caption>
      <thead>
      <tr>
        <th>Agent</th>
        <th>MIC</th>
        <th>Phenotype (Non/Meningitis)</th>
      </tr>
      </thead>
      <tbody>
      {antimicrobials.map((agentKey) => (
        <tr
          key={antimicrobials[agentKey].name}
          className={classnames({
            'pw-genome-report-amr-present': result[agentKey] === 'NF'
              || result[`${agentKey}Meningitis`] === 'NF'
              || result[`${agentKey}NonMeningitis`] === 'NF',
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
            {result.hasOwnProperty(agentKey) ?
              result[agentKey] :
              `(${result[`${agentKey}Meningitis`]} / ${result[`${agentKey}NonMeningitis`]})`
            }
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </React.Fragment>
);
