const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Units API Tests:", function() {
  let adminUserJwt = "";
  let regularUserJwt = "";

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
        url: "/units/5af06af45c4052786643f5d4/technicians",
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

  it("Get the technicians of a unit with regular other user.", function(done) {
    api.get(
      {
        url: "/units/5af06af45c4052786643f5d9a/technicians",
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
        url: "/units/5af06af45c4052786643f5d4/tickets",
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

  it("Get the tickets submitted to a unit with regular other user.", function(done) {
    api.get(
      {
        url: "/units/5af06af45c4052786643f5d9a/tickets",
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
