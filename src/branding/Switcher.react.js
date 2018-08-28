import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { changeBranding } from './actions';

import { brandings } from './constants';

class Switcher extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(next) {
    if (next.activeBranding !== this.props.activeBranding) {
      this.setState({ open: false });
    }
  }

  render() {
    const { activeBranding, switchBrand } = this.props;
    return (
      <aside className="cgps-brand-switcher">
        <button
          title="Select Branding"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          {this.props.children}
        </button>
        <ul className={classnames('cgps-menu', { open: this.state.open })}>
          { brandings.map(brandId =>
            <li
              key={brandId}
              onClick={() => switchBrand(brandId)}
              className={classnames(
                'cgps-menu-item',
                { active: activeBranding === brandId }
              )}
            >
              {brandId}
            </li>
          )}
        </ul>
      </aside>
    );
  }

}

function mapStateToProps(state) {
  return {
    activeBranding: state.branding.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchBrand: brandId => dispatch(changeBranding(brandId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Switcher);
