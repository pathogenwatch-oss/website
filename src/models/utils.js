exports.setToObjectOptions = schema =>
  schema.set('toObject', {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
