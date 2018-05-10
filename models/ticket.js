"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["OPEN", "ASSIGNED", "ONHOLD", "COMPLETED", "CLOSED"];

let ticketSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
    ref: "Unit",
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
    enum: priorities,
    default: "MEDIUM"
  },
  status: {
    type: String,
    enum: statuses,
    default: "OPEN"
  },
  technicians: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
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
        default: Date.now
      }
    }
  ]
});

ticketSchema.statics.getTicketById = function(id, callback) {
  return this.findOne({ _id: id })
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

ticketSchema.statics.getTickets = function(callback) {
  return this.find({})
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

// created by user under certain unit [combined dao]
ticketSchema.statics.getTicketsCreatedByUser = function(
  userId,
  unitId,
  callback
) {
  let query = { createdBy: userId };
  if (unitId) query.unit = unitId;

  return this.find(query)
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

ticketSchema.statics.getTicketsCreatedForEmail = function(email, callback) {
  return this.find({ createdForEmail: email })
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

ticketSchema.statics.getTicketsAssignedToTechnician = function(
  technicianId,
  callback
) {
  return this.find({
    technicians: {
      $all: [technicianId]
    }
  })
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

ticketSchema.statics.getTicketsAssignedToUnit = function(unitId, callback) {
  return this.find({ unit: unitId })
    .populate("technicians")
    .populate("unit")
    .exec(callback);
};

ticketSchema.statics.saveTicket = function(ticket, callback) {
  return ticket.save(callback);
};

ticketSchema.statics.saveUpdate = function(ticket, details, technician) {
  return ticket.updates.push({ details: details, technician: technician });
};

ticketSchema.statics.isValidPriority = function(priority) {
  return priority && priorities.includes(priority) ? true : false;
};

ticketSchema.statics.isValidStatus = function(status) {
  return status && statuses.includes(status) ? true : false;
};

module.exports = mongoose.model("Ticket", ticketSchema);
