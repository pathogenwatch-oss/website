import React from 'react';
import classnames from "classnames";
import { connect } from 'react-redux';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
import Badge from '../../components/badge';

import { useAssemblerUsage } from '../hooks';

import { getAssemblerUsage } from '../selectors';
import { useAuthToken } from '~/auth/hooks';

const Tabs = ({ usage, token, uploadType }) => {
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
          <a
            href="#fasta-panel"
            className={
              classnames(
                "mdl-tabs__tab",
                uploadType === "fasta" ? "is-active" : null
              )
            }
          >
            Assemblies (FASTA)
          </a>
          <a
            href="#multi-fasta-panel"
            className={
              classnames(
                "mdl-tabs__tab",
                uploadType === "multi-fasta" ? "is-active" : null
              )
            }
          >
            Assemblies (Multi-FASTA)
          </a>
          <a
            href="#reads-panel"
            className={
              classnames(
                "mdl-tabs__tab",
                uploadType === "reads" ? "is-active" : null
              )
            }
          >
            <Badge text="Beta" color="turquoise">
              Reads (FASTQ)
            </Badge>
          </a>
        </div>

        <div
          className={
            classnames(
              "mdl-tabs__panel",
              uploadType === "fasta" ? "is-active" : null
            )
          }
          id="fasta-panel">
          <Assemblies />
        </div>
        <div
          className={
            classnames(
              "mdl-tabs__panel",
              uploadType === "multi-fasta" ? "is-active" : null
            )
          }
          id="multi-fasta-panel">
          <Assemblies />
        </div>
        <div
          className={
            classnames(
              "mdl-tabs__panel",
              uploadType === "reads" ? "is-active" : null
            )
          }
          id="reads-panel">
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
