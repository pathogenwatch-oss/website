import React from 'react';
import classnames from 'classnames';

import DownloadIcon from '../../downloads/DownloadIcon.react';

import { statuses } from '../../downloads/constants';

export default React.createClass({

  displayName: 'DownloadButton',

  propTypes: {
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
    const { status, link } = this.props;

    if (previous.status !== statuses.LOADING) {
      return;
    }

    if (status === statuses.SUCCESS && link) {
      this.refs.link.click();
    }
  },

  render() {
    const {
      status, description, link, filename,
      onClick, label, color, isArchive, iconOnly,
    } = this.props;

    const title = `Download ${description}`;
    const classNames = classnames(
      'wgsa-download-button',
      { 'mdl-button mdl-button--icon': iconOnly }
    );

    return link ? (
      <a ref="link"
        href={link || '#'}
        target="_blank" rel="noopener"
        download={filename}
        title={title}
        className={classNames}
      >
        <DownloadIcon hasLink color={color} />
        {!iconOnly && <span>{description}</span>}
      </a>
    ) : (
      <button onClick={onClick} title={title} className={classNames}>
        <DownloadIcon
          status={status}
          color={color}
          label={label}
          isArchive={isArchive}
        />
        {!iconOnly && <span>{description}</span>}
      </button>
    );
  },

});
