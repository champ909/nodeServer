const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Login API Tests:', function () {

  it('Login without a username.', function (done) {
    api.post({
      url: '/login',
      body: {
          password: 'abcd'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect( res.body.message, 'Bad Request: Missing username and/or password.');
      done();
    });
  });

  it('Login without a password.', function (done) {
    api.post({
      url: '/login',
      body: {
          username: 'techit'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect( res.body.message, 'Bad Request: Missing username and/or password.');
      done();
    });
  });

  it('Login with invalid username and/or password.', function (done) {
    api.post({
      url: '/login',
      body: {
          username: 'techit',
          password: 'abcd2'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      expect( res.body.message, 'Bad Request: Wrong username and/or password.');
      done();
    });
  });

  it('Login success.', function (done) {
    api.post({
      url: '/login',
      body: {
          username: 'techit',
          password: 'abcd'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

});