const Genome = require('models/genome');
const Organism = require('models/organism');

const { getCollectionSchemes, organismHasTask } = require('manifest');

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
      aggregation: () => [
        {
          $group: {
            _id: {
              $cond: [ { $eq: [ '$public', true ] }, 'public', 'private' ],
            },
            count: { $sum: 1 },
          },
        },
      ],
    },
    {
      field: 'reference',
      aggregation: ({ query }) => {
        if (!query.organismId) return null;
        if (query.reference) {
          return [
            { $match: { 'analysis.speciator.organismId': query.organismId, reference: query.reference === 'true' } },
            { $group: { _id: query.reference, count: { $sum: 1 } } },
          ];
        }
        return [
          { $match: { 'analysis.speciator.organismId': query.organismId } },
          { $group: {
            _id: {
              $cond: [
                { $eq: [ '$reference', true ] },
                'true',
                'false',
              ],
            },
            count: { $sum: 1 },
          },
          },
        ];
      },
    },
    {
      field: 'uploadedAt',
      aggregation: ({ user }) => {
        if (!user) return null;
        const $match = { _user: user._id };
        return [ { $match }, { $group: { _id: '$uploadedAt', count: { $sum: 1 } } } ];
      },
    },
    { field: 'date', range: true, queryKeys: [ 'minDate', 'maxDate' ] },
    {
      field: 'mlst',
      aggregation: ({ query = {} }) => {
        if (!organismHasTask('mlst', query.organismId, query.speciesId, query.genusId)) return null;
        return [ { $group: { _id: '$analysis.mlst.st', count: { $sum: 1 }, sources: { $addToSet: '$analysis.mlst.source' } } } ];
      },
    },
    {
      field: 'mlst2',
      aggregation: ({ query = {} }) => {
        if (!organismHasTask('mlst2', query.organismId, query.speciesId, query.genusId)) return null;
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
      aggregation: ({ query }) => {
        if (!organismHasTask('serotype', query.organismId, query.speciesId, query.genusId)) return null;
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
      aggregation: ({ query }) => {
        if (!organismHasTask('serotype', query.organismId, query.speciesId, query.genusId)) return null;
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
      aggregation: ({ query }) => {
        if (!organismHasTask('poppunk', query.organismId, query.speciesId, query.genusId)) return null;
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
      aggregation: ({ query }) => {
        if (!organismHasTask('ngmast', query.organismId, query.speciesId, query.genusId)) return null;
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
      aggregation: ({ query }) => {
        if (!organismHasTask('ngstar', query.organismId, query.speciesId, query.genusId)) return null;
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
  if (!props.query.genusId) {
    // species should not be returned unless genus selected
    summary.speciesId = {};
  }
  const taxQuery = {};
  if (!props.query.genusId && genera.length === 1) {
    taxQuery.genusId = genera[0];
  }
  if (!props.query.speciesId && species.length === 1) {
    taxQuery.speciesId = species[0];
  }
  if (!props.query.organismId && organisms.length === 1) {
    taxQuery.organismId = organisms[0];
  }
  if (Object.keys(taxQuery).length > 0) {
    const query = { ...props.query, ...taxQuery };
    // this will add taxonomy-specific analysis
    return Genome.getSummary(summaryFields, { ...props, query });
  }

  return summary;
};
