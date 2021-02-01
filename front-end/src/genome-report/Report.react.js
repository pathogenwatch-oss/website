import React from 'react';
import ScrollSpy from 'react-scrollspy';

import Modal from '../components/modal';
import RemoveButton from './RemoveButton.react';

import DownloadLink from '../downloads/GenomeFileLink.react';
import Spinner from '../components/Spinner.react';
import Loading from '../components/Loading.react';

import Overview from './Overview.react';
import Metadata from './Metadata.react';
import getAnalysisSections from './analysis';

import printStyles from '!!raw-loader!./styles/print.css';

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

    // Extraneous wrapping div smooths out the animation
    return (
      <div>
        <style>{printStyles}</style>
        <nav onClick={e => e.stopPropagation()}>
          <ScrollSpy
            items={sections.map(_ => _.key.toLowerCase())}
            currentClassName="active"
            rootEl=".wgsa-genome-report .wgsa-overlay"
          >
            {sections.map(({ key }) => (
              <li key={key}>
                <a
                  href={`#${key.toLowerCase()}`}
                  onClick={e => {
                    e.preventDefault();
                    this.scrollTo(key);
                  }}
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
          onClick={e => e.stopPropagation()}
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
              <p className="h6">{genome.assembler && genome.assembler.error ? genome.assembler.error.charAt(0).toUpperCase() + genome.assembler.error.slice(1) : 'Awaiting assembly'}</p>
            </div>
          }
        </div>
      </div>
    );
  },
});

const openStatuses = new Set([ 'LOADING', 'READY' ]);

const print = (name) => {
  const existingTitle = document.title;
  document.title = `Pathogenwatch genome report ${name}`; // creates a nice file name when printing to PDF
  window.print();
  document.title = existingTitle;
};

const Report = ({ name, genome, status, close }) => {
  const isOpen = openStatuses.has(status);
  const genomeName = genome ? genome.name : name;
  return (
    <Modal
      title={
        <span className="wgsa-genome-report-title">
          <div className="pw-genome-report-print-button" onClick={e => e.stopPropagation()}>
            <button className="mdl-button mdl-button--icon" title="Print report" onClick={() => print(genomeName)}>
              <i className="material-icons">print</i>
            </button>
          </div>
          Genome report: {genomeName}{' '}
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
      <Loading
        placeholder={
          <div className="wgsa-genome-report-loader" onClick={e => e.stopPropagation()}>
            <Spinner />
          </div>
        }
        complete={status === 'READY'}
      >
        <Content genome={genome} />
      </Loading>
    </Modal>
  );
};

export default Report;
