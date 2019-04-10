import React from 'react';
import classnames from 'classnames';

const kleborateAmrFields = [
  'AGly',
  'Col',
  'Fcyn',
  'Flq',
  'Gly',
  'MLS',
  'Ntmdz',
  'Phe',
  'Rif',
  'Sul',
  'Tet',
  'Tmt',
  'Bla',
  'Bla_Carb',
  'Bla_ESBL',
  'Bla_ESBL_inhR',
  'Bla_broad',
  'Bla_broad_inhR',
];

const klebAgentLinks = {
  'AGly': {name: "Aminoglycosides", key: "AGS", type: "Aminoglycosides"},
  'Col': {name: "Colistin", key: "CST", type: "Colistin"},
  'Fcyn': {name: "Fosfomycin", key: "FOF", type: "Phosphonic Acid"},
  'Flq': {name: "Fluoroquinolones", key: "FLQ", type: "Fluoroquinolones"},
  'Gly': {name: "Glycopeptides", key: "GPA", type: "Glycopeptides"},
  'MLS': {name: "Macrolides", key: "MAC", type: "Macrolides"},
  'Ntmdz': {name: "Nitroimidazoles", key: "NIM", type: "Nitroimidazoles"},
  'Phe': {name: "Phenicols", key: "PHE", type: "Phenicols"},
  'Rif': {name: "Rifampicin", key: "RIF", type: "Rifamycin"},
  'Sul': {name: "Sulfonamides", key: "SMX", type: "Sulfonamides"},
  'Tet': {name: "Tetracycline", key: "TCY", type: "Tetracyclines"},
  'Tmt': {name: "Trimethoprim", key: "TMP", type: "Diaminopyrimidine"},
  'Bla': {name: "Beta-lactams", key: "BLA", type: "Beta-Lactams"},
  'Bla_Carb': {name: "Carbapenems", key: "CBP", type: "Carbapenems"},
  'Bla_ESBL': {name: "ESBLs", key: "EBL", type: "Extended Spectrum Beta-Lactams"},
  'Bla_ESBL_inhR': {name: "ESBL Inhibitors", key: "EBI", type: "ESBL Inhibitors"},
  'Bla_broad': {name: "Broad-Spectrum Cephalosporins", key: "CEP", type: "Broad-Spectrum Cephalosporins"},
  'Bla_broad_inhR': {name: "BSBL Inhibitors", key: "BBI", type: "Broad-Spectrum Beta-Lactam Inhibitors"},
};

export default ({result}) => (
  <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
    <header>
      <h3>Kleborate AMR</h3>
      <a href="https://github.com/katholt/Kleborate" target="_blank"
         rel="noopener">https://github.com/katholt/Kleborate</a>
    </header>
    <caption>Resistance Profile</caption>
    <thead>
    <tr>
      <th>Agent</th>
      <th>Variants/Genes</th>
    </tr>
    </thead>
    <tbody>
    {kleborateAmrFields.map((klebName) => (
      <tr
        key={klebAgentLinks[klebName].name}
        className={classnames({
          'pw-genome-report-amr-present': result[klebName] !== '-',
          'pw-genome-report-amr-resistant': result[klebName] !== '-',
        })}
      >
        <td>{klebAgentLinks[klebName].name}</td>
        <td className="pw-genome-report-amr-mechanisms">
          {result[klebName]
            .replace(/;/gi, ', ')
            .replace(/\*/gi, '_homolog')
            .replace(/\?/gi, '_fragment')
          }
        </td>
      </tr>
    ))}
    </tbody>
  </table>
)

