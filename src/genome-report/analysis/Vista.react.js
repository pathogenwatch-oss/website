import React from 'react';
import classnames from "classnames";

export default ({ result }) => {
  const sortedGenes = result.virulenceGenes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type.localeCompare(b.type);
  });

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h3>Virulence Genes</h3>
      </header>
      <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
        <caption>Virulence genes</caption>
        <thead>
          <tr>
            <th>Phenotype</th>
            <th>Factor</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {sortedGenes.map((record) => (
            <tr
              key={record.name}
              className={classnames({
                'pw-genome-report-amr-present': record.status !== 'Not Found',
                'pw-genome-report-amr-resistant': record.status !== 'Not Found',
              })}
            >
              <td>{record.type}</td>
              <td className="pw-genome-report-amr-mechanisms">{record.name}</td>
              <td className="wgsa-genome-report-amr-state">{
                record.status
                  .replace('Present', '\u2713')
                  .replace('Not found', '\u2a2f')
                  .replace('Incomplete', '\u2053')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Virulence clusters</h3>
      {result.virulenceClusters.map((cluster) => (
        <table cellSpacing="0" className="wgsa-genome-report-amr wide bordered">
          <caption>{cluster.name} - {cluster.type}</caption>
          <thead>
            <tr><th colSpan={cluster.genes.length}>{cluster.name} - {cluster.type}</th></tr>
            <tr>{cluster.genes.map((gene) => (<th>{gene}</th>))}</tr>
          </thead>
          <tbody>
            <tr>{cluster.genes.map((gene) => (
              <td>
                {
                  cluster.matches[gene].status
                    .replace('Present', '\u2713')
                    .replace('Not found', '\u2a2f')
                    .replace('Incomplete', '\u2053')
                }
              </td>))}</tr>
          </tbody>
        </table>
      ))}
    </React.Fragment>
  );
};
