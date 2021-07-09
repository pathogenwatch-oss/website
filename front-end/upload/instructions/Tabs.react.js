import React from 'react';
import classnames from "classnames";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Assemblies from './Assemblies.react';
import Reads from './Reads.react';
import Badge from '../../components/badge';

const Tabs = ({ uploadType }) => {
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
              <Assemblies csvText={(<React.Fragment>Files should contain a <strong>filename</strong> column to match each
                row to its respective genomic data. Please use the name of the file{' '}
                <strong>including extension</strong>.</React.Fragment>)}/>
            </div>
          )
        }
        {
          (uploadType === "multi-fasta") && (
            <div className="mdl-tabs__panel">
              <Assemblies csvText={(<React.Fragment>Files should contain a <strong>filename</strong> column to match each
                row to its respective genomic data. Please use the name given in the{' '}
                <strong>header line of the individual FASTA records</strong> -{' '}
                not the actual filename.</React.Fragment>)}/>
            </div>
          )
        }
        {
          (uploadType === "reads") && (
            <div className="mdl-tabs__panel">
              <Reads />
            </div>
          )
        }
      </div>
    </React.Fragment>
  );
};

export default Tabs;
