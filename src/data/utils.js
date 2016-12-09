exports.setToObjectOptions = schema =>
  schema.set('toObject', {
    transform(doc, ret, options) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
