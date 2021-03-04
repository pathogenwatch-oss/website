import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { getCollection } from '../selectors';
import { getGenomes, hasAMR, hasKleborateAMR, hasMetadata, hasVista, hasSarscov2Variants } from '../genomes/selectors';
import { getTables, hasTyping } from '../table/selectors';
import { getActiveGenomeIds } from '../selectors/active';

import { formatCollectionFilename } from './utils';
import {
  generateAMRGenes,
  generateAMRProfile,
  generateAMRSNPs,
  generateKleborateAMRGenotypes,
  generateKleborateAMRProfiles,
  generateMetadataFile,
  generateSarscov2Variants,
  generateStatsFile,
  generateTypingFile,
  generateVistaFile,
} from './client-side';
import Organisms from '~/organisms/config';

const DownloadsMenu = (props) => {
  const { collection, genomes, genomeIds, tables } = props;
  return (
    <React.Fragment>
      {props.hasMetadataTable &&
      <DownloadButton
        filename={formatCollectionFilename(collection, 'metadata.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateMetadataFile({ genomes, genomeIds, tables })}
      >
          Metadata table
        </DownloadButton>}
      {props.hasTypingTable &&
      <DownloadButton
        filename={formatCollectionFilename(collection, 'typing.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateTypingFile({ genomes, genomeIds, tables })}
      >
          Typing table
        </DownloadButton>}
      <DownloadButton
        filename={formatCollectionFilename(collection, 'stats.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateStatsFile({ genomes, genomeIds, tables })}
      >
        Stats table
      </DownloadButton>
      {props.hasAMRTables &&
      <React.Fragment>
          <hr />
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-profile.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateAMRProfile({ genomes, genomeIds, tables })}
          >
            AMR profile
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
            AMR genes
          </DownloadButton>
        </React.Fragment>
      }
      {
        props.hasKleborateTables &&
        <React.Fragment>
          <hr />
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-profile.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateKleborateAMRProfiles({ genomes, genomeIds, tables })}
          >
            AMR profile
          </DownloadButton>
          <DownloadButton
            filename={formatCollectionFilename(collection, 'amr-genotypes.csv')}
            genomeIds={genomeIds}
            generateFile={() => generateKleborateAMRGenotypes({ genomes, genomeIds, tables })}
          >
            AMR Genotypes
          </DownloadButton>
        </React.Fragment>
      }
      {props.hasVistaTable &&
      <DownloadButton
        filename={formatCollectionFilename(collection, 'vista.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateVistaFile( {genomes, genomeIds, tables})}
      >
      Virulence
    </DownloadButton>}
      { props.hasSarscov2VariantsTable &&
      <DownloadButton
        filename={formatCollectionFilename(collection, 'sarscov2Variants.csv')}
        genomeIds={genomeIds}
        generateFile={() => generateSarscov2Variants( {genomes, genomeIds, tables})}
      >
      Notable Mutations
    </DownloadButton> }
    </React.Fragment>
  );
};

DownloadsMenu.propTypes = {
  collection: React.PropTypes.object,
  genomes: React.PropTypes.object,
  genomeIds: React.PropTypes.array,
  hasMetadataTable: React.PropTypes.bool,
  hasSarscov2VariantsTable: React.PropTypes.bool,
  hasTypingTable: React.PropTypes.bool,
  hasVista: React.PropTypes.bool,
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
    hasKleborateTables: hasKleborateAMR(state),
    hasSarscov2VariantsTable: hasSarscov2Variants(state),
    hasVistaTable: hasVista(state),
    tables: getTables(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
