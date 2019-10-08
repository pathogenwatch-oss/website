import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { getCollection } from '../selectors';
import { getGenomes, hasMetadata, hasAMR } from '../genomes/selectors';
import { getTables, hasTyping } from '../table/selectors';
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

const DownloadsMenu = (props) => {
  const { collection, genomes, genomeIds, tables } = props;
  return (
    <React.Fragment>
      { props.hasMetadataTable &&
        <DownloadButton
          filename={formatCollectionFilename(collection, 'metadata.csv')}
          genomeIds={genomeIds}
          generateFile={() => generateMetadataFile({ genomes, genomeIds, tables })}
        >
          Metadata table
        </DownloadButton> }
      { props.hasTypingTable &&
        <DownloadButton
          filename={formatCollectionFilename(collection, 'typing.csv')}
          genomeIds={genomeIds}
          generateFile={() => generateTypingFile({ genomes, genomeIds, tables })}
        >
          Typing table
        </DownloadButton> }
      <DownloadButton
        filename={formatCollectionFilename(collection, 'stats.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateStatsFile({ genomes, genomeIds, tables })}
      >
        Stats table
      </DownloadButton>
      { props.hasAMRTables &&
        <React.Fragment>
          <hr />
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-profile.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateAMRProfile({ genomes, genomeIds, tables })}
          >
            AMR Profile
          </DownloadButton>
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-snps.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateAMRSNPs({ genomes, genomeIds, tables })}
          >
            AMR SNPs
          </DownloadButton>
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-genes.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateAMRGenes({ genomes, genomeIds, tables })}
          >
            AMR Genes
          </DownloadButton>
        </React.Fragment>
      }
    </React.Fragment>
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
