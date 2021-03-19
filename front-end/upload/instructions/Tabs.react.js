import React from 'react';
import classnames from "classnames";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
import Badge from '../../components/badge';

import { useAssemblerUsage } from '../hooks';

import { getAssemblerUsage } from '../selectors';
import { useAuthToken } from '~/auth/hooks';

const Tabs = ({ usage, token, uploadType }) => {
  useAuthToken(true);
  useAssemblerUsage(token);

  return (
    <React.Fragment>
      <div
        className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect"
      >
        <div className="mdl-tabs__tab-bar">
          <Link
            to="/upload/fasta"
            className={
              classnames(
                "mdl-tabs__tab",
                uploadType === "fasta" ? "is-active" : null
              )
            }
          >
            Assemblies (FASTA)
          </Link>
          <Link
            to="/upload/multi-fasta"
            className={
              classnames(
                "mdl-tabs__tab",
                uploadType === "multi-fasta" ? "is-active" : null
              )
            }
          >
            Assemblies (Multi-FASTA)
          </Link>
          <Link
            to="/upload/reads"
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
          </Link>
        </div>

        {
          (uploadType === "fasta") && (
            <div className="mdl-tabs__panel">
              <Assemblies />
            </div>
          )
        }
        {
          (uploadType === "multi-fasta") && (
            <div className="mdl-tabs__panel">
              <Assemblies />
            </div>
          )
        }
        {
          (uploadType === "reads") && (
            <div className="mdl-tabs__panel">
              <Reads remaining={!!usage && !!usage.remaining ? usage.remaining : 0} />
            </div>
          )
        }
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
