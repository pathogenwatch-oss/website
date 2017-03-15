import React from 'react';
import classnames from 'classnames';

import DownloadIcon from './DownloadIcon.react';

import { statuses } from './constants';

export default React.createClass({

  displayName: 'DownloadButton',

  propTypes: {
    loading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    description: React.PropTypes.string,
    link: React.PropTypes.string,
    filename: React.PropTypes.string,
    onClick: React.PropTypes.func,
    label: React.PropTypes.string,
    color: React.PropTypes.string,
    isArchive: React.PropTypes.bool,
    iconOnly: React.PropTypes.bool,
  },

  componentDidUpdate(previous) {
    const { status } = this.props;
    if (previous.status === statuses.LOADING && status === statuses.SUCCESS) {
      this.link.click();
    }
  },

  render() {
    const {
      status, link, filename, onClick, label, color, isArchive, iconOnly,
    } = this.props;

    const title = `Download ${label}`;
    const classNames = classnames(
      'wgsa-download-button',
      { 'mdl-button mdl-button--icon': iconOnly }
    );

    const icon = (
      <DownloadIcon
        status={status}
        color={color}
        isArchive={isArchive}
      />
    );

    return status === statuses.SUCCESS ? (
      <a ref={el => { this.link = el; }}
        href={link || '#'}
        target="_blank" rel="noopener"
        download={filename}
        title={title}
        className={classNames}
      >
        {icon}
        {!iconOnly && label}
      </a>
    ) : (
      <button onClick={onClick} title={title} className={classNames}>
        {icon}
        {!iconOnly && <span>{label}</span>}
      </button>
    );
  },

});
