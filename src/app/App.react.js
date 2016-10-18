import './styles.css';
import '../css/menu.css';
import '../css/forms.css';

import React from 'react';
import { connect } from 'react-redux';

import Header from '../header';
import Toast from '../toast';
import DownloadsMenu from '../components/explorer/DownloadsMenu.react';
import NavLink from '../nav-link';

import { locationChange } from '../nav-link';

const menuItems = [
  { icon: 'home',
    text: 'Home',
    link: '/',
  },
  { icon: 'cloud_upload',
    text: 'Upload',
    link: '/upload',
  },
];

function mapStateToProps({ bodyClickListener }) {
  return { bodyClickListener };
}

function mapDispatchToProps(dispatch, { location }) {
  return {
    onLocationChange: () => dispatch(locationChange(location)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    bodyClickListener: React.PropTypes.func,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.hideSidebar();
      this.props.onLocationChange();
    }
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

  render() {
    const { bodyClickListener = () => {}, routes } = this.props;
    const { header } = routes[routes.length - 1];
    return (
      <div ref="layout" className="mdl-layout mdl-js-layout mdl-layout--fixed-header" onClick={bodyClickListener}>
        <Header content={header} />
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
          </span>
          <nav className="mdl-navigation" onClick={this.hideSidebar}>
            {menuItems.map(props => (
              <NavLink key={props.link} {...props} />
            ))}
            <a className="mdl-navigation__link" target="_blank" rel="noopener" href="https://github.com/ImperialCollegeLondon/wgsa-documentation/wiki">
              <i className="material-icons">description</i>
              <span>Documentation</span>
            </a>
          </nav>
          <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
            <img src="/assets/img/CGPS.SHORT.FINAL.svg" />
          </a>
          <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
        </div>
        <main className="mdl-layout__content">
          {this.props.children}
        </main>
        <DownloadsMenu />
        <Toast />
      </div>
    );
  },

}));
