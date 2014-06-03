/**
 * Created by miganga on 5/30/14.
 */
'use strict';

xdescribe('Factory: tokenService', function () {
    var store = {};

    // load the controller's module
    beforeEach(module('starter.services'));

    var tokenService, $httpBackend;

    // Initialize the factory
    beforeEach(inject(function (_tokenService_, $injector) {
        tokenService = _tokenService_;

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('GET', '/token', {"Accept": "application/json, text/plain, */*", "access-token": "token"}).respond({}, {'Authorization': true});
    }));


    beforeEach(function () {
        // LocalStorage mock.
        spyOn(localStorage, 'getItem').andCallFake(function (key) {
            return store[key];
        });
        Object.defineProperty(sessionStorage, "setItem", { writable: true });
        spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
            store[key] = value;
        });
    });

    afterEach(function () {
        store = {};
    });

    it('checkCache method should return false when no token is saved in cache', function () {
        expect(tokenService.checkCache()).toBe(false);
    });

    it('checkCache method should return true when token exists in cache', function () {
        var store = {'access-token': 'token'};
        localStorage.setItem('access-token', store['access-token']);
        expect(tokenService.checkCache(localStorage.getItem('access-token'))).toBe(true);
    });

    it('matchToken method should send a get request', function () {
        $httpBackend.expectGET('/token');
        tokenService.matchToken('/token');
        $httpBackend.flush();
    });

    it('matchToken method should send the local access-token to the server', function () {
        var store = {'access-token': 'token'};
        localStorage.setItem('access-token', store['access-token']);
        $httpBackend.expectGET('/token', {"Accept": "application/json, text/plain, */*", "access-token": "token"});
        tokenService.matchToken('/token', {'access-token': localStorage.getItem('access-token')});
        $httpBackend.flush();
    });

    it('matchToken method should get false Authorization if the access-token is a mismatch', function () {
        var store = {'access-token': 'token'};
        localStorage.setItem('access-token', store['access-token']);
        $httpBackend.expectGET('/token', {"Accept": "application/json, text/plain, */*", "access-token": "token"}).respond(201, '', {'Authorization': false});
        tokenService.matchToken('/token', {'access-token': localStorage.getItem('access-token')});
        $httpBackend.flush();
    });
});

xdescribe('Factory: registerService', function () {
    // load the controller's module
    beforeEach(module('starter.services'));

    var registerService, $httpBackend;

    // Initialize the factory
    beforeEach(inject(function (_registerService_, $injector) {
        registerService = _registerService_;

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('GET', '/token', {"Accept": "application/json, text/plain, */*"}).respond({}, {'Registration': true});
    }));

    it('register method should send name data field to the server', function () {
        $httpBackend.expectGET('/register',{'Name':'Ziya','Phone':'1234561234'}).respond(201, {}, {'Authorization': false});
        expect(registerService.register('Ziya','1234561234').toEqual(true));
    });
    it('register method should send phone data field to the server', function () {

    });
    it('register method should get "Registration":true back if true', function () {

    });
    it('register method should get "Registration":false back if false', function () {

    });
    it('register method should get "access-token" back if true', function () {

    });
});

describe('Factory: smokeUser', function () {
    describe('status method', function() {
        var store = {};

        // load the controller's module
        beforeEach(module('starter.services'));

        var smokeUser, $httpBackend, q;

        // Initialize the factory
        beforeEach(inject(function (_smokeUser_, $injector, $q) {
            smokeUser = _smokeUser_;
            q = $q;

            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            // backend definition common for all tests
            $httpBackend.when('GET', '/status', {"Accept": "application/json, text/plain, */*", "access-token": "token"}).respond({}, {'response':'success'});
        }));

        beforeEach(function () {
            // LocalStorage mock.
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
                return store[key];
            });
            Object.defineProperty(sessionStorage, "setItem", { writable: true });
            spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
                store[key] = value;
            });
        });

        afterEach(function () {
            store = {};
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should send a accessToken field in the header', function () {
            $httpBackend.expectGET('/status', {"Accept": "application/json, text/plain, */*","access-token":""}).respond(200,"hello");
            smokeUser.status('/status', {'access-token': ''});
            $httpBackend.flush();
        });

        it('should send deviceUuid & phoneNo fields in the user object', function () {
            $httpBackend.expect('GET', '/status',{user:{deviceUuid:"",phoneNo:""}}, {"Accept":"application/json, text/plain, */*"}).respond(200,"hello");
            smokeUser.status('/status', {}, {user:{deviceUuid:"",phoneNo:""}});
            $httpBackend.flush();
        });

        it('should return a data object', function () {
            $httpBackend.expect('GET', '/status',{user:{deviceUuid:"",phoneNo:""}}, {"Accept":"application/json, text/plain, */*"}).respond({response:"success",data:""});
            var deferred = q.defer();
            deferred.resolve(smokeUser.status('/status', {}, {user:{deviceUuid:"",phoneNo:""}}));
            deferred.promise.then(function(value) {
                expect(value).toEqual({response:"success",data:""});
            });
            $httpBackend.flush();
        });

        it('matchToken method should send the local access-token to the server', function () {

        });

        it('matchToken method should get false Authorization if the access-token is a mismatch', function () {

        });
    });
});
