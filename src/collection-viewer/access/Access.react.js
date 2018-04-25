import React from 'react';
import { Link } from 'react-router-dom';

export default ({ access }) => (
  <section className="wgsa-collection-access">
    <h4>Access</h4>
    <ul>
      <li className={access === 'public' ? 'active' : null}>
        <i className="material-icons">public</i>
        <button title="Set Access to Public">
          <strong>Public</strong>
          <br />
          Available to all, added to <Link to="/collections">public collections</Link>.
        </button>
      </li>
      <li className={access === 'shared' ? 'active' : null}>
        <i className="material-icons">link</i>
        <button title="Set Access to Shared">
          <strong>Shared</strong>
          <br />
          Available to anyone with the link, no sign-in required.
        </button>
      </li>
      <li className={access === 'private' ? 'active' : null}>
        <i className="material-icons">lock</i>
        <button title="Set Access to Private">
          <strong>Private</strong>
          <br />
          Available to you only.
        </button>
      </li>
    </ul>
  </section>
);
