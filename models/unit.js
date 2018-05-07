"use strict";

const mongoose = require("mongoose");
/*
create table units (
    id          bigint primary key,
    name        varchar(255) not null unique,
    description varchar(8000),
    email       varchar(255),
    phone       varchar(255),
    location    varchar(255)
);
*/

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
      ref: "User"
    }
  ],
  technicians: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Unit", unitSchema);
