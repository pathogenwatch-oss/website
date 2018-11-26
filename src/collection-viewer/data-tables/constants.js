import React from 'react';
// imports must not include css to remain compatible with csv generator
import ST from '../../mlst/ST.react';
import Profile from '../../mlst/Profile.react';

import { createCode, isNovel } from '../../mlst/utils';
import { getFormattedDateString } from '../table/utils';

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
          title="View Publication"
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
    displayName: 'MLST ST',
    valueGetter({ analysis }) {
      if (!analysis.mlst) return 0;
      const { st } = analysis.mlst;
      if (isNovel(st)) return `(${st.slice(0, 4)})`;
      return st;
    },
    display({ analysis }) {
      if (!analysis.mlst) return null;
      return <ST id={analysis.mlst.st} textOnly />;
    },
  },
  __mlst_profile: {
    columnKey: '__mlst_profile',
    label: 'PROFILE',
    displayName: 'MLST PROFILE',
    valueGetter({ analysis }) {
      if (!analysis.mlst) return null;
      const { code, alleles } = analysis.mlst;
      if (code) return code;
      return createCode(alleles, 4);
    },
    display({ analysis }) {
      if (!analysis.mlst) return null;
      const { code, alleles } = analysis.mlst;
      if (code) return code;
      return <Profile alleles={alleles} textOnly />;
    },
  },
  __inc_types: {
    columnKey: '__inc_types',
    displayName: 'Inc Types',
    valueGetter({ analysis }) {
      if (!analysis.inctyper) return null;
      if (Object.keys(analysis.inctyper).length === 0 && analysis.inctyper.constructor === Object) return null;
      return analysis.inctyper['Inc Matches']
        .map(match => match['Inc Match'])
        .join('; ');
    },
  },
  __kleborate_species: {
    columnKey: '__kleborate_species',
    displayName: 'Species',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.species;
    },
  },
  __kleborate_mlst: {
    columnKey: '__kleborate_mlst',
    displayName: 'ST',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.ST.replace('ST', '');
    },
  },
  __virulence_score: {
    columnKey: '__virulence_score',
    displayName: 'Virulence Score',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.virulence_score;
    },
  },
  __resistance_score: {
    columnKey: '__resistance_score',
    displayName: 'Resistance Score',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.resistance_score;
    },
  },
  __K_locus: {
    columnKey: '__K_locus',
    displayName: 'K Locus',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.K_locus;
    },
  },
  __K_locus_confidence: {
    columnKey: '__K_locus_confidence',
    displayName: 'K Locus Confidence',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.K_locus_confidence;
    },
  },
  __O_locus: {
    columnKey: '__O_locus',
    displayName: ') Locus',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.O_locus;
    },
  },
  __O_locus_confidence: {
    columnKey: '__O_locus_confidence',
    displayName: 'O Locus Confidence',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.O_locus_confidence;
    },
  },

  __wzi: {
    columnKey: '__wzi',
    displayName: 'wzi',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.wzi;
    },
  },
  __Aerobactin: {
    columnKey: '__Aerobactin',
    displayName: 'Aerobactin',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Aerobactin;
    },
  },
  __AbST: {
    columnKey: '__AbST',
    displayName: 'AbST',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.AbST;
    },
  },
  __Colibactin: {
    columnKey: '__Colibactin',
    displayName: 'Colibactin',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Colibactin;
    },
  },
  __CbST: {
    columnKey: '__CbST',
    displayName: 'CbST',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.CbST;
    },
  },
  __Salmochelin: {
    columnKey: '__Salmochelin',
    displayName: 'Salmochelin',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Salmochelin;
    },
  },
  __SmST: {
    columnKey: '__SmST',
    displayName: 'SmST',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.SmST;
    },
  },
  __Yersiniabactin: {
    columnKey: '__Yersiniabactin',
    displayName: 'Yersiniabactin',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Yersiniabactin;
    },
  },
  __YbST: {
    columnKey: '__YbST',
    displayName: 'YbST',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.YbST;
    },
  },
  __rmpA: {
    columnKey: '__rmpA',
    displayName: 'rmpA',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.rmpA;
    },
  },
  __rmpA2: {
    columnKey: '__rmpA2',
    displayName: 'rmpA2',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.rmpA2;
    },
  },
  __AGly: {
    columnKey: '__AGly',
    displayName: 'AGly',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.AGly;
    },
  },
  __Col: {
    columnKey: '__Col',
    displayName: 'Col',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Col;
    },
  },
  __Fcyn: {
    columnKey: '__Fcyn',
    displayName: 'Fcyn',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Fcyn;
    },
  },
  __Flq: {
    columnKey: '__Flq',
    displayName: 'Flq',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Flq;
    },
  },
  __Gly: {
    columnKey: '__Gly',
    displayName: 'Gly',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Gly;
    },
  },
  __MLS: {
    columnKey: '__MLS',
    displayName: 'MLS',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.MLS;
    },
  },
  __Ntmdz: {
    columnKey: '__Ntmdz',
    displayName: 'Ntmdz',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Ntmdz;
    },
  },
  __Phe: {
    columnKey: '__Phe',
    displayName: 'Phe',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Phe;
    },
  },
  __Rif: {
    columnKey: '__Rif',
    displayName: 'Rif',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Rif;
    },
  },
  __Sul: {
    columnKey: '__Sul',
    displayName: 'Sul',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Sul;
    },
  },
  __Tet: {
    columnKey: '__Tet',
    displayName: 'Tet',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Tet;
    },
  },
  __Tmt: {
    columnKey: '__Tmt',
    displayName: 'Tmt',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Tmt;
    },
  },
  __Bla: {
    columnKey: '__Bla',
    displayName: 'Bla',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla;
    },
  },
  __Bla_Carb: {
    columnKey: '__Bla_Carb',
    displayName: 'Bla_Carb',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla_Carb;
    },
  },
  __Bla_ESBL: {
    columnKey: '__Bla_ESBL',
    displayName: 'Bla_ESBL',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla_ESBL;
    },
  },
  __Bla_ESBL_inhR: {
    columnKey: '__Bla_ESBL_inhR',
    displayName: 'Bla_ESBL_inhR',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla_ESBL_inhR;
    },
  }, __Bla_broad: {
    columnKey: '__Bla_broad',
    displayName: 'Bla_broad',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla_broad;
    },
  },
  __Bla_broad_inhR: {
    columnKey: '__Bla_broad_inhR',
    displayName: 'Bla_broad_inhR',
    valueGetter({ analysis }) {
      if (!analysis.kleborate) return null;
      return analysis.kleborate.Bla_broad_inhR;
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
    displayName: 'NG-MAST TBQB',
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
