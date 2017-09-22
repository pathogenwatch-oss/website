import './styles.css';

import React from 'react';

import { isNovel } from './utils';

export default React.createClass({

  componentDidMount() {
    const { id } = this.props;
    if (isNovel(id) && window && window.Clipboard) {
      this.clipboard = new window.Clipboard(this.el, { text: () => id });
    }
  },

  render() {
    const { id } = this.props;
    if (isNovel(id)) {
      return (
        <i
          ref={el => { this.el = el; }}
          onClick={e => e.stopPropagation()}
          className="material-icons wgsa-mlst-profile-hit"
          title={`Novel Allele: ${id}\n(Click to Copy)`}
        >
          new_releases
        </i>
      );
    }
    return <span className="wgsa-mlst-profile-hit">{id}</span>;
  },

});
