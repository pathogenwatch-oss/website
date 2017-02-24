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

exports.getSummary = function (model, summaryFields, props) {
  const prefilterCondition = model.getPrefilterCondition(props);
  const prefilterStage = [ { $match: prefilterCondition } ];
  return Promise.all([
    model.count(prefilterCondition),
    ...summaryFields.map(({ field, aggregation }) =>
      model.aggregate(
        prefilterStage.concat(
          aggregation ?
            aggregation(props) :
            [ { $group: { _id: `$${field}`, count: { $sum: 1 } } } ]
        )
      )
    ),
  ]).
  then(([ total, ...results ]) => {
    const summary = { total };

    results.forEach((result, index) => {
      summary[summaryFields[index].field] = result.reduce(
        (memo, { _id, count }) => {
          if (_id === null) return memo;
          if (typeof _id === 'object') {
            const previousCount = memo[_id.key] ? memo[_id.key].count : 0;
            memo[_id.key] = {
              count: previousCount + count,
              label: _id.label[0],
            };
          } else {
            memo[_id] = { count };
          }
          return memo;
        }, {}
      );
    });

    return summary;
  });
};
