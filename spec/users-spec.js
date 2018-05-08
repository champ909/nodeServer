const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Users API Tests:", function() {
  let ticketUserJwt = "";

  beforeAll(function(done) {
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
        ticketUserJwt = body.token;
        done();
      }
    );
  });

  it("Get the tickets submitted by a user.", function(done) {
    api.get(
      {
        url: "/users/5af06af45c4052786643f5da/tickets",
        headers: {
          Authorization: "Bearer " + ticketUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        expect(body.length).toBeGreaterThan(0);
        done();
      }
    );
  });

  it("Get the tickets submitted by other user.", function(done) {
    api.get(
      {
        url: "/users/5af06af45c4052786643f5d9a/tickets",
        headers: {
          Authorization: "Bearer " + ticketUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(403);
        done();
      }
    );
  });
});
