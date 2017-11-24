import React from 'react';
import classnames from 'classnames';
import { Metadata } from '../components';

import { taxIdMap } from '../../../organisms';

const PAARSNP = React.createClass({

  getInitialState() {
    return {
      antibiotic: undefined,
    };
  },

  getTableHeaders() {
    const { antibiotics = [] } = this.props;
    const { antibiotic = {} } = this.state;

    return antibiotics.map(ab =>
      <th
        key={ab.name}
        title={ab.fullName}
        className={classnames(
          'wgsa-amr',
          antibiotic.name === ab.name ? 'active' : 'inactive'
        )}
        onClick={() => this.setState({ antibiotic: ab })}
      >
        {ab.name}
      </th>
    );
  },

  getTableCells() {
    const { antibiotics = [] } = this.props;
    return antibiotics.map(antibiotic => {
      const { name, fullName, state } = antibiotic;
      return (
        <td className="wgsa-amr" key={name}>
          { state !== 'UNKNOWN' && state !== 'NOT_FOUND' &&
            <i
              title={`${fullName}: ${state}`}
              className={`material-icons wgsa-amr--${state.toLowerCase()}`}
              onClick={() => this.setState({ antibiotic })}
            >
              lens
            </i> }
        </td>
      );
    });
  },

  displayMechanisms(result) {
    const { antibiotic } = this.state;

    if (!antibiotic) {
      return '(Select Antibiotic)';
    }

    const mechanisms = antibiotic.mechanisms.filter(m => result.includes(m));
    return (
      <ul>
        { mechanisms.map(m => <li key={m}>{m}</li>) }
      </ul>
    );
  },

  render() {
    const { snp = [], paar = [] } = this.props;
    return (
      <dl>
        <Metadata large label="Antibiotics">
          <table>
            <thead>
              <tr>
                { this.getTableHeaders() }
              </tr>
            </thead>
            <tbody>
              <tr>
                { this.getTableCells() }
              </tr>
            </tbody>
          </table>
        </Metadata>
        <Metadata label="SNPs">
          { this.displayMechanisms(snp) }
        </Metadata>
        <Metadata label="Genes">
          { this.displayMechanisms(paar) }
        </Metadata>
      </dl>
    );
  },

});

export default ({ result, genome }) => {
  const { antibiotics, ...rest } = result;
  const { organismId } = genome;
  let hiddenColumns = new Set();

  if (taxIdMap.has(organismId)) {
    const { amrOptions = {} } = taxIdMap.get(organismId);
    if (amrOptions && amrOptions.hiddenColumns) {
      hiddenColumns = amrOptions.hiddenColumns;
    }
  }

  const filteredAntibiotics =
    hiddenColumns.size ?
      antibiotics.filter(({ name }) => !hiddenColumns.has(name)) :
      antibiotics;

  return <PAARSNP antibiotics={filteredAntibiotics} {...rest} />;
};
