import React from 'react';

export default ({ data, showBreakdown }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, ...analyses }) => (
      <li key={key}>
        <span className="wgsa-upload-legend-header">
          <i className="material-icons" style={{ color: colour }}>
            stop
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
              if (analysis.active) {
                return (
                  <li key={analysisKey} className="pw-with-success-icon">
                    {analysis.total === total ? (
                      <React.Fragment>
                        <i className="material-icons">check_circle</i>
                        {analysis.label}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {analysis.label}
                        <span className="wgsa-upload-legend-count">
                          {analysis.total}
                        </span>
                      </React.Fragment>
                    )}
                    {analysis.errors > 0 && (
                      <small>
                        &nbsp;{analysis.errors} error
                        {analysis.errors === 1 ? '' : 's'}
                      </small>
                    )}
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
);
