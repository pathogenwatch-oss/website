import React from 'react';
import ScrollSpy from 'react-scrollspy';

import Modal from '../components/modal';
import RemoveButton from './RemoveButton.react';

import DownloadLink from '../downloads/GenomeFileLink.react';
import Spinner from '../components/Spinner.react';

import Overview from './Overview.react';
import Metadata from './Metadata.react';
import getAnalysisSections from './analysis';

const Content = React.createClass({
  getInitialState() {
    return {
      active: 'Overview',
    };
  },

  setActive(active) {
    this.setState({ active });
  },

  scrollTo(key) {
    if (key in this.sections) {
      this.sections[key].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  sections: {},

  render() {
    const { genome } = this.props;
    const { fileId, pending = [], userDefined = null, upload = { type: 'assembly' } } = genome;
    const sections = [ { key: 'Top', component: <Overview genome={genome} /> } ];
    if (userDefined && Object.keys(userDefined).length > 0) {
      sections.push({
        key: 'Metadata',
        component: <Metadata genome={genome} />,
      });
    }
    sections.push(...getAnalysisSections(genome));
    if (pending.length) {
      sections.push({
        key: `+${pending.length} Pending`,
        component: (
          <ul>
            {pending.map(task => (
              <li>{task}</li>
            ))}
          </ul>
        ),
      });
    }
    return (
      <React.Fragment>
        <nav onClick={this.props.onClick}>
          <ScrollSpy
            items={sections.map(_ => _.key.toLowerCase())}
            currentClassName="active"
            rootEl=".wgsa-genome-report > span > .wgsa-overlay"
          >
            {sections.map(({ key }) => (
              <li key={key}>
                <a
                  href={`#${key.toLowerCase()}`}
                  onClick={e => e.preventDefault() || this.scrollTo(key)}
                >
                  {key}
                </a>
              </li>
            ))}
          </ScrollSpy>
          <RemoveButton key="remove" genome={genome} onRemove={close} />
        </nav>
        <div
          className="wgsa-genome-report-content"
          onClick={this.props.onClick}
        >
          {sections.map(({ key, component }) => (
            <section
              key={key}
              ref={el => {
                this.sections[key] = el;
              }}
              id={`${key.toLowerCase()}`}
            >
              {component}
            </section>
          ))}
          {!fileId &&
            <div className="pw-expand pw-flex-center">
              <span className="wgsa-file-icon">
                <i className="material-icons">
                  {upload.type === 'assembly' ? 'insert_drive_file' : 'file_copy'}
                </i>
              </span>
              <p className="h6">Awaiting assembly</p>
            </div>
          }
        </div>
      </React.Fragment>
    );
  },
});

const Report = ({ name, genome, loading, close }) => {
  const isOpen = !!loading || !!genome;
  return (
    <Modal
      title={
        <span className="wgsa-genome-report-title">
          Genome Report: {genome ? genome.name : name}{' '}
          {genome && genome.fileId && (
            <DownloadLink key="download" id={genome.id} name={genome.name} />
          )}
        </span>
      }
      isOpen={isOpen}
      onClose={close}
      animationKey="genome-report"
      containerClassName="wgsa-genome-report"
    >
      {loading ? (
        <div className="wgsa-genome-report-loader">
          <Spinner />
          <p>Loading Report</p>
        </div>
      ) : (
        <Content genome={genome} />
      )}
    </Modal>
  );
};

export default Report;
