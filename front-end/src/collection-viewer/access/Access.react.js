import React from 'react';

import AccessLevel from './AccessLevel.react';
import AccessStatus from './AccessStatus.react';

export default () => (
  <section className="wgsa-collection-access">
    <h4>Access level</h4>
    <AccessStatus />
    <ul>
      <li>
        <AccessLevel
          level="private"
          icon="lock"
          title="Private"
          description="available to you only."
        />
      </li>
      <li>
        <AccessLevel
          level="shared"
          icon="link"
          title="Shared"
          description="available to anyone with the link, no sign-in required."
        />
      </li>
      {/* <li>
        <AccessLevel
          level="public"
          icon="public"
          title="Public"
          description="available to all, added to list of public collections."
        />
      </li> */}
    </ul>
  </section>
);
