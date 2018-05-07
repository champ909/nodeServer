/**
 * This is a Mongo Shell script.
 * Run it with Mongo shell on command line:
 *     mongo localhost/techit techit-create.js
 *            or
 *     inside Mongo shell: load('techit-create.js')
 */

db = connect("localhost/techit");

// Drop existing collections, if any.
db.users.drop();
db.tickets.drop();
db.units.drop();

// Insert into unit.
units = db.units.insertMany( [
  { name: "TechOps" },
  { name: "ITC" }] 
).insertedIds;

// Insert into users.
// All hash are bcrypt('abcd')
users = db.users.insertMany([
  {
    username: "techit",
    type: "ADMIN",
    hash: "$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO",
    firstName: "System",
    lastName: "Admin",
    email: "techit@localhost.localdomain"
  },
  {
    username: "jsmith",
    type: "SUPERVISOR",
    hash: "$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO",
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@localhost.localdomain",
    unit: units[0]
  },
  {
    username: "jjim",
    type: "TECHNICIAN",
    hash: "$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO",
    firstName: "Jimmy",
    lastName: "Jim",
    email: "jjim@localhost.localdomain",
    unit: units[0]
  },
  {
    username: "blee",
    type: "TECHNICIAN",
    hash: "$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO",
    firstName: "Bob",
    lastName: "Lee",
    email: "blee@localhost.localdomain",
    unit: units[0]
  },
  {
    username: "jojo",
    type: "REGULAR",
    hash: "$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO",
    firstName: "Joseph",
    lastName: "Joestar",
    email: "jojo@localhost.localdomain"
  }
]).insertedIds;

// Update units with supervisors and technicians.
db.units.update(
  {
    _id: units[0]
  },
  {
    $push: {
      supervisors: users[1],
      technicians: {
        $each: [users[2], users[3]]
      }
    }
  }
);

// Insert into tickets
tickets = db.tickets.insertMany([
  {
    createdBy: users[4],
    createdForName: "Joseph Joestar",
    createdForEmail: "jojo@localhost.localdomain",
    subject: "Projector Malfunction",
    details: "The projector is broken in room A220.",
    unit: units[0],
    technicians: [users[2]]
  },
  {
    createdBy: users[4],
    createdForName: "Joseph Joestar",
    createdForEmail: "jojo@localhost.localdomain",
    subject: "Equipment for EE Senior Design Project",
    details: "One of the EE senior design projects needs some equipment.",
    unit: units[0],
    technicians: [users[2], users[3]]
  }
]).insertedIds;

// create indexes
db.users.createIndex(
  {
    username: 1,
    email: 1
  },
  {
    unique: true
  }
);

db.units.createIndex(
  {
    name: 1
  },
  {
    unique: true
  }
);
