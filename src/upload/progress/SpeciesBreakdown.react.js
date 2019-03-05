import React from 'react';
import classnames from 'classnames';

export default React.memo(({ data, showBreakdown = true }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, ...analyses }) => (
      <li key={key}>
        <span className="pw-with-icon wgsa-upload-legend-header">
          <i style={{ backgroundColor: colour }} />
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
                  <li
                    key={analysisKey}
                    className={classnames('pw-with-icon', {
                      success: analysis.total === total,
                    })}
                  >
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
));
