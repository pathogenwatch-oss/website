const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  alias: { type: String, index: true },
  createdAt: { type: Date, index: true },
  description: String,
  organismId: String,
  pmid: String,
  public: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publicationYear: { type: Number, index: true },
  private: { type: Boolean, default: false },
  showcase: Boolean,
  size: Number,
  subtrees: [ {
    name: String,
    tree: String,
    totalCollection: Number,
    totalPublic: Number,
  } ],
  title: { type: String, index: 'text' },
  uuid: { type: String, index: true },
  genomes: [ Schema.Types.ObjectId ],
});

module.exports = mongoose.model('_collection', schema);
