'use strict';

const mongoose = require('mongoose');

let unitSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  location: String,
  email: String,
  description: String,
  phone: String,
  supervisors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  technicians: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Unit', unitSchema);
