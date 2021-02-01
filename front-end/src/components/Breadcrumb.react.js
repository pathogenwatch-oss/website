import React from 'react';

export default ({ children }) => (
  <div className="wgsa-page-breadcrumb">
    { children.map((child, index) => (
      index < children.length - 1 ?
        <span key={index}>{child}&nbsp;&raquo;&nbsp;</span> :
        <span key={index}>{child}</span>
    ))}
  </div>
);
