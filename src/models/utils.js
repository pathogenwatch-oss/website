const slug = require('slug');
const removeMarkdown = require('remove-markdown');

exports.setToObjectOptions = (schema, optionalTransform) =>
  schema.set('toObject', {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return optionalTransform ? optionalTransform(doc, ret, options) : ret;
    },
    retainKeyOrder: true,
  });

exports.addPreSaveHook = schema =>
  schema.pre('save', function (next) {
    const date = new Date();
    if (!this.createdAt) {
      this.createdAt = date;
      this.lastAccessedAt = date;
    }
    this.lastUpdatedAt = date;
    next();
  });

const rangeAggregation = field => [
  { $group: { _id: field, max: { $max: `$${field}` }, min: { $min: `$${field}` } } },
  { $project: { _id: 0 } },
];

const sumAggregation = field => [
  { $group: { _id: `$${field}`, count: { $sum: 1 } } },
];

function getRangeQuery(query, queryKeys) {
  const nextQuery = { ...query };
  for (const key of queryKeys) {
    nextQuery[key] = undefined;
  }
  return nextQuery;
}

async function aggregateSummaryFields(model, summaryFields, props) {
  const facets = [];
  const ranges = [];

  for (const { field, aggregation, range } of summaryFields) {
    let pipeline = null;

    if (aggregation) {
      pipeline = aggregation(props);
    } else if (range) {
      pipeline = rangeAggregation(field);
    } else {
      pipeline = sumAggregation(field);
    }

    if (!pipeline) {
      continue;
    }

    if (range) {
      ranges.push({ field, pipeline });
    } else {
      facets.push({ field, pipeline });
    }
  }

  const query = await model.getFilterQuery(props);
  const initialMatch = { ...query };
  const matchRanges = {};
  const rangeFacets = {};
  for (const { field, pipeline } of ranges) {
    rangeFacets[field] = [ { $match: { ...matchRanges } }, ...pipeline ];
    delete initialMatch[field];
    matchRanges[field] = query[field];
    for (const [ rangeField, [ { $match } ] ] of Object.entries(rangeFacets)) {
      if (rangeField === field) continue;
      $match[field] = query[field];
    }
  }

  return Promise.all([
    model.count(model.getPrefilterCondition(props)),
    model.count(query),
    model.aggregate([
      { $match: initialMatch },
      { $facet: {
        ...facets.reduce((memo, { field, pipeline }) => {
          memo[field] = [ { $match: matchRanges }, ...pipeline ];
          return memo;
        }, {}),
        ...rangeFacets,
      } },
    ]),
  ]);
}

function reduceResult(result) {
  return result.reduce(
    (memo, { _id, count }) => {
      if (_id === null || typeof _id === 'undefined') return memo;
      if (typeof _id === 'object') {
        const previousCount = memo[_id.key] ? memo[_id.key].count : 0;
        memo[_id.key] = {
          count: previousCount + count,
          label: Array.isArray(_id.label) ? _id.label[0] : _id.label,
        };
      } else if (_id instanceof Date) {
        memo[_id.toISOString()] = { count };
      } else {
        memo[_id] = { count };
      }
      return memo;
    }, {}
  );
}

exports.getSummary = async function (model, summaryFields, props) {
  const [ total, visible, [ facets ] ] =
    await aggregateSummaryFields(model, summaryFields, props);

  const summary = { total, visible, sources: {} };

  for (const { field, range } of summaryFields) {
    if (!(field in facets)) continue;
    const result = facets[field];
    if (range) {
      summary[field] = result[0];
    } else {
      summary[field] = reduceResult(result);
    }
    if (result.length && result[0].sources) {
      summary.sources[field] = result[0].sources[0];
    }
  }

  return summary;
};

exports.toSlug = function (text) {
  if (!text) return '';
  const slugText = slug(removeMarkdown(text), { lower: true });
  return slugText.length > 64 ?
    slugText.slice(0, 64) :
    slugText;
};

exports.getBinExpiryDate = function () {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};
