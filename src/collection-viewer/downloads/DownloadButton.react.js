import React from 'react';

import { createCSVLink } from './client-side';

const DownloadButton = React.createClass({
  getInitialState() {
    return {
      link: null,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.genomeIds !== nextProps.genomeIds) {
      this.setState({ link: null });
    }
  },
  componentDidUpdate(_, previous) {
    if (!previous.link && this.state.link) {
      this.link.click();
    }
  },
  onClick() {
    this.props.generateFile()
      .then(data => {
        this.setState({ link: createCSVLink(data) });
      });
  },
  render() {
    const { filename, title, children, className } = this.props;
    if (this.state.link) {
      return (
        <a
          ref={el => { this.link = el; }}
          href={this.state.link}
          target="_blank" rel="noopener"
          download={filename}
          title={title}
          className={className}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        onClick={this.onClick}
        title={title}
        className={className}
      >
        {children}
      </button>
    );
  },
});

export default DownloadButton;
