import React from 'react';
import ScrollSpy from 'react-scrollspy';

import Modal from '../../components/modal';
import Fade from '../../components/fade';
import RemoveButton from './RemoveButton.react';

import DownloadLink from '../../downloads/GenomeFileLink.react';
import Spinner from '../../components/Spinner.react';

import Overview from './Overview.react';
import Metadata from './Metadata.react';
import getAnalysisTabs from './analysis';

const Content = React.createClass({

  getInitialState() {
    return {
      active: 'Overview',
    };
  },

  componentDidMount() {
    componentHandler.upgradeDom();
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
    const { pending = [], userDefined = null } = genome;
    const sections = [
      { key: 'Overview', component: <Overview genome={genome} /> },
    ];
    if (userDefined && Object.keys(userDefined).length > 0) {
      sections.push({ key: 'Metadata', component: <Metadata genome={genome} /> });
    }
    sections.push(...getAnalysisTabs(genome));
    if (pending.length) {
      sections.push({ key: `+${pending.length} Pending`, component: <ul>{pending.map(task => <li>{task}</li>)}</ul> });
    }
    return (
      <div className="wgsa-genome-detail-content">
        <aside>
          <ScrollSpy
            items={sections.map(_ => _.key.toLowerCase())}
            currentClassName="active"
            rootEl=".wgsa-genome-detail"
          >
          { sections.map(({ key }) =>
            <li key={key}>
              <a
                href={`#${key.toLowerCase()}`}
                onClick={e => e.preventDefault() || this.scrollTo(key)}
              >
                {key}
              </a>
            </li>) }
          </ScrollSpy>
        </aside>
        { sections.map(({ key, component }) =>
          <section
            key={key}
            ref={el => { this.sections[key] = el; }}
            id={`${key.toLowerCase()}`}
          >
            <h2>{key}</h2>
            {component}
          </section>) }
      </div>
    );
  },

});

export default ({ name, genome, loading, close }) => {
  const isOpen = !!loading || !!genome;
  return (
    <Fade>
      { isOpen &&
        <Modal
          title={
            <span className="wgsa-genome-detail-title">
              {genome ? genome.name : name}
            </span>
          }
          modal
          isOpen={isOpen}
          onClose={close}
          animationKey="genome-detail"
          containerClassName="wgsa-genome-detail"
          actions={genome ? [
            <DownloadLink key="download" id={genome.id} name={genome.name} />,
            <RemoveButton key="remove" genome={genome} onRemove={close} />,
          ] : []}
        >
          { loading ?
            <div className="wgsa-genome-detail-content wgsa-genome-detail-loader">
              <Spinner />
            </div> :
            <Content genome={genome} /> }
        </Modal> }
    </Fade>
  );
};
