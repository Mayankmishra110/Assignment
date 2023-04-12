const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Mobile: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Work: {
    type: String,
    required: true,
  },
  Resume: {
    type: String,
    required: true,
  },
  Current: {
    type: String,
    required: true,
  },
  Postal: {
    type: String,
    required: true,
  },
  Employer: {
    type: String,
    required: true,
  },
  Designation: {
    type: String,
    required: true,
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
