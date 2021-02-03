const Genome = require('models/genome');
const Organism = require('models/organism');

const {
  organismHasPopulation,
  getCollectionSchemes,
  getTasksByOrganism,
} = require('manifest');

const summaryFields = [
  {
    field: 'organismId',
    aggregation: ({ deployedOrganisms }) => [
      { $match: { 'analysis.speciator.organismId': { $in: deployedOrganisms } } },
      {
        $group: {
          _id: {
            label: '$analysis.speciator.organismName',
            key: '$analysis.speciator.organismId',
          },
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'speciesId',
    aggregation: ({ query }) => {
      if (Object.keys(query).length <= 1) return null;
      return [
        { $match: { 'analysis.speciator.speciesId': { $exists: true } } },
        {
          $group: {
            _id: {
              label: '$analysis.speciator.speciesName',
              key: '$analysis.speciator.speciesId',
            },
            count: { $sum: 1 },
          },
        },
      ];
    },
  },
  {
    field: 'genusId',
    aggregation: () => [
      { $match: { 'analysis.speciator.genusId': { $exists: true } } },
      {
        $group: {
          _id: { label: '$analysis.speciator.genusName', key: '$analysis.speciator.genusId' },
          count: { $sum: 1 },
        },
      },
    ],
  },
  { field: 'country' },
  {
    field: 'access',
    aggregation: ({ user }) => {
      const schemes = getCollectionSchemes(user);
      return [
        {
          $group: {
            _id: {
              $cond: [
                {
                  $and: [
                    { $eq: [ '$reference', true ] },
                    { $in: [ '$analysis.speciator.organismId', schemes ] },
                  ],
                },
                'reference',
                { $cond: [ { $eq: [ '$public', true ] }, 'public', 'private' ] },
              ],
            },
            count: { $sum: 1 },
          },
        },
      ];
    },
  },
  {
    field: 'reference',
    aggregation: ({ query, user }) => {
      if (!organismHasPopulation([ query.organismId, query.speciesId, query.genusId ], user)) return null;
      return [
        { $match: { 'analysis.core.fp.reference': { $exists: true } } },
        { $group: { _id: '$analysis.core.fp.reference', count: { $sum: 1 } } },
      ];
    },
  },
  {
    field: 'uploadedAt',
    aggregation: ({ user }) => {
      if (!user) return null;
      return [
        { $match: { _user: user._id } },
        { $group: { _id: { $dateToString: { date: '$uploadedAt', format: '%Y-%m-%dT%H:%M:%S.%LZ' } }, count: { $sum: 1 } } },
      ];
    },
  },
  { field: 'date', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
  {
    field: 'mlst',
    task: 'mlst',
    aggregation: () => [
      { $match: { 'analysis.mlst.st': { $exists: true } } },
      { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 }, sources: { $addToSet: '$analysis.mlst.source' } } },
    ],
  },
  {
    field: 'mlst2',
    task: 'mlst2',
    aggregation: () => [
      { $match: { 'analysis.mlst2.st': { $exists: true } } },
      { $group: { _id: '$analysis.mlst2.st', count: { $sum: 1 }, sources: { $addToSet: '$analysis.mlst2.source' } } },
    ],
  },
  {
    field: 'resistance',
    aggregation: ({ query }) => [
      { $project: {
        antibiotics: {
          $filter: {
            input: '$analysis.paarsnp.antibiotics',
            as: 'ab',
            cond: query.resistance ?
              { $and: [
                { $eq: [ '$$ab.state', 'RESISTANT' ] },
                { $eq: [ '$$ab.fullName', query.resistance ] },
              ] } :
              { $eq: [ '$$ab.state', 'RESISTANT' ] },
          },
        },
      } },
      { $unwind: '$antibiotics' },
      { $group: { _id: '$antibiotics.fullName', count: { $sum: 1 } } },
    ],
  },
  {
    field: 'subspecies',
    // task: 'serotype',
    aggregation: () => [
      { $match: { $or: [ { 'analysis.serotype': { $exists: true } }, { 'analysis.speciator.organismId': '2697049' } ] } },
      {
        $group: {
          _id: {
            $ifNull: [ '$analysis.serotype.subspecies', '$analysis.speciator.organismName' ],
          },
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'serotype',
    task: 'serotype',
    aggregation: () => [
      { $match: { 'analysis.serotype': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.serotype.value',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'strain',
    task: 'poppunk',
    aggregation: () => [
      { $match: { 'analysis.poppunk': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.poppunk.strain',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'ngmast',
    task: 'ngmast',
    aggregation: () => [
      { $match: { 'analysis.ngmast': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.ngmast.ngmast',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'ngstar',
    task: 'ngstar',
    aggregation: () => [
      { $match: { 'analysis.ngstar': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.ngstar.st',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'genotype',
    task: 'genotyphi',
    aggregation: () => [
      { $match: { 'analysis.genotyphi': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.genotyphi.genotype',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'klocus',
    task: 'kleborate',
    aggregation: () => [
      { $match: { 'analysis.kleborate': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.kleborate.typing.K_locus',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'olocus',
    task: 'kleborate',
    aggregation: () => [
      { $match: { 'analysis.kleborate': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.kleborate.typing.O_locus',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'pangolin',
    task: 'pangolin',
    aggregation: () => [
      { $match: { 'analysis.pangolin': { $exists: true } } },
      {
        $group: {
          _id: '$analysis.pangolin.lineage',
          count: { $sum: 1 },
        },
      },
    ],
  },
  {
    field: 'sars_cov2_variants',
    task: 'sars_cov2_variants',
    aggregation: ({ query }) => [
      { $project: {
        sars_cov2_variants: {
          $filter: {
            input: '$analysis.sars_cov2_variants.variants',
            as: 'va',
            cond: query.sars_cov2_variants ?
              { $and: [
                { $eq: [ '$$va.state', 'var' ] },
                { $eq: [ '$$va.name', query.sars_cov2_variants ] },
              ] } :
              { $eq: [ '$$va.state', 'var' ] },
          },
        },
      } },
      { $unwind: '$sars_cov2_variants' },
      { $group: { _id: '$sars_cov2_variants.name', count: { $sum: 1 } } },
    ],
  },
  {
    field: 'collection',
    aggregation: ({ query, user, deployedOrganisms }) => {
      if (!deployedOrganisms.includes(query.organismId)) return null;
      const collectionAccess = [ { access: 'public' } ];
      if (user) {
        collectionAccess.push({ _user: user._id });
      }
      return [
        { $project: { _id: 1 } }, // don't need genome details
        { $lookup: { // attach membership info
          from: 'genomecollections',
          localField: '_id',
          foreignField: '_genome',
          as: 'memberOf',
        } },
        { $unwind: '$memberOf' }, // flatten document and filter out genomes not in a collection
        { $replaceRoot: { newRoot: '$memberOf' } }, // work directly with genomecollection docs
        { $unwind: '$collections' }, // create record for every membership
        { $group: { _id: '$collections', count: { $sum: 1 } } }, // summarise membership
        { $lookup: { // fetch related data
          from: 'collections',
          let: { id: '$_id' },
          pipeline: [
            { $match: { $or: collectionAccess, binned: false, organismId: query.organismId } }, // filter by visibility
            { $match: { $expr: { $eq: [ '$_id', '$$id' ] } } },
            { $project: { title: 1, token: 1 } },
          ],
          as: 'collection',
        } },
        { $unwind: '$collection' }, // flatten document and filter out collections that are not visible
        { $project: { // present in summary format
          _id: { key: '$collection.token', label: '$collection.title' },
          count: 1,
        } },
      ];
    },
  },
];

module.exports = async function (props) {
  const deployedOrganisms = await Organism.deployedOrganismIds(props.user);
  if (props.query.subspecies && props.query.subspecies === 'SARS-CoV-2') {
    props.query.organismId = '2697049';
  }
  const tasks = getTasksByOrganism(props.query, props.user).map(_ => _.task);
  const summary = await Genome.getSummary(
    summaryFields.filter(_ => (_.task ? tasks.includes(_.task) : true)),
    { ...props, deployedOrganisms }
  );

  // begin auto-taxonomy
  const genera = Object.keys(summary.genusId || {});
  const species = Object.keys(summary.speciesId || {});
  const organisms = Object.keys(summary.organismId || {});

  const { genusId, speciesId, organismId } = props.query;

  const taxQuery = {};
  if (!genusId && genera.length === 1) {
    const { count } = summary.genusId[genera[0]];
    if (count === summary.visible) {
      taxQuery.genusId = genera[0];
    }
  }
  if (!speciesId && (genusId || taxQuery.genusId) && species.length === 1) {
    const { count } = summary.speciesId[species[0]];
    if (count === summary.visible) {
      taxQuery.speciesId = species[0];
    }
  }
  if (!organismId && (speciesId || taxQuery.speciesId) && organisms.length === 1) {
    const { count } = summary.organismId[organisms[0]];
    if (count === summary.visible) {
      taxQuery.organismId = organisms[0];
    }
  }

  if (Object.keys(taxQuery).length > 0) {
    const query = { ...props.query, ...taxQuery };
    const nextTasks = getTasksByOrganism(query, props.user);
    const missingTasks = [];

    for (const { task } of nextTasks) {
      if (!tasks.includes(task)) {
        missingTasks.push(task);
      }
    }

    if (missingTasks.length) {
      const extraSummary = await Genome.getSummary(
        summaryFields.filter(_ => missingTasks.includes(_.task)),
        { ...props, query, deployedOrganisms, tasks: missingTasks }
      );

      return {
        ...summary,
        ...extraSummary,
        sources: {
          ...summary.sources,
          ...extraSummary.sources,
        },
      };
    }
  }

  // species should not be returned unless genus provided
  if (!genusId) {
    summary.speciesId = {};
  }

  return summary;
};
