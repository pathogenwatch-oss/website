import React from 'react';

export default ({ to, children }) => (
  <div className="pw-genome-report-external-link">
    <a
      className="pw-genome-report-link"
      href={to}
      target="_blank"
      rel="noopener"
    >
      {children}
    </a>
    <i className="material-icons">launch</i>
  </div>
);
