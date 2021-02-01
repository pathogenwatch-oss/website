import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getSpeciesBreakdown } from './analysis/selectors';
import { isSpecieationComplete } from './selectors';

const SpeciesBreakdown = ({ data, speciesPredictionComplete }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, analyses = [] }) => (
      <li key={key}>
        <span className="pw-with-icon wgsa-upload-legend-header">
          <i className="material-icons" style={{ color: colour }}>
            lens
          </i>
          <strong className="wgsa-upload-legend-organism" title={label}>
            {label}
          </strong>
          <span className="wgsa-upload-legend-count">{total.toLocaleString()}</span>
        </span>
        <ul>
          {analyses.map(analysis => {
            if (analysis.key === 'speciator') return null;
            if (analysis.label) {
              return (
                <li key={analysis.key} className="pw-with-icon">
                  {analysis.label}
                  {!!analysis.source && <React.Fragment>&nbsp;<small>({analysis.source})</small></React.Fragment>}
                  <span className="wgsa-upload-legend-count aligned">
                    {analysis.errors > 0 && (
                      <span className="wgsa-upload-legend-count-errors">
                        &nbsp;{analysis.errors} error{analysis.errors === 1 ? '' : 's'}
                      </span>
                    )}
                    {speciesPredictionComplete && analysis.total === total ? (
                      <i className={classnames('material-icons', { success: !(analysis.errors > 0) })}>
                        {analysis.errors > 0 ? 'error_outline' : 'check_circle'}
                      </i>
                    ) : (
                      analysis.total
                    )}
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </li>
    ))}
  </ul>
);

function mapStateToProps(state) {
  return {
    data: getSpeciesBreakdown(state),
    speciesPredictionComplete: isSpecieationComplete(state),
  };
}

export default connect(mapStateToProps)(SpeciesBreakdown);
