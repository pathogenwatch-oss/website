import React from 'react';

import DownloadIcon from './DownloadIcon.react';

const className = 'wgsa-download-button';

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
      onClick, label, color, isArchive,
    } = this.props;
    const title =
      `${ !loading && link ? 'Download' : 'Generate' } ${description}`;
    return link ? (
      <a ref="link"
        href={link || '#'}
        target="_blank"
        download={filename}
        title={title}
        className={className}>
          <DownloadIcon hasLink color={color}/>
          {description}
      </a>
    ) : (
      <button onClick={onClick} title={title} className={className}>
        <DownloadIcon
          loading={loading}
          error={error}
          color={color}
          label={label}
          isArchive={isArchive}
        />
        {description}
      </button>
    );
  },

});
