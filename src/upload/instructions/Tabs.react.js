import React from 'react';
import { connect } from 'react-redux';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
import Fade from '../../components/fade';
import Badge from '../../components/badge';

import { useAssemblerUsage } from '../hooks';

import { getAssemblerUsage } from '../selectors';
import { useAuthToken } from '~/auth/hooks';

const Tabs = ({ usage, token }) => {
  useAuthToken(true);
  useAssemblerUsage(token);

  const tabsRef = React.useRef();
  React.useEffect(() => {
    if (tabsRef.current && !tabsRef.current.MaterialTabs) {
      componentHandler.upgradeElement(tabsRef.current);
    }
  }, []);

  return (
    <React.Fragment>
      <Fade className="pw-upload-assembler-usage">
        {usage && (
          <aside>
            <p>
              <strong>Processing reads is a trial service with fair-use limits.</strong>
            </p>
            <p>
              {usage.remaining === 0 ?
                (<React.Fragment>You have no assemblies remaining, check back soon.</React.Fragment>) :
                (<React.Fragment>You are currently limited to <strong>{usage.remaining} assemblies</strong>.</React.Fragment>)
              }
              <br />
              <a href="https://cgps.gitbook.io/pathogenwatch/technical-descriptions/short-read-assembly" target="_blank" rel="noopener">How the service works</a>
            </p>
          </aside>
        )}
      </Fade>
      <div
        ref={el => {
          tabsRef.current = el;
        }}
        className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect"
      >
        <div className="mdl-tabs__tab-bar">
          <a href="#assemblies-panel" className="mdl-tabs__tab is-active">
            Assemblies
          </a>
          <a href="#reads-panel" className="mdl-tabs__tab">
            <Badge text="Beta" color="turquoise">
              Reads
            </Badge>
          </a>
        </div>

        <div className="mdl-tabs__panel is-active" id="assemblies-panel">
          <Assemblies />
        </div>
        <div className="mdl-tabs__panel" id="reads-panel">
          <Reads />
        </div>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    usage: getAssemblerUsage(state),
    token: state.auth.token,
  };
}

export default connect(mapStateToProps)(Tabs);
