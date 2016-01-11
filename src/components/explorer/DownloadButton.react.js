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
  },

  componentDidUpdate(previous) {
    const { loading, link } = this.props;
    if (previous.loading && (!loading && link)) {
      this.refs.link.click();
    }
  },

  render() {
    const { loading, error, description, link, filename, onClick } = this.props;
    const title =
      `${ !loading && link ? 'Download' : 'Generate' } ${description}`;
    return link ? (
      <a ref="link"
        href={link || '#'}
        target="_blank"
        download={filename}
        title={title}
        className={className}>
          <DownloadIcon hasLink />
          {description}
      </a>
    ) : (
      <button onClick={onClick} title={title} className={className}>
        <DownloadIcon loading={loading} error={error} />
        {description}
      </button>
    );
  },

});
