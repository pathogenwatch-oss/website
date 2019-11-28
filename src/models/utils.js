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

async function aggregateSummaryFields(model, summaryFields, props) {
  const asyncQuery = model.getAsyncQuery ? await model.getAsyncQuery(props) : {};

  const aggregations = [
    model.count(model.getPrefilterCondition(props)),
    model.count({ ...asyncQuery, ...model.getSyncQuery(props) }),
  ];

  for (const { field, aggregation, range, queryKeys = [] } of summaryFields) {
    let aggregationStage = null;

    if (aggregation) {
      aggregationStage = aggregation(props);
    } else if (range) {
      aggregationStage = rangeAggregation(field);
    } else {
      aggregationStage = sumAggregation(field);
    }

    if (!aggregationStage) {
      aggregations.push(Promise.resolve([]));
    } else {
      let query;
      if (queryKeys.length) { // this is to support range aggregations e.g. date
        query = {};
        for (const key of Object.keys(props.query)) {
          if (!queryKeys.includes(key)) {
            query[key] = props.query[key];
          }
        }
      } else {
        query = props.query;
      }
      const $match = {
        ...asyncQuery,
        ...model.getSyncQuery(Object.assign({}, props, { query })),
      };
      const prefilterStage = [ { $match }, ...aggregationStage ];
      aggregations.push(model.aggregate(prefilterStage));
    }
  }

  return Promise.all(aggregations);
}

function reduceResult(result) {
  return result.reduce(
    (memo, { _id, count }) => {
      if (_id === null || typeof _id === 'undefined') return memo;
      if (_id.key && _id.label) {
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

exports.getSummary = function (model, summaryFields, props) {
  return aggregateSummaryFields(model, summaryFields, props)
    .then(([ total, visible, ...results ]) => {
      const summary = { total, visible, sources: {} };
      results.forEach((result, index) => {
        const { field, range } = summaryFields[index];
        if (range) {
          summary[field] = result[0];
        } else {
          summary[field] = reduceResult(result);
          if (result.length && result[0].sources) {
            summary.sources[field] = result[0].sources[0];
          }
        }
      });

      return summary;
    });
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
