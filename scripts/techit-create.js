import { connect } from "net";

/**
 * This is a Mongo Shell script. Run it with Mongo shell on command line:
 *     mongo blogs.js
 * or inside Mongo shell: load('blogs.js')
 */
db = connect(process.env.DBURL);

db.users.drop();
db.tickets.drop();
db.units.drop();

// create a unique index on the email field in user
db.users.createIndex(
  {
    username: 1,
    email: 1
  },
  {
    unique: true
  }
);

// insert two users and get the generated _id
userId1 = db.users.insertOne({
  firstName: "John",
  lastName: "Doe",
  email: "jdoe1@localhost",
  username: "jdoe1"
}).insertedId;

userId2 = db.users.insertOne({
  firstName: "Jane",
  lastName: "Doe",
  email: "jdoe2@localhost",
  username: "jdoe2"
}).insertedId;

print(userId1);
print(userId2);

// insert two articles

article1 = {
  title: "Using MongoDB",
  text: "Something about MongoDB",
  author: userId1,
  date: new Date(2017, 2, 20),
  comments: [
    {
      text: "I like this article!",
      author: {
        id: userId2,
        firstName: "Jane",
        lastName: "Doe"
      },
      date: new Date(2017, 2, 22)
    }
  ],
  tags: ["NoSQL", "MongoDB", "Web Development"]
};

article2 = {
  title: "Programming Node.js",
  text: "Something about Node.js",
  author: userId2,
  date: new Date(2017, 3, 1),
  comments: [
    {
      text: "Thank you for the article.",
      author: {
        id: userId1,
        firstName: "John",
        lastName: "Doe"
      },
      date: new Date(2017, 3, 2)
    }
  ],
  tags: ["JavaScript", "Node.js", "Web Development"]
};

db.articles.insert(article1);
db.articles.insert(article2);
