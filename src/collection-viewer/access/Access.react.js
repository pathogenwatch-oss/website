import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

export default ({ access }) => (
  <section className="wgsa-collection-access">
    <h4>Access</h4>
    <ul>
      <li className={access === 'public' ? 'active' : null}>
        <i className="material-icons">public</i>
        <span>
          <strong>Public</strong>
          <br />
          Added to <Link to="/collections">public collections</Link>, no sign-in required.
        </span>
      </li>
      <li className={access === 'shared' ? 'active' : null}>
        <i className="material-icons">link</i>
        <span>
          <strong>Shared</strong>
          <br />
          Available to anyone with the link, no sign-in required.
        </span>
      </li>
      <li className={access === 'private' ? 'active' : null}>
        <i className="material-icons">lock</i>
        <span>
          <strong>Private</strong>
          <br />
          Available to you and specific users.
        </span>
      </li>
    </ul>
  </section>
);
