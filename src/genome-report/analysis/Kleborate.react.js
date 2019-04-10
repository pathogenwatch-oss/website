import React from 'react';
import classnames from 'classnames';

const kleborateTypingFields2 = [
  'Yersiniabactin',
  'YbST',
  'Colibactin',
  'CbST',
  'Aerobactin',
  'AbST',
  'Salmochelin',
  'SmST',
  'rmpA',
  'rmpA2',
];

const kleborateTypingFields1 = [
  'species',
  'virulence_score',
  'resistance_score',
  'K_locus',
  'K_locus_confidence',
  'O_locus',
  'O_locus_confidence',
  'wzi',
];

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
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Kleborate</h2>
      <a href="https://github.com/katholt/Kleborate" target="_blank"
         rel="noopener">https://github.com/katholt/Kleborate</a>
    </header>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields1
          .filter(field => field !== 'wzi')
          .map((klebType) =>
            <th key={klebType}>{
              klebType
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/^K Locus$/, 'K Locus Best Match')
                .replace(/^O Locus$/, 'O Locus Best Match')
            }</th>)
        }
        <th key="wzi" className="italic">wzi</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td key="species" className="italic">{result.species}</td>
        {kleborateTypingFields1
          .filter(field => field !== 'species')
          .filter(field => field !== 'wzi')
          .map((klebType) =>
            <td key={klebType}>{result[klebType]}</td>)}
        <td key="wzi" className="italic">{result.wzi}</td>
      </tr>
      </tbody>
    </table>
    <table className="pw-kleborate-table" cellSpacing="0">
      <caption>Virulence Locus Typing</caption>
      <thead>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <th key={klebType}>{klebType.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        {kleborateTypingFields2.map((klebType) =>
          <td key={klebType}>{result[klebType]}</td>)}
      </tr>
      </tbody>
    </table>
    <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
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
  </React.Fragment>
);



