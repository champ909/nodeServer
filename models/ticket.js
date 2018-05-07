"use strict";

const mongoose = require("mongoose");
/*
    id                      bigint primary key,
    created_by              bigint not null references users(id),
    created_for_name        varchar(255),
    created_for_email       varchar(255) not null,
    created_for_phone       varchar(255),
    created_for_department  varchar(255),
    subject                 varchar(255) not null,
    details                 varchar(8000),
    location                varchar(255),
    unit_id                 bigint not null references units(id),
    priority                varchar(255) default 'MEDIUM',
    status                  varchar(255) default 'OPEN',
    date_created            datetime default now(),
    date_assigned           datetime,
    date_updated            datetime,
    date_closed             datetime,
    updates
*/

let ticketSchema = new mongoose.Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
    ref: "Unit"
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
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  },
  status: {
    type: String,
    enum: ["OPEN", "ASSIGNED", "ONHOLD", "COMPLETED", "CLOSED"],
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
        default: new Date()
      }
    }
  ]
});

module.exports = mongoose.model("Ticket", ticketSchema);
