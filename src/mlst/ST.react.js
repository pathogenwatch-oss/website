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
    const { id, textOnly = false } = this.props;
    if (isNovel(id)) {
      const abbreviatedId = id.substr(0, 4);
      return (
        <span ref={el => { this.el = el; }}
          className="wgsa-mlst-hit"
          title={`Novel ST: ${id}\n(Click to Copy)`}
          onClick={e => e.stopPropagation()}
        >
          { !textOnly && <i className="material-icons">new_releases</i> }
          {textOnly ? `(${abbreviatedId})` : abbreviatedId}
        </span>
      );
    }

    return (
      <span className="wgsa-mlst-hit">{id}</span>
    );
  },

});
