import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import LoginLink from '../cgps-commons/LoginLink.react';
import NavLink from '../location';
import AccountHeader from 'cgps-commons/Avatar/Link.react';

import { toggleUserDrawer } from './actions';

import config from '../app/config';

const userLinks = [
  { icon: 'collections', text: 'My Collections', link: '/collections?mine=true' },
  { icon: 'bug_report', text: 'My Genomes', link: '/genomes?mine=true' },
  { icon: 'person', text: 'My Account', link: '/account' },
  { icon: 'exit_to_app', text: 'Sign Out', link: '/signout' },
];

const UserDrawer = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscKey);
  },

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEscKey);
  },

  handleEscKey(e) {
    if (e.keyCode === 27 && this.props.visible) {
      this.props.closeMenu();
    }
  },

  render() {
    const { strategies = [] } = config;
    return (
      <div
        className={classnames('mdl-layout__obfuscator', { 'is-visible': this.props.visible })}
        onClick={this.props.closeMenu}
        onKeyUp={this.handleEscKey}
      >
        <div className={classnames('mdl-layout__drawer', { 'is-visible': this.props.visible })}>
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
            { config.user &&
              <AccountHeader
                user={config.user}
                linkTo="/account"
                image="top"
                className="wgsa-account-header"
              />
            }
            { config.wgsaVersion &&
              <small className="wgsa-version">
                v{config.wgsaVersion}
              </small>
            }
          </span>
          <nav className="mdl-navigation">
            {config.user ?
              userLinks.map(props => <NavLink key={props.link} {...props} />) :
              strategies.map(provider => <LoginLink key={provider} provider={provider} />)}
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
