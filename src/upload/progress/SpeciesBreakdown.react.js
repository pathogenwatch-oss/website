import React from 'react';

export default ({ data, showBreakdown }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, ...analyses }) => (
      <li key={key}>
        <span>
          <i className="material-icons" style={{ color: colour }}>
            stop
          </i>
          <strong className="wgsa-upload-legend-organism" title={label}>
            {label}
          </strong>
          &nbsp;({total})
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
                      `${analysis.label}: ${analysis.total} / ${total}`
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
