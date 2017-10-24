import React from 'react';
import { connect } from 'react-redux';

import { showToast } from '../toast';
import { sendSignInToken } from './api';

import Spinner from '../components/Spinner.react';

const SignInPasswordless = createClass({

  propTypes: {
    onEmailSent: PropTypes.func,
  },

  getInitialState() {
    return {
      waiting: false,
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
    e.preventDefault();
    const { email } = this.state;
    if (!email.length) return;
    this.setState({ waiting: true });
    sendSignInToken(email)
      .then(() => {
        this.setState({ showControls: false, waiting: false });
        this.props.onRequestSent(`Your sign-in link has been sent to ${email}.`);
      })
      .catch(error => {
        this.setState({ waiting: false });
        console.error(error);
        this.props.onRequestFailed('Something went wrong, please try again later.');
      });
  },

  render() {
    const { showControls, email } = this.state;

    if (showControls) {
      return (
        <form
          className="cgps-login-controls"
          onSubmit={this.submitForm}
        >
          <input
            type="email"
            value={email}
            placeholder="Email address"
            onChange={this.emailInputChange}
            onKeyUp={this.emailInputKeyUp}
            disabled={this.state.waiting}
            ref={el => { this.emailInput = el; }}
          />
          <button type="submit">
            { this.state.waiting ?
              <Spinner singleColour /> :
              <i className="material-icons">send</i> }
          </button>
        </form>
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
    onRequestSent: (message) => dispatch(showToast({ message })),
    onRequestFailed: (message) => dispatch(showToast({ message })),
  };
}

export default connect(null, mapDispatchToProps)(SignInPasswordless);
