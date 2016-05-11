import './css/menu.css';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Header from './components/Header.react';
import Toast from './components/Toast.react';
import DownloadsMenu from './components/explorer/DownloadsMenu.react';

import Staph from './species/saureus';

const MenuLink = ({ isActive, icon, text, link }) => (
  <Link className={`mdl-navigation__link ${isActive ? 'mdl-navigation__link--active' : ''}`.trim()} to={link}>
    <i className="material-icons">{icon}</i>
    {text}
  </Link>
);

const menuItems = [
  { icon: 'home',
    text: 'Home',
    link: '/',
  },
  { icon: 'bug_report',
    text: <span>{Staph.formattedShortName}</span>,
    link: `/${Staph.nickname}`,
  },
  { icon: 'cloud_upload',
    text: 'Create Collection',
    link: `/${Staph.nickname}/upload`,
  },
];

function mapStateToProps({ bodyClickListener }) {
  return { bodyClickListener };
}

export default connect(mapStateToProps)(React.createClass({

  propTypes: {
    children: React.PropTypes.element,
    location: React.PropTypes.object,
    bodyClickListener: React.PropTypes.func,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.menuButton = document.querySelector('.mdl-layout__drawer-button');
  },

  componentDidUpdate(previous) {
    if (this.props.location !== previous.location) {
      this.hideSidebar();
    }
  },

  render() {
    const { children, location, bodyClickListener = () => {} } = this.props;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header" onClick={bodyClickListener}>
        <Header />
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
          </span>
          <nav className="mdl-navigation" onClick={this.hideSidebar}>
            {menuItems.map(props => (
              <MenuLink key={props.link}
                isActive={location.pathname === props.link}
                {...props}
              />
            ))}
            <a className="mdl-navigation__link" target="_blank" href="https://github.com/ImperialCollegeLondon/wgsa-documentation/wiki">
              <i className="material-icons">description</i>
              Documentation
            </a>
          </nav>
          <a className="cgps-logo" target="_blank" href="http://www.pathogensurveillance.net">
            <img src="/assets/img/CGPS.SHORT.FINAL.svg" />
          </a>
          <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
        </div>
        <main className="mdl-layout__content">
          {children}
        </main>
        <DownloadsMenu />
        <Toast />
      </div>
    );
  },

  hideSidebar() {
    if (this.menuButton.getAttribute('aria-expanded') === 'true') {
      this.menuButton.click();
    }
  },

}));
