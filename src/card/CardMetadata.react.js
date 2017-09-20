import React from 'react';
import classnames from 'classnames';

import GenomeIcon from '../components/GenomeIcon.react';

function showIcon(icon, title) {
  if (!icon) return null;
  if (icon === 'wgsa_genome') return <GenomeIcon title={title} />;
  return <i title={title} className="material-icons">{icon}</i>;
}

export default ({ className, children, tooltip, title, icon, fadeOverflow }) => (
  <div
    className={classnames(className, 'wgsa-card-metadata', { 'wgsa-overflow-fade': fadeOverflow })}
    title={tooltip}
  >
    {showIcon(icon, title)}
    {children}
  </div>
);
