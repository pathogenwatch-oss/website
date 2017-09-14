import React from 'react';
import classnames from 'classnames';
import { Section, Metadata } from '../components';

export default React.createClass({

  getInitialState() {
    return {
      antibiotic: null,
    };
  },

  getTableHeaders() {
    const { antibiotics = [] } = this.props;
    const { antibiotic } = this.state;
    return antibiotics.map(({ name, fullName }) =>
      <th
        key={name}
        title={fullName}
        className={classnames({ active: antibiotic.name === name })}
      >
        {name}
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

  render() {
    const { __v, snp = [], paar = [] } = this.props;
    const { antibiotic } = this.state;
    return (
      <Section heading="PAARSNP" version={__v}>
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
          { antibiotic &&
            <Metadata label="SNPs">
              {antibiotic.mechanisms.filter(m => snp.includes(m)).join(', ')}
            </Metadata> }
          { antibiotic &&
            <Metadata label="Genes">
              {antibiotic.mechanisms.filter(m => paar.includes(m)).join(', ')}
            </Metadata> }
        </dl>
      </Section>
    );
  },

});
