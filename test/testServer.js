// http://mochajs.org/
// type 'mocha' in console for run tests
// http://jsbeautifier.org/

var http = require('http'),
  request = require('request'),
  chai = require('chai');

var assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

var serverUrl = 'http://192.168.0.14:8080';

var clientType, sessionId, roomNum;

describe('/', function() {
  before(function() {
    // runs before all tests in this block
    clientType = 'Init'; //White,Black,Looker
    sessionId = '1';
    roomNum = 101;
  });
  it('should return 200', function(done) {
    http.get(serverUrl, function(res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should return error logon', function(done) {
    request.get({
      url: serverUrl + '/logonPlayer',
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect({
        "status": "Error"
      }).to.have.property('status');
      expect({
        "status": "Error"
      }).to.have.property('status', 'Error');
      expect(response.body).to.have.property('status', 'Error');
      body.should.have.property('status'); //.and.to.match('Error');
      done();
    });
  });
  it('should reset room', function(done) {
    request.get({
      url: serverUrl + '/resetRoom',
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect(response.body).to.have.property('status', 'Ok');
      done();
    });
  });

  it('should allow logon White', function(done) {
    var params = 'clientType=' + encodeURIComponent(clientType) +
      '&sessionId=' + encodeURIComponent(sessionId) +
      '&name=' + encodeURIComponent("3") +
      '&roomNum=' + encodeURIComponent(roomNum);
    request.get({
      url: serverUrl + '/logonPlayer?' + params,
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect(response.body).to.have.property('clientType', 'White');
      expect(response.body).to.have.property('roomNum', '101');
      expect(response.body).to.have.property('sessionId', 'SampleSessionId_1_room_101');
      done();
    });
  });
  it('should allow logon Black', function(done) {
    var params = 'clientType=' + encodeURIComponent(clientType) +
      '&sessionId=' + encodeURIComponent(sessionId) +
      '&name=' + encodeURIComponent("3") +
      '&roomNum=' + encodeURIComponent(roomNum);
    request.get({
      url: serverUrl + '/logonPlayer?' + params,
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect(response.body).to.have.property('clientType', 'Black');
      expect(response.body).to.have.property('roomNum', '101');
      expect(response.body).to.have.property('sessionId', 'SampleSessionId_2_room_101');
      assert.notEqual(clientType,'Black');//input param not change
      done();
    });
  });
  it('should allow logon Looker', function(done) {
    var params = 'clientType=' + encodeURIComponent(clientType) +
      '&sessionId=' + encodeURIComponent(sessionId) +
      '&name=' + encodeURIComponent("3") +
      '&roomNum=' + encodeURIComponent(roomNum);
    request.get({
      url: serverUrl + '/logonPlayer?' + params,
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect(response.body).to.have.property('clientType', 'Looker');
      expect(response.body).to.have.property('roomNum', '101');
      expect(response.body).to.have.property('sessionId', '-');// TODO
      done();
    });
  });
  it('ping-pong should not change in-out params', function(done) {
    var params = 'clientType=' + encodeURIComponent(clientType) +
      '&sessionId=' + encodeURIComponent(sessionId) +
      '&name=' + encodeURIComponent("3") +
      '&roomNum=' + encodeURIComponent(roomNum);
    request.get({
      url: serverUrl + '/pingpong?' + params,
      json: true
    }, function(error, response, body) {
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(body).to.exist;
      expect(response.body).to.have.property('clientType', 'Init');
      expect(response.body).to.have.property('roomNum', '101');
      expect(response.body).to.have.property('sessionId', '1');// TODO
      done();
    });
  });
})