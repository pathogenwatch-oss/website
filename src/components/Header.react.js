import React from 'react';
import { connect } from 'react-redux';

const Header = React.createClass({

  render() {
    const { hasAside, content } = this.props;
    const classNames = [
      'mdl-layout__header mdl-layout__header--scroll',
      hasAside ? 'wgsa-has-aside' : '',
      this.props.classNames || '',
    ];
    return (
      <header className={classNames.join(' ').trim()}>
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-header-logo" />
          </span>
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
