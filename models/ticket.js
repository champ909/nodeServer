'use strict';

const mongoose = require('mongoose');

let ticketSchema = new mongoose.Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdForName: String,
  createdForEmail: {
    type: String,
    required: true
  },
  createdForPhone: String,
  createdForDepartment: String,
  subject: {
    type: String,
    required: true
  },
  details: String,
  location: String,
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateAssigned: Date,
  dateUpdated: Date,
  dateClosed: Date,
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'ONHOLD', 'COMPLETED', 'CLOSED'],
    default: 'OPEN'
  },
  technicians: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  updates: [
    {
      details: String,
      technician: {
        id: Schema.Types.ObjectId,
        username: String
      },
      date: {
        type: Date,
        default: new Date()
      }
    }
  ]
});

module.exports = mongoose.model('Ticket', ticketSchema);
