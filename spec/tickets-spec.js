const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Tickets API Tests:", function() {
  let adminUserJwt = "";
  let regularUserJwt = "",
    ticketId1 = "",
    ticketId2 = "",
    unitId1 = "",
    unitId2 = "";

  beforeAll(function(done) {
    // Get regular user jwt token.
    api.post(
      {
        url: "/login",
        body: {
          username: "jojo",
          password: "abcd"
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        regularUserJwt = body.token;
      }
    );

    // Get admin user jwt token.
    api.post(
      {
        url: "/login",
        body: {
          username: "techit",
          password: "abcd"
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        adminUserJwt = body.token;
        // Get tickets
        api.get(
          {
            url: "/tickets",
            headers: {
              Authorization: "Bearer " + adminUserJwt
            }
          },
          function(err, res, body) {
            expect(res.statusCode).toBe(200);
            ticketId1 = body[0]._id;
            ticketId2 = body[1]._id;
            done();
          }
        );
        // Get units
        api.get(
          {
            url: "/units",
            headers: {
              Authorization: "Bearer " + adminUserJwt
            }
          },
          function(err, res, body) {
            expect(res.statusCode).toBe(200);
            unitId1 = body[0]._id;
            unitId2 = body[1]._id;
            done();
          }
        );
      }
    );
  });

  //   /api/tickets	POST	Create a new ticket.

  it("Get the technicians assigned to a ticket with admin user token.", function(done) {
    api.get(
      {
        url: "/tickets/" + ticketId1 + "/technicians",
        headers: {
          Authorization: "Bearer " + adminUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        expect(body.length).toBeGreaterThan(0);
        done();
      }
    );
  });

  it("Get the technicians assigned to a ticket with regular other user.", function(done) {
    api.get(
      {
        url: "/tickets/" + ticketId1 + "/technicians",
        headers: {
          Authorization: "Bearer " + regularUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(403);
        done();
      }
    );
  });

  it("Set the priority of a ticket with admin user token.", function(done) {
    api.put(
      {
        url: "/tickets/" + ticketId1 + "/priority/MEDIUM",
        headers: {
          Authorization: "Bearer " + adminUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("Set the priority of a ticket with regular other user.", function(done) {
    api.put(
      {
        url: "/tickets/" + ticketId1 + "/priority/MEDIUM",
        headers: {
          Authorization: "Bearer " + regularUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(403);
        done();
      }
    );
  });

  it("Set the status of a ticket with admin user token.", function(done) {
    api.put(
      {
        url: "/tickets/" + ticketId1 + "/status/ONHOLD",
        headers: {
          Authorization: "Bearer " + adminUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("Set the status of a ticket with regular other user.", function(done) {
    api.put(
      {
        url: "/tickets/" + ticketId1 + "/status/ONHOLD",
        headers: {
          Authorization: "Bearer " + regularUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(403);
        done();
      }
    );
  });

  it("Create new ticket with regular user token.", function(done) {
    api.post(
      {
        url: "/tickets",
        headers: {
          Authorization: "Bearer " + adminUserJwt
        },
        body: {
          createdForName: "Joseph Joestar",
          createdForEmail: "jojo@localhost.localdomain",
          subject: "Library noise",
          details: "Too much noise by front desk workers.",
          unit: unitId1
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("Create new ticket with regular user token with insufficient details.", function(done) {
    api.post(
      {
        url: "/tickets",
        headers: {
          Authorization: "Bearer " + adminUserJwt
        },
        body: {
          createdForName: "Joseph Joestar",
          unit: unitId1
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(400);
        done();
      }
    );
  });
});
