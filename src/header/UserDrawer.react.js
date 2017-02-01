import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import LoginLink from '../cgps-commons/LoginLink.react';

import { toggleUserDrawer } from './actions';

import config from '../app/config';

const UserDrawer = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    closeMenu: React.PropTypes.func,
  },

  render() {
    const { strategies = [] } = config;
    return (
      <div
        className={classnames('mdl-layout__obfuscator', { 'is-visible': this.props.visible })}
        onClick={this.props.closeMenu}
      >
        <div className={classnames('mdl-layout__drawer', { 'is-visible': this.props.visible })}>
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
            { config.wgsaVersion &&
              <small className="wgsa-version">
                v{config.wgsaVersion}
              </small>
            }
          </span>
          <nav className="mdl-navigation">
            {strategies.map(provider => <LoginLink provider={provider} />)}
          </nav>
          <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
            <img src="/assets/img/CGPS.SHORT.FINAL.svg" />
          </a>
          <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
        </div>
      </div>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(toggleUserDrawer(false)),
  };
}

export default connect(null, mapDispatchToProps)(UserDrawer);
