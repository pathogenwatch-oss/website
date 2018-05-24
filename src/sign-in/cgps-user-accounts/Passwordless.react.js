import React from 'react';

class SignInPasswordless extends React.Component {
  static displayName = 'SignInPasswordless';

  state = {
    sending: false,
    showControls: false,
    email: '',
  };

  showControls = (e) => {
    e.stopPropagation();
    this.setState({ showControls: true }, () => this.emailInput.focus());
  };

  emailInputChange = (e) => {
    this.setState({ email: e.target.value });
  };

  emailInputKeyUp = (e) => {
    if (e.key === 'Escape') {
      this.setState({ showControls: false });
      e.stopPropagation();
    }
  };

  submitForm = (e) => {
    e.preventDefault();
    const { email } = this.state;
    if (!email.length) return;
    const { getPasswordlessToken, showMessage } = this.props;
    this.setState({ sending: true });
    getPasswordlessToken(email)
      .then(() => {
        this.setState({ showControls: false, sending: false });
        showMessage(`Your sign-in link has been sent to ${email}.`);
      })
      .catch(error => {
        this.setState({ sending: false });
        console.error(error);
        showMessage('Something went wrong, please try again later.');
      });
  };

  render() {
    const { showControls, email } = this.state;
    const Spinner = this.props.spinner;
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
            disabled={this.state.sending}
            ref={el => { this.emailInput = el; }}
          />
          <button type="submit">
            {
              (this.state.sending) ?
              <Spinner /> :
              <i className="material-icons">send</i>
            }
          </button>
        </form>
      );
    }

    return (
      <a className="cgps-login-button cgps-login-button--passwordless" onClick={this.showControls}>
        <span className="cgps-login-button__icon"></span>
        <span className="cgps-login-button__text">Sign in with an email</span>
      </a>
    );
  }
}

export default SignInPasswordless;
