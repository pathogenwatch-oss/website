import React from 'react';
import { connect } from 'react-redux';

import { getGenomes, getActiveGenomeIds, getCollection } from '../selectors';
import { getTables, hasMetadata, hasTyping, hasAMR } from '../table/selectors';

import { formatCollectionFilename } from './utils';
import {
  generateMetadataFile,
  generateTypingFile,
  generateStatsFile,
  generateAMRProfile,
  generateAMRSNPs,
  generateAMRGenes,
  createCSVLink } from './client-side';

import Organisms from '../../organisms';

const DownloadButton = React.createClass({
  getInitialState() {
    return {
      link: null,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.genomeIds !== nextProps.genomeIds) {
      this.setState({ link: null });
    }
  },
  componentDidUpdate(_, previous) {
    if (!previous.link && this.state.link) {
      this.link.click();
    }
  },
  onClick() {
    this.props.generateFile()
      .then(data => {
        this.setState({ link: createCSVLink(data) });
      });
  },
  render() {
    const { filename, title, children } = this.props;
    if (this.state.link) {
      return (
        <a
          ref={el => { this.link = el; }}
          href={this.state.link}
          target="_blank" rel="noopener"
          download={filename}
          title={title}
          className="mdl-button"
        >
          {children}
        </a>
      );
    }

    return (
      <button
        onClick={this.onClick}
        title={title}
        className="mdl-button"
      >
        {children}
      </button>
    );
  },
});

const items = [
  {
    description: 'Metadata',
    filenameSegment: 'metadata.csv',
    getFileContents: generateMetadataFile,
    hideFromMenu({ hasMetadataTable }) {
      return !hasMetadataTable;
    },
  },
  {
    description: 'Typing',
    filenameSegment: 'typing.csv',
    getFileContents: generateTypingFile,
    hideFromMenu({ hasTypingTable }) {
      return !hasTypingTable;
    },
  },
  {
    description: 'Stats',
    filenameSegment: 'stats.csv',
    getFileContents: generateStatsFile,
    hideFromMenu: () => false,
  },
  {
    description: 'AMR Profile',
    filenameSegment: 'amr-profile.csv',
    getFileContents: generateAMRProfile,
    hideFromMenu({ hasAMRTables }) {
      return !hasAMRTables;
    },
  },
  {
    description: 'AMR SNPs',
    filenameSegment: 'amr-snps.csv',
    getFileContents: generateAMRSNPs,
    hideFromMenu({ hasAMRTables }) {
      return !hasAMRTables;
    },
  },
  {
    description: 'AMR Genes',
    filenameSegment: 'amr-genes.csv',
    getFileContents: generateAMRGenes,
    hideFromMenu({ hasAMRTables }) {
      return !hasAMRTables;
    },
  },
];

const DownloadsMenu = (props) => {
  const { collection, genomes, genomeIds, tables } = props;
  return (
    <li>
      <h4>Tables</h4>
      <ul>
        { items.map(item => (item.hideFromMenu(props) ? null : <li key={item.filenameSegment}>
          <DownloadButton
            filename={formatCollectionFilename(collection, item.filenameSegment)}
            genomeIds={genomeIds}
            generateFile={() => item.getFileContents({ genomes, genomeIds, tables })}
          >{item.description}</DownloadButton>
          </li>)) }
      </ul>
    </li>
  );
};

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  genomes: React.PropTypes.object,
  genomeIds: React.PropTypes.array,
  hasMetadataTable: React.PropTypes.bool,
  hasTypingTable: React.PropTypes.bool,
  tables: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
    genomes: getGenomes(state),
    genomeIds: getActiveGenomeIds(state),
    hasMetadataTable: hasMetadata(state),
    hasTypingTable: hasTyping(state),
    hasAMR: hasAMR(state),
    tables: getTables(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
