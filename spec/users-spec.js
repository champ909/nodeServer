const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Users API Tests:", function() {
  let ticketUserJwt = "",
    ticketUserId = "",
    otherUserId = "";

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
        api.get(
          {
            url: "/users/jojo",
            headers: {
              Authorization: "Bearer " + ticketUserJwt
            }
          },
          function(err, res, body) {
            expect(res.statusCode).toBe(200);
            ticketUserId = body._id;
          }
        );
      }
    );
    api.post(
      {
        url: "/login",
        body: {
          username: "blee",
          password: "abcd"
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        api.get(
          {
            url: "/users/blee",
            headers: {
              Authorization: "Bearer " + body.token
            }
          },
          function(err, res, body) {
            expect(res.statusCode).toBe(200);
            otherUserId = body._id;
            done();
          }
        );
      }
    );
  });

  it("Get the tickets submitted by a user.", function(done) {
    api.get(
      {
        url: "/users/" + ticketUserId + "/tickets",
        headers: {
          Authorization: "Bearer " + ticketUserJwt
        }
      },
      function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("Get the tickets submitted by other user.", function(done) {
    api.get(
      {
        url: "/users/" + otherUserId + "/tickets",
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
