import React from 'react';
import classnames from 'classnames';

import DownloadIcon from '../../downloads/DownloadIcon.react';

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
    const { loading, link } = this.props;
    if (previous.loading && (!loading && link)) {
      this.refs.link.click();
    }
  },

  render() {
    const {
      loading, error, description, link, filename,
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
          {!iconOnly && description}
      </a>
    ) : (
      <button onClick={onClick} title={title} className={classNames}>
        <DownloadIcon
          loading={loading}
          error={error}
          color={color}
          label={label}
          isArchive={isArchive}
        />
        {!iconOnly && <span>{description}</span>}
      </button>
    );
  },

});
