import React from 'react';
import { connect } from 'react-redux';

const Header = React.createClass({

  render() {
    const { speciesName, classNames, content } = this.props;
    return (
      <header className={`mdl-layout__header mdl-layout__header--scroll ${classNames}`.trim()}>
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">WGSA {speciesName ? (<span>| {speciesName}</span>) : null}</span>
          {content}
        </div>
      </header>
    );
  },

});

function mapStateToProps({ display }) {
  return display.header;
}

export default connect(mapStateToProps)(Header);
