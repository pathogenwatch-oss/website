var mongoose = require('mongoose');
var uuid = require('node-uuid');
var shortid = require('shortid');

var projectSchema = mongoose.Schema({
  id: { type: String, default: uuid.v4 },
  shortId: { type: String, unique: true, default: shortid.generate },
  tree: { type: String, required: true },
  data: { type: Object, required: true },
  metadata: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String },
    email: { type: String }
  },
  raw: { type: Object, required: true },
  isListed: { type: Boolean, required: true, default: false },
  viewsCount: { type: Number, default: 0 },
  createdAt: Date,
  lastUpdatedAt: Date
}, {
  collection: 'project',
  id: false
});

// not using `default` property as both dates initialised to same value
projectSchema.pre('save', function (next) {
  var date = new Date();

  if (!this.createdAt) {
    this.createdAt = date;
  }

  this.lastUpdatedAt = date;

  next();
});

module.exports = mongoose.model('Project', projectSchema);
