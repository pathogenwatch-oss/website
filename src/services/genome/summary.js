const Genome = require('models/genome');
const Organism = require('models/organism');

const {
  organismHasTask,
  organismHasPopulation,
  getCollectionSchemes,
} = require('manifest');

function getSummaryFields(deployedOrganisms) {
  return [
    {
      field: 'organismId',
      aggregation: () => [
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
        if (Object.keys(query) === 0) return null;
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
          { $group: { _id: '$uploadedAt', count: { $sum: 1 } } },
        ];
      },
    },
    { field: 'date', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
    {
      field: 'mlst',
      aggregation: ({ query = {}, user }) => {
        if (!organismHasTask('mlst', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [ { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 }, sources: { $addToSet: '$analysis.mlst.source' } } } ];
      },
    },
    {
      field: 'mlst2',
      aggregation: ({ query = {}, user }) => {
        if (!organismHasTask('mlst2', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [ { $group: { _id: '$analysis.mlst2.st', count: { $sum: 1 }, sources: { $addToSet: '$analysis.mlst2.source' } } } ];
      },
    },
    {
      field: 'resistance',
      aggregation: ({ query }) => {
        const pipeline = [
          { $project: { 'analysis.paarsnp.antibiotics': 1 } },
          { $unwind: '$analysis.paarsnp.antibiotics' },
          { $match: { 'analysis.paarsnp.antibiotics.state': 'RESISTANT' } },
          { $group: { _id: '$analysis.paarsnp.antibiotics.fullName', count: { $sum: 1 } } },
        ];
        if (query.resistance) {
          // return selected antibiotic only, required to show as "active"
          return [
            ...pipeline,
            { $match: { _id: query.resistance } },
          ];
        }
        return pipeline;
      },
    },
    {
      field: 'subspecies',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('serotype', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.serotype': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.serotype.subspecies',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'serotype',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('serotype', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.serotype': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.serotype.value',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'poppunk',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('poppunk', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.poppunk': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.poppunk.strain',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'ngmast',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('ngmast', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.ngmast': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.ngmast.ngmast',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'ngstar',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('ngstar', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.ngstar': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.ngstar.st',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'genotype',
      aggregation: ({ query }) => {
        // organism level currently requires being "deployed", hard-coding this for now.
        if (query.genusId !== '590' && query.speciesId !== '28901') return null;
        return [
          { $match: { 'analysis.genotyphi': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.genotyphi.genotype',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
    {
      field: 'klocus',
      aggregation: ({ query, user }) => {
        if (!organismHasTask('kleborate', [ query.organismId, query.speciesId, query.genusId ], user)) return null;
        return [
          { $match: { 'analysis.kleborate': { $exists: true } } },
          {
            $group: {
              _id: '$analysis.kleborate.K_locus',
              count: { $sum: 1 },
            },
          },
        ];
      },
    },
  ];
}

module.exports = async function (props) {
  const deployedOrganisms = await Organism.deployedOrganismIds(props.user);
  const summaryFields = getSummaryFields(deployedOrganisms);
  const summary = await Genome.getSummary(summaryFields, props);

  // begin auto-taxonomy
  const genera = Object.keys(summary.genusId);
  const species = Object.keys(summary.speciesId);
  const organisms = Object.keys(summary.organismId);

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
    // this will add taxonomy-specific analysis
    return Genome.getSummary(summaryFields, { ...props, query });
  }

  // species should not be returned unless genus selected
  if (!genusId) {
    summary.speciesId = {};
  }

  return summary;
};
