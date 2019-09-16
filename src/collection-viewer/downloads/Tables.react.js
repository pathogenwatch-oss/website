import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { getCollection } from '../selectors';
import { getGenomes, hasMetadata } from '../genomes/selectors';
import { getTables, hasTyping, hasAMR } from '../table/selectors';
import { getActiveGenomeIds } from '../selectors/active';

import { formatCollectionFilename } from './utils';
import {
  generateMetadataFile,
  generateTypingFile,
  generateStatsFile,
  generateAMRProfile,
  generateAMRSNPs,
  generateAMRGenes,
} from './client-side';


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
        { items.map(item => (item.hideFromMenu(props) ? null :
          <li key={item.filenameSegment}>
            <DownloadButton
              className="mdl-button"
              filename={formatCollectionFilename(collection, item.filenameSegment)}
              genomeIds={genomeIds}
              generateFile={() => item.getFileContents({ genomes, genomeIds, tables })}
            >
              {item.description}
            </DownloadButton>
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
    hasAMRTables: hasAMR(state),
    tables: getTables(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
