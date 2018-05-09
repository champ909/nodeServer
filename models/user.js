"use strict";

const mongoose = require("mongoose");
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
  hash: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  phone: String,
  department: String,
  unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit"
  }
});

userSchema.statics.getUserById = function(id, fieldFilter, callback) {
  return this.findOne(
    { _id: id },
    fieldFilter || fieldFilter != {} ? fieldFilter : { hash: 0 }
  )
    .populate("unit")
    .exec(callback);
};

userSchema.statics.getUserByUsername = function(
  username,
  fieldFilter,
  callback
) {
  return this.findOne(
    { username: username },
    fieldFilter || fieldFilter != {} ? fieldFilter : { hash: 0 }
  )
    .populate("unit")
    .exec(callback);
};

userSchema.statics.getUsers = function(fieldFilter, callback) {
  return this.find(
    {},
    fieldFilter || fieldFilter != {} ? fieldFilter : { hash: 0 }
  )
    .populate("unit")
    .exec(callback);
};

userSchema.statics.saveUser = function(user, callback) {
  return user.save(callback);
};

module.exports = mongoose.model("User", userSchema);
