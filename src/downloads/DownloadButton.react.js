import React from 'react';
import classnames from 'classnames';

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
  },

  componentDidUpdate(previous) {
    const { status } = this.props;
    if (previous.status === statuses.LOADING && status === statuses.SUCCESS) {
      this.link.click();
    }
  },

  render() {
    const { status, link, filename, onClick, label } = this.props;

    const title = this.props.title || `Download ${label}`;
    const classNames = classnames(
      'wgsa-download-button',
      { 'mdl-button mdl-button--icon': !label }
    );
    const icon = React.cloneElement(this.props.children, { status });

    return status === statuses.SUCCESS ? (
      <a ref={el => { this.link = el; }}
        href={link || '#'}
        target="_blank" rel="noopener"
        download={filename}
        title={title}
        className={classNames}
      >
        {icon}
        {label}
      </a>
    ) : (
      <button
        onClick={onClick}
        title={title}
        className={classNames}
        disabled={this.props.disabled}
      >
        {icon}
        {label && <span>{label}</span>}
      </button>
    );
  },

});
