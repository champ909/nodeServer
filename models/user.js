"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
create table users (
    id          bigint primary key,
    type        varchar(255) default 'REGULAR',
    username    varchar(255) not null unique,
    hash        varchar(255) not null,
    enabled     boolean not null default true,
    first_name  varchar(255),
    last_name   varchar(255),
    email       varchar(255) not null unique,
    phone       varchar(255),
    department  varchar(255),
    unit_id     bigint references units(id)
);
*/

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
    enum: ["REGULAR", "ADMIN", "SUPERVISOR", "TECHNICIAN"],
    default: "REGULAR"
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  hash: String,
  enabled: {
    type: Boolean,
    // required: true,
    default: true
  },
  phone: String,
  department: String,
  unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit"
  }
});

module.exports = mongoose.model("User", userSchema);
