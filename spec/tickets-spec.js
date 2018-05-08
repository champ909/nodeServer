const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Tickets API Tests:', function () {

  let adminUserJwt = '';
  let regularUserJwt = '';

  beforeAll( function (done) {
      // Get admin user jwt token.
    api.post({
      url: '/login',
      body: {
        username: 'techit',
        password: 'abcd'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      adminUserJwt = body.token;
      done();
    });

    // Get regular user jwt token.
    api.post({
        url: '/login',
        body: {
          username: 'jojo',
          password: 'abcd'
        }
    }, function (err, res, body) {
        expect(res.statusCode).toBe(200);
        regularUserJwt = body.token;
        done();
    });
  }); 

//   /api/tickets	POST	Create a new ticket.

  it('Get the technicians assigned to a ticket with admin user token.', function (done) {
    api.get({
      url: '/tickets/5af06af45c4052786643f5db/technicians',
      headers: {
        'Authorization': 'Bearer ' + adminUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body.length).toBeGreaterThan(0);
      done();
    });
  });

  it('Get the technicians assigned to a ticket with regular other user.', function (done) {
    api.get({
      url: '/tickets/5af06af45c4052786643f5db/technicians',
      headers: {
        'Authorization': 'Bearer ' + regularUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    });
  });

  it('Set the priority of a ticket with admin user token.', function (done) {
    api.put({
      url: '/tickets/5af136f972c71b7131d2838d/priority/MEDIUM',
      headers: {
        'Authorization': 'Bearer ' + adminUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Set the priority of a ticket with regular other user.', function (done) {
    api.put({
      url: '/tickets/5af136f972c71b7131d2838d/priority/MEDIUM',
      headers: {
        'Authorization': 'Bearer ' + regularUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    });
  });

  it('Set the status of a ticket with admin user token.', function (done) {
    api.put({
      url: '/tickets/5af136f972c71b7131d2838d/status/ONHOLD',
      headers: {
        'Authorization': 'Bearer ' + adminUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Set the status of a ticket with regular other user.', function (done) {
    api.put({
      url: '/tickets/5af136f972c71b7131d2838d/status/ONHOLD',
      headers: {
        'Authorization': 'Bearer ' + regularUserJwt
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    });
  });


//   it('Create new ticket with admin user token.', function (done) {
//     api.post({
//       url: '/tickets/5af136f972c71b7131d2838d/status/ONHOLD',
//       headers: {
//         'Authorization': 'Bearer ' + adminUserJwt
//       },
//       body: {
//         "createdForName": "Joseph Joestar",
//         "createdForEmail": "jojo@localhost.localdomain",
//         "subject": "Library noise",
//         "details": "Too much noise by front desk workers.",
//         "priority": "LOW",
//         "status": "OPEN",
//         "unit": "5af06af45c4052786643f5d4",
//         "technicians": ["5af06af45c4052786643f5d9", "5af06af45c4052786643f5d8"]
//       }
//     }, function (err, res, body) {
//       expect(res.statusCode).toBe(200);
//       done();
//     });
//   });

//   it('Create new ticket with regular other user.', function (done) {
//     api.post({
//       url: '/tickets/5af136f972c71b7131d2838d/status/ONHOLD',
//       headers: {
//         'Authorization': 'Bearer ' + regularUserJwt
//       },
//       body: {
//         "createdForName": "Joseph Joestar",
//         "createdForEmail": "jojo@localhost.localdomain",
//         "subject": "Library noise",
//         "details": "Too much noise by front desk workers.",
//         "priority": "LOW",
//         "status": "OPEN",
//         "unit": "5af06af45c4052786643f5d4",
//         "technicians": ["5af06af45c4052786643f5d9", "5af06af45c4052786643f5d8"]
//       }
//     }, function (err, res, body) {
//       expect(res.statusCode).toBe(401);
//       done();
//     });
//   });

});