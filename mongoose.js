let mongoose = require('mongoose');
const myUri = process.env['MONGO_URI'];

mongoose.connect(myUri, { useNewUrlParser: true, useUnifiedTopology: true });

let issueSchema = new mongoose.Schema({
  issue_title: {
    type: String, required: true
  },
  issue_text: {
    type: String, required: true
  },
  created_by: {
    type: String, required: true
  },
  assigned_to: {
    type: String, required: false, default: ""
  },
  status_text: {
    type: String, required: false, default: ""
  },
  open: {
    type: Boolean, required: false, default: true
  },
  project: {
    type: String, required: true
  },
  created_on: {
    type: Date, required: true
  },
  updated_on: {
    type: Date, required: true
  },
}, {
  versionKey: false
})

exports.Issue = mongoose.model('Issue', issueSchema);