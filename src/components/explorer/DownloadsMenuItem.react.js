import React from 'react';

import DownloadIcon from './DownloadIcon.react';

export default React.createClass({

  displayName: 'DownloadsMenuItem',

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
      // TOGO: autoclick
    }
  },

  render() {
    const { loading, error, description, link, filename, onClick } = this.props;
    const title =
      `${ !loading && link ? 'Download' : 'Generate' } ${description}`;
    return (
      <li className="wgsa-menu__item">
        { link ?
          <a href={link || '#'}
            target="_blank"
            download={filename}
            title={title}>
              <DownloadIcon hasLink />
              {description}
          </a> :
          <button onClick={onClick} title={title}>
            <DownloadIcon loading={loading} error={error} />
            {description}
          </button>
        }
      </li>
    );
  },

});
