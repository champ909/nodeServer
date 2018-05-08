"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let unitSchema = new Schema({
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

unitSchema.statics.getUnitById = function(id, callback) {
  return this.findOne({ _id: id })
    .populate("supervisors")
    .populate("technicians")
    .exec(callback);
};

unitSchema.statics.getUnits = function(callback) {
  return this.find({})
    .populate("supervisors")
    .populate("technicians")
    .exec(callback);
};

unitSchema.statics.saveUnit = function(unit, callback) {
  return unit.save(callback);
};

module.exports = mongoose.model("Unit", unitSchema);
