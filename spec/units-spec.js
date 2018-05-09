const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Units API Tests:", function() {
  let adminUserJwt = "";
  let regularUserJwt = "";
  let unitId1 = "",
    unitId2 = "";
  beforeAll(function(done) {
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
        done();
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
        done();
      }
    );
  });

  it("Get the technicians of a unit with admin user token.", function(done) {
    api.get(
      {
        url: "/units/" + unitId1 + "/technicians",
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

  it("Get the technicians of a unit with regular other user.", function(done) {
    api.get(
      {
        url: "/units/" + unitId1 + "/technicians",
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

  it("Get the tickets submitted to a unit with admin user token.", function(done) {
    api.get(
      {
        url: "/units/" + unitId1 + "/tickets",
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

  it("Get the tickets submitted to a unit with regular other user.", function(done) {
    api.get(
      {
        url: "/units/" + unitId1 + "/tickets",
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
});
