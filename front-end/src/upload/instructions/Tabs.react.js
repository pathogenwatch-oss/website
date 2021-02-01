import React from 'react';
import { connect } from 'react-redux';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
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
          <Reads remaining={!!usage && !!usage.remaining ? usage.remaining : 0} />
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
