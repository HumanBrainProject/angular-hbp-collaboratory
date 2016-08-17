describe('clbAuthHttp', function() {
  beforeEach(angular.mock.module('clb-app'));

  describe('proxy $http', function() {
    var spyHttp;
    var authHttp;
    var setToken;

    angular.module('mockHttp', [])
    .provider('$http', function() {
      return {
        $get: function($q) {
          spyHttp = jasmine.createSpy('$http').and.returnValue($q.when({
            status: 200,
            data: {}
          }));
          return spyHttp;
        }
      };
    });

    beforeEach(angular.mock.module('mockHttp'));

    beforeEach(inject(function(clbAuthHttp, clbAppHello) {
      setToken = function(token) {
        if (token) {
          clbAppHello.utils.store('hbp', {
            access_token: token, // eslint-disable-line camelcase
            token_type: 'Bearer', // eslint-disable-line camelcase
            expires: Number.MAX_SAFE_INTEGER
          });
        } else {
          clbAppHello.utils.store('hbp', null);
        }
      };
      authHttp = clbAuthHttp;
    }));

    afterEach(inject(function(clbAppHello) {
      clbAppHello.utils.store('hbp', null);
    }));

    describe('clbAuthHttp(config)', function() {
      describe('when authenticated', function() {
        beforeEach(function() {
          setToken('aaaa');
        });

        it('should add the header option', function() {
          authHttp({method: 'GET', url: 'https://test.com'});
          expect(spyHttp).toHaveBeenCalledWith({
            method: 'GET',
            url: 'https://test.com',
            headers: {
              Authorization: 'Bearer aaaa'
            }
          });
        });

        it('should add the authorization header', function() {
          authHttp({method: 'GET', url: 'https://test.com', headers: {ContentType: 'text/plain'}});
          expect(spyHttp).toHaveBeenCalledWith({
            method: 'GET',
            url: 'https://test.com',
            headers: {
              ContentType: 'text/plain',
              Authorization: 'Bearer aaaa'
            }
          });
        });
      });

      describe('when not authenticated', function() {
        beforeEach(function() {
          setToken(null);
        });

        it('should add the header option', function() {
          var config = {method: 'GET', url: 'https://test.com'};
          authHttp(angular.extend({}, config));
          expect(spyHttp).toHaveBeenCalledWith(config);
        });

        it('should add the authorization header', function() {
          var config = {
            method: 'GET',
            url: 'https://test.com',
            headers: {ContentType: 'text/plain'}
          };
          authHttp(angular.extend({}, config));
          expect(spyHttp).toHaveBeenCalledWith(config);
        });
      });
    });

    angular.forEach(['get', 'head', 'delete'], function(verb) {
      it('should call clbAuthHttp()', function() {
        setToken('aaaa');
        authHttp[verb]('https://test/com');
        expect(spyHttp).toHaveBeenCalledWith({
          url: 'https://test/com',
          method: verb.toUpperCase(),
          headers: {
            Authorization: 'Bearer aaaa'
          }
        });
      });

      it('should call clbAuthHttp() without credentials', function() {
        authHttp[verb]('https://test/com');
        expect(spyHttp).toHaveBeenCalledWith({
          url: 'https://test/com',
          method: verb.toUpperCase()
        });
      });
    });

    angular.forEach(['post', 'patch', 'put'], function(verb) {
      it('should call clbAuthHttp()', function() {
        setToken('aaaa');
        authHttp[verb]('https://test/com', {a: 1});
        expect(spyHttp).toHaveBeenCalledWith({
          url: 'https://test/com',
          method: verb.toUpperCase(),
          data: {a: 1},
          headers: {
            Authorization: 'Bearer aaaa'
          }
        });
      });

      it('should preserve the headers', function() {
        setToken('aaaa');
        authHttp[verb]('https://test/com', {a: 1}, {
          headers: {ContentType: 'text/plain'}
        });
        expect(spyHttp).toHaveBeenCalledWith({
          url: 'https://test/com',
          method: verb.toUpperCase(),
          data: {a: 1},
          headers: {
            ContentType: 'text/plain',
            Authorization: 'Bearer aaaa'
          }
        });
      });
    });
  });

  describe('session', function() {
    var authHttp;
    var auth;
    var backend;
    var scope;
    var q;

    beforeEach(function() {
      inject(function(
        $rootScope,
        $httpBackend,
        $q,
        clbAuth,
        clbAuthHttp
      ) {
        authHttp = clbAuthHttp;
        auth = clbAuth;
        backend = $httpBackend;
        scope = $rootScope;
        q = $q;
      });
    });

    afterEach(function() {
      backend.verifyNoOutstandingExpectation();
      backend.verifyNoOutstandingRequest();
    });

    describe('expiration', function() {
      beforeEach(inject(function(clbAppHello) {
        clbAppHello.utils.store('hbp', {
          access_token: 'cccc', // eslint-disable-line camelcase
          token_type: 'Bearer', // eslint-disable-line camelcase
          expires: ((new Date()) / 1e3) + 1
        });
      }));

      it('should handle 401 error', function() {
        spyOn(auth, 'logout').and.returnValue(q.when());
        spyOn(auth, 'login');
        backend.expectGET('https://www.test.com').respond(401);
        authHttp.get('https://www.test.com');
        scope.$apply();
        backend.flush(1);
        expect(auth.logout).toHaveBeenCalled();
        expect(auth.login).toHaveBeenCalled();
      });

      it('can be disabled', function() {
        var actual;
        authHttp.configure({
          handleSessionExpiration: false
        });
        spyOn(auth, 'logout').and.returnValue(q.when());
        backend.expectGET('https://www.test.com').respond(401);
        authHttp.get('https://www.test.com')
        .catch(function(err) {
          actual = err;
        });
        scope.$apply();
        backend.flush(1);
        expect(actual.status).toBe(401);
        expect(auth.logout).not.toHaveBeenCalled();
      });
    });

    describe('auto login', function() {
      beforeEach(inject(function(clbAppHello) {
        clbAppHello.utils.store('hbp', null);
      }));

      it('should be disabled by default', function() {
        spyOn(auth, 'login');
        backend.expectGET('http://www.test.com', {
          Accept: 'application/json, text/plain, */*'
        }).respond(200);
        authHttp.get('http://www.test.com');
        expect(auth.login).not.toHaveBeenCalled();
        backend.flush(1);
      });

      it('should call the login function', inject(function(clbAppHello) {
        authHttp.configure({
          automaticLogin: true
        });
        spyOn(auth, 'login').and.callFake(function() {
          clbAppHello.utils.store('hbp', {
            access_token: 'dddd', // eslint-disable-line camelcase
            token_type: 'Bearer', // eslint-disable-line camelcase
            expires: ((new Date()) / 1e3) + 1
          });
          return q.when({});
        });
        backend.expectGET('http://www.test.com', {
          Authorization: 'Bearer dddd',
          Accept: 'application/json, text/plain, */*'
        }).respond(200);
        authHttp.get('http://www.test.com');
        expect(auth.login).toHaveBeenCalled();
        backend.flush(1);
      }));
    });
  });
});
