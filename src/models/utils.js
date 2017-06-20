exports.setToObjectOptions = (schema, optionalTransform) =>
  schema.set('toObject', {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return optionalTransform ? optionalTransform(doc, ret, options) : ret;
    },
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

function aggregateSummaryFields(model, summaryFields, props) {
  const prefilterCondition = model.getFilterQuery(props);

  const aggregations = summaryFields.reduce((memo, { field, aggregation, range }) => {
    let aggregationStage = null;

    if (aggregation) {
      aggregationStage = aggregation(props);
    } else if (range) {
      aggregationStage = rangeAggregation(field);
    } else {
      aggregationStage = sumAggregation(field);
    }

    if (!aggregationStage) {
      memo.push(Promise.resolve([]));
    } else {
      const filterCondition = Object.assign({}, prefilterCondition);
      if (field in filterCondition) {
        delete filterCondition[field];
      }
      const prefilterStage = [ { $match: filterCondition }, ...aggregationStage ];
      memo.push(model.aggregate(prefilterStage));
    }

    return memo;
  }, [ model.count(prefilterCondition) ]);

  return Promise.all(aggregations);
}

function reduceResult(result) {
  return result.reduce(
    (memo, { _id, count }) => {
      if (_id === null) return memo;
      if (_id.key && _id.label) {
        const previousCount = memo[_id.key] ? memo[_id.key].count : 0;
        memo[_id.key] = {
          count: previousCount + count,
          label: _id.label[0],
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
    .then(([ total, ...results ]) => {
      const summary = { total };
      results.forEach((result, index) => {
        const { field, range } = summaryFields[index];
        if (range) {
          summary[field] = result[0];
        } else {
          summary[field] = reduceResult(result);
        }
      });

      return summary;
    });
};
