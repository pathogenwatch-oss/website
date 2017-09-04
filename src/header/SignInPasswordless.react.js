import React from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import { showToast } from '../toast';
import { sendSignInToken } from './api';

const SignInPasswordless = React.createClass({

  propTypes: {
    onEmailSent: React.PropTypes.func,
  },

  getInitialState() {
    return {
      showControls: false,
      email: '',
    };
  },

  showControls(e) {
    e.stopPropagation();
    this.setState({ showControls: true }, () => this.emailInput.focus());
  },

  emailInputChange(e) {
    this.setState({ email: e.target.value });
  },

  emailInputKeyUp(e) {
    if (e.key === 'Escape') {
      this.setState({ showControls: false });
      e.stopPropagation();
    }
  },

  submitForm(e) {
    const { email } = this.state;
    e.stopPropagation();
    sendSignInToken(email)
      .then(() => {
        this.setState({ showControls: false });
        this.props.onEmailSent(`Sign in token has been sent to ${email}`);
      });
  },

  render() {
    const { showControls, email } = this.state;

    if (showControls) {
      return (
        <div className="cgps-login-controls">
          <input
            type="email"
            value={email}
            placeholder="Email address"
            onClick={this.showControls}
            onChange={this.emailInputChange}
            onKeyUp={this.emailInputKeyUp}
            ref={el => { this.emailInput = el; }}
          />
          <button onClick={this.submitForm}>
            <i className="material-icons">vpn_key</i>
          </button>
        </div>
      );
    }

    return (
      <a className="cgps-login-link cgps-login-link--passwordless" onClick={this.showControls}>
        <span className="cgps-login-link__icon"></span>
        <span className="cgps-login-link__text">Sign in with an email</span>
      </a>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    onEmailSent: (message) => dispatch(showToast({ message })),
  };
}

export default connect(null, mapDispatchToProps)(SignInPasswordless);
