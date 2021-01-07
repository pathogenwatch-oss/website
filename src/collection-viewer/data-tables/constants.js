import React from 'react';
// imports must not include css to remain compatible with csv generator
import ST from '~/mlst/ST.react';
import Profile from '~/mlst/Profile.react';

import { createCode, isNovel } from '~/mlst/utils';
import { getFormattedDateString } from '../table/utils';
import { sources } from './utils';

export const systemDataColumns = {
  __date: {
    columnKey: '__date',
    valueGetter(genome) {
      return getFormattedDateString(genome);
    },
  },
  __pmid: {
    columnKey: '__pmid',
    valueGetter({ pmid }) {
      return pmid;
    },
    getCellContents({ valueGetter }, data) {
      const pmid = valueGetter(data);
      if (!pmid) return null;
      return (
        <a
          href={`http://www.ncbi.nlm.nih.gov/pubmed/${pmid}`}
          target="_blank" rel="noopener"
          title="View publication"
          style={{ color: '#369' }}
          onClick={e => e.stopPropagation()}
        >
          {pmid}
        </a>
      );
    },
  },
  __reference: {
    columnKey: '__reference',
    valueGetter({ analysis }) {
      if (!analysis.core || !analysis.core.fp) return null;
      return analysis.core.fp.reference;
    },
  },
  __mlst: {
    columnKey: '__mlst',
    label: 'ST',
    get displayName() {
      if (sources.mlst) {
        return `MLST ST (${sources.mlst})`;
      }
      return 'MLST ST';
    },
    valueGetter({ analysis }) {
      if (!analysis.mlst) return null;
      const { st } = analysis.mlst;
      if (isNovel(st)) return `*${st.slice(0, 4)}`;
      return st;
    },
    display({ analysis }) {
      if (!analysis.mlst) return null;
      return <ST id={analysis.mlst.st} />;
    },
  },
  __mlst_profile: {
    columnKey: '__mlst_profile',
    label: 'PROFILE',
    get displayName() {
      if (sources.mlst) {
        return `MLST PROFILE (${sources.mlst})`;
      }
      return 'MLST PROFILE';
    },
    valueGetter({ analysis }) {
      if (!analysis.mlst) return null;
      return createCode(analysis.mlst.alleles, 4);
    },
    display({ analysis }) {
      if (!analysis.mlst) return null;
      return <Profile alleles={analysis.mlst.alleles} />;
    },
  },
  __mlst2: {
    columnKey: '__mlst2',
    label: 'ST',
    get displayName() {
      if (sources.mlst2) {
        return `MLST ST (${sources.mlst2})`;
      }
      return 'MLST ST';
    },
    valueGetter({ analysis }) {
      if (!analysis.mlst2) return null;
      const { st } = analysis.mlst2;
      if (isNovel(st)) return `*${st.slice(0, 4)}`;
      return st;
    },
    display({ analysis }) {
      if (!analysis.mlst2) return null;
      return <ST id={analysis.mlst2.st} />;
    },
  },
  __mlst2_profile: {
    columnKey: '__mlst2_profile',
    label: 'PROFILE',
    get displayName() {
      if (sources.mlst2) {
        return `MLST PROFILE (${sources.mlst2})`;
      }
      return 'MLST PROFILE';
    },
    valueGetter({ analysis }) {
      if (!analysis.mlst2) return null;
      return createCode(analysis.mlst2.alleles, 4);
    },
    display({ analysis }) {
      if (!analysis.mlst2) return null;
      return <Profile alleles={analysis.mlst2.alleles} />;
    },
  },
  __ngstar: {
    columnKey: '__ngstar',
    label: 'TYPE',
    get displayName() {
      return 'NG-STAR TYPE';
    },
    valueGetter({ analysis }) {
      if (!analysis.ngstar) return null;
      const { st } = analysis.ngstar;
      if (isNovel(st)) return `*${st.slice(0, 4)}`;
      return st;
    },
    display({ analysis }) {
      if (!analysis.ngstar) return null;
      return <ST id={analysis.ngstar.st} />;
    },
  },
  __ngstar_profile: {
    columnKey: '__ngstar_profile',
    label: 'PROFILE',
    get displayName() {
      return 'NG-STAR PROFILE';
    },
    valueGetter({ analysis }) {
      if (!analysis.ngstar) return null;
      return createCode(analysis.ngstar.alleles, 4);
    },
    display({ analysis }) {
      if (!analysis.ngstar) return null;
      return <Profile alleles={analysis.ngstar.alleles} />;
    },
  },
  __inc_types: {
    columnKey: '__inc_types',
    displayName: 'Inc Types',
    valueGetter({ analysis }) {
      if (!analysis.inctyper) return null;
      if (Object.keys(analysis.inctyper).length === 0 && analysis.inctyper.constructor === Object) return null;

      return Object.values(analysis.inctyper['Inc Matches']
        .reduce((contigs, match) => {
          if (!contigs.hasOwnProperty(match.Contig)) {
            contigs[match.Contig] = [];
          }
          contigs[match.Contig].push(match);
          return contigs;
        }, {}))
        .map(contigMatches => contigMatches.map(
          match => (analysis.inctyper.Library === 'gram_negative' ?
            match['Inc Match'].replace(/_\d+$/, '') :
            match.Group))
          .sort()
          .join('--')
        )
        .sort()
        .join('; ');
    },
  },
  __Virulence_Score: {
    columnKey: '__Virulence_Score',
    displayName: 'Virulence Score',
    label: 'Virulence Score',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return `${analysis.kleborate.virulence_score}`;
    },
  },
  __K_locus: {
    columnKey: '__K_locus',
    displayName: 'K LOCUS (wzi)',
    label: 'K LOCUS (wzi)',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return `${analysis.kleborate.typing.K_locus} (${analysis.kleborate.typing.wzi})`;
    },
  },
  __O_locus: {
    columnKey: '__O_locus',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.typing.O_locus;
    },
  },
  __Aerobactin: {
    columnKey: '__Aerobactin',
    displayName: 'AEROBACTIN (AbST)',
    label: 'AEROBACTIN (AbST)',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.Aerobactin === '-') return null;
      return `${analysis.kleborate.virulence.Aerobactin} (${analysis.kleborate.virulence.AbST})`;
    },
  },
  __Colibactin: {
    columnKey: '__Colibactin',
    displayName: 'COLIBACTIN (CbST)',
    label: 'COLIBACTIN (CbST)',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.Colibactin === '-') return null;
      return `${analysis.kleborate.virulence.Colibactin} (${analysis.kleborate.virulence.CbST})`;
    },
  },
  __Salmochelin: {
    columnKey: '__Salmochelin',
    displayName: 'SALMOCHELIN (SmST)',
    label: 'SALMOCHELIN (SmST)',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.Salmochelin === '-') return null;
      return `${analysis.kleborate.virulence.Salmochelin} (${analysis.kleborate.virulence.SmST})`;
    },
  },
  __Yersiniabactin: {
    columnKey: '__Yersiniabactin',
    displayName: 'YERSINIABACTIN (YbST)',
    label: 'YERSINIABACTIN (YbST)',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.Yersiniabactin === '-') return null;
      return `${analysis.kleborate.virulence.Yersiniabactin} (${analysis.kleborate.virulence.YbST})`;
    },
  },
  __RmpADC: {
    columnKey: '__RmpADC',
    displayName: 'RmpADC',
    label: 'RmpADC',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.virulence.RmpADC === '-') return null;
      return analysis.kleborate.virulence.RmpADC;
    },
  },
  __rmpA2: {
    columnKey: '__rmpA2',
    displayName: 'rmpA2',
    label: 'rmpA2',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      if (analysis.kleborate.virulence.rmpA2 === '-') return null;
      return analysis.kleborate.virulence.rmpA2;
    },
  },
  '__ng-mast': {
    columnKey: '__ng-mast',
    displayName: 'NG-MAST TYPE',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.ngmast;
    },
  },
  __por: {
    columnKey: '__por',
    displayName: 'NG-MAST POR',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.por;
    },
  },
  __tbpb: {
    columnKey: '__tbpb',
    displayName: 'NG-MAST TBPB',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.tbpb;
    },
  },
  __genotyphi_type: {
    columnKey: '__genotyphi_type',
    label: 'GENOTYPE',
    displayName: 'GENOTYPHI GENOTYPE',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.genotype;
    },
  },
  __genotyphi_snps: {
    columnKey: '__genotyphi_snps',
    label: 'SNPs',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.snps;
    },
  },
  __genotyphi_snps_called: {
    columnKey: '__genotyphi_snps_called',
    label: 'SNPs CALLED',
    displayName: 'GENOTYPHI SNPs CALLED',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.foundLoci;
    },
    numeric: true,
  },
  __vista_biotype: {
    columnKey: '__vista_biotype',
    label: 'BIOTYPE',
    displayName: 'V. CHOLERAE BIOTYPE',
    valueGetter({ analysis }) {
      if (!analysis.vista) return null;
      return analysis.vista.biotype;
    },
  },
  __vista_serogroup: {
    columnKey: '__vista_serogroup',
    label: 'SEROGROUP',
    displayName: 'V. CHOLERAE SEROGROUP',
    valueGetter({ analysis }) {
      if (!analysis.vista) return null;
      return analysis.vista.serogroup;
    },
  },
  __core_matches: {
    columnKey: '__core_matches',
    valueGetter({ analysis }) {
      return analysis.core && analysis.core.summary ?
        analysis.core.summary.kernelSize :
        null;
    },
    numeric: true,
  },
  '__%_core_families': {
    columnKey: '__%_core_families',
    valueGetter({ analysis }) {
      return analysis.core && analysis.core.summary ?
        analysis.core.summary.percentKernelMatched :
        null;
    },
    numeric: true,
  },
  '__%_non-core': {
    columnKey: '__%_non-core',
    valueGetter({ analysis }) {
      const { core = {} } = analysis;
      return core.summary && core.summary.percentAssemblyMatched ?
        (100 - core.summary.percentAssemblyMatched).toFixed(1) :
        null;
    },
    numeric: true,
  },
  __genome_length: {
    columnKey: '__genome_length',
    valueGetter({ analysis }) {
      return analysis.metrics ?
        analysis.metrics.length :
        null;
    },
    numeric: true,
  },
  __n50: {
    columnKey: '__n50',
    valueGetter({ analysis }) {
      return analysis.metrics ?
        analysis.metrics.N50 :
        null;
    },
    numeric: true,
  },
  '__no._contigs': {
    columnKey: '__no._contigs',
    valueGetter({ analysis }) {
      return analysis.metrics ?
        analysis.metrics.contigs :
        null;
    },
    numeric: true,
  },
  '__non-ATCG': {
    columnKey: '__non-ATCG',
    valueGetter({ analysis }) {
      return analysis.metrics ?
        analysis.metrics.nonATCG :
        null;
    },
    numeric: true,
  },
  '__%_GC_Content': {
    columnKey: '__%_GC_Content',
    label: '% GC CONTENT',
    valueGetter({ analysis }) {
      return analysis.metrics ?
        analysis.metrics.gcContent :
        null;
    },
    numeric: true,
  },
};
