import './styles.css';

import React from 'react';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';

import Badge from '../../components/badge';

const Tabs = () => {
  const tabsRef = React.useRef();
  React.useEffect(() => {
    if (tabsRef.current) {
      componentHandler.upgradeElement(tabsRef.current);
    }
  }, []);
  return (
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
  );
};

export default ({ readsEligible = true }) => (
  <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
    <h1>Drag and drop files to begin.</h1>
    {readsEligible ? <Tabs /> : <Assemblies />}
  </section>
);
