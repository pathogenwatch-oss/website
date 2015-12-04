import React from 'react';

export default React.createClass({

  displayName: 'DownloadsMenuItem',

  propTypes: {
    loading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    description: React.PropTypes.string,
    link: React.PropTypes.string,
    filename: React.PropTypes.string,
  },

  componentDidUpdate(previous) {
    const { loading, error } = this.props;
    if (!previous.loading && (loading && !error)) {
      // TOGO: autoclick
    }
  },

  render() {
    const { loading, error, description, link, filename } = this.props;
    const title =
      `${ !loading && link ? 'Download' : 'Generate' } ${description}`;
    return (
      <li className="wgsa-menu__item">
        <a href={link || '#'}
          target="_blank"
          download={filename}
          title={title}>
            <span className="wgsa-download-button mdl-button mdl-button--icon">
              <i className="wgsa-button-icon material-icons">file_download</i>
            </span>
            {description}
        </a>
      </li>
    );
  },

});
