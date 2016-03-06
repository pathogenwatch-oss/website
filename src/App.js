import './css/menu.css';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Header from './components/Header.react';
import Toast from './components/Toast.react';
import DownloadsMenu from './components/explorer/DownloadsMenu.react';

import Staph from './species/saureus';

const MenuLink = ({ isActive, icon, text, link }) => (
  <Link className={`mdl-navigation__link ${isActive ? 'mdl-navigation__link--active' : null}`.trim()} to={link}>
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
    text: <span>{Staph.shortFormattedName}</span>,
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
          </nav>
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
