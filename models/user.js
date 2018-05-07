"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['REGULAR', 'ADMIN', 'SUPERVISOR', 'TECHNICIAN'],
    default: 'REGULAR'
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  hash: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true
  },
  phone: String,
  department: String,
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  }
});

module.exports = mongoose.model('User', userSchema);
