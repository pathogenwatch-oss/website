import React from 'react';
import { connect } from 'react-redux';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
import Fade from '../../components/fade';
import Badge from '../../components/badge';

import { useAssemblerUsage } from './hooks';

const Tabs = ({ token }) => {
  const tabsRef = React.useRef();
  React.useEffect(() => {
    if (tabsRef.current) {
      componentHandler.upgradeElement(tabsRef.current);
    }
  }, []);
  const usage = useAssemblerUsage(token);
  return (
    <React.Fragment>
      <Fade className="pw-upload-assembler-usage">
        {usage && (
          <aside>
            <p>
              <strong>Processing reads is currently a trial service.</strong>{' '}
            </p>
            <p>
              You have <strong>{usage.remaining} assemblies</strong> remaining
              this month.
              <br />
              <strong>
                {usage.usage.total} of {usage.limits.total} assemblies
              </strong>{' '}
              have been completed this month.
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
            <Badge text="New">Reads</Badge>
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
    token: state.auth.token,
  };
}

export default connect(mapStateToProps)(Tabs);
