import React from 'react';

import LoginLinks from './LoginLinks.react';

const Login = ({ location = {}, appName = 'Microreact', strategies, additional }) => {
  const { query = {} } = location;
  const { message } = query;
  return (
    <section className="cgps-login">
      <h3 className="cgps-heading">Sign in to your {appName} account</h3>
      { message && <div>{ message }</div> }
      <LoginLinks strategies={strategies}>
        {additional}
      </LoginLinks>
      <h4 className="cgps-heading">Access to Information</h4>
      <p>
        {appName} accesses your <strong>name</strong>, <strong>email</strong>,
        and <strong>profile photo</strong> when signing in
        with <strong>Google</strong>, <strong>Twitter</strong>, or <strong>Facebook</strong>.
      </p>
      <p>
        Other information, such as <strong>tweets</strong> and <strong>Facebook friends</strong>,
        will not be accessed or stored by {appName}.
      </p>
    </section>
  );
};

Login.displayName = 'Login';

export default Login;
