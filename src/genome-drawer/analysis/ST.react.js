import './styles.css';

import React from 'react';

import { isNovel } from '../../utils/mlst';

export default ({ id }) => {
  if (isNovel(id)) {
    return (
      <span className="wgsa-mlst-hit" title={`Novel ST: ${id}`}>
        <i className="material-icons">new_releases</i>
        {id.substr(0, 4)}
      </span>
    );
  }

  return (
    <span className="wgsa-mlst-hit">{id}</span>
  );
};
