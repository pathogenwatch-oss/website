import React from 'react';

import { analysisLabels } from '../../app/constants';

export default React.memo(({ data, showBreakdown = true }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, ...analyses }) => (
      <li key={key}>
        <span className="pw-with-icon wgsa-upload-legend-header">
          <i className="material-icons" style={{ color: colour }}>
            lens
          </i>
          <strong className="wgsa-upload-legend-organism" title={label}>
            {label}
          </strong>
          <span className="wgsa-upload-legend-count">{total}</span>
        </span>
        {showBreakdown && (
          <ul>
            {Object.keys(analyses).map(analysisKey => {
              const analysis = analyses[analysisKey];
              if (analysisKey in analysisLabels) {
                return (
                  <li key={analysisKey} className="pw-with-icon">
                    {analysisLabels[analysisKey]}
                    <span className="wgsa-upload-legend-count aligned">
                      {analysis.errors > 0 && (
                        <span className="wgsa-upload-legend-count-errors">
                          &nbsp;{analysis.errors} error
                          {analysis.errors === 1 ? '' : 's'}
                        </span>
                      )}
                      {analysis.total === total ? (
                        <i className="material-icons">check_circle</i>
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
        )}
      </li>
    ))}
  </ul>
));
