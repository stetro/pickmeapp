/**
 * Created by miganga on 5/24/14.
 */

angular.module('starter.services', ['ngResource'])

    .factory('cordovaReady', function ($rootScope, $q) {
        var loadingDeferred = $q.defer();

        document.addEventListener('deviceready', function () {
            $rootScope.$apply(loadingDeferred.resolve);
        });

        return function cordovaReady() {
            return loadingDeferred.promise;
        };
    })

    .service('phone', function () {
        this.isAndroid = function () {
            var uagent = navigator.userAgent.toLowerCase();
            return uagent.search('android') > -1 ? true : false;
        };
        this.specs = {
            regid: 'qweqwewqe',
            gps: '3123213123123,213123123'
        }
    })

    .factory('push', function ($rootScope, phone, cordovaReady) {
        return {
            registerPush: function (fn) {
                cordovaReady().then(function () {
                    var pushNotification = window.plugins.pushNotification,
                        successHandler = function (result) {
                        },
                        errorHandler = function (error) {
                        },
                        tokenHandler = function (result) {
                            return fn({
                                'type': 'registration',
                                'id': result,
                                'device': 'ios'
                            });
                        };
                    console.log("REGISTRATION STARTED");

                    navigator.onNotificationAPN = function (event) {
                        if (event.alert) {
                            navigator.notification.alert(event.alert);
                        }

                        if (event.sound) {
                            var snd = new Media(event.sound);
                            snd.play();
                        }

                        if (event.badge) {
                            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
                        }
                    };

                    navigator.onNotificationGCM = function (event) {
                        switch (event.event) {
                            case 'registered':
                                if (event.regid.length > 0) {
                                    console.log("Registration Success");
                                    return fn({
                                        'type': 'registration',
                                        'id': event.regid,
                                        'device': 'android'
                                    });
                                }
                                break;

                            case 'message':
                                console.log("Message Success!!");
                                if (event.foreground) {


                                } else {
                                    if (event.coldstart) {
                                    } else {
                                    }
                                }
                                break;

                            case 'error':
                                break;

                            default:
                                break;
                        }
                    };

                    if (phone.isAndroid()) {
                        pushNotification.register(successHandler, errorHandler, {
                            'senderID': '248058524630',
                            'ecb': 'navigator.onNotificationGCM'
                        });
                    } else {
                        console.log('register ios');
                        pushNotification.register(tokenHandler, errorHandler, {
                            'badge': 'true',
                            'sound': 'true',
                            'alert': 'true',
                            'ecb': 'navigator.onNotificationAPN'
                        });
                    }
                });
            }
        };
    })
    .factory('pushSender', function ($resource, $http) {
        var push = $resource(
            'http://pickmeapp.stetro.ursa.uberspace.de/index.php/:action',
            { },
            {
                send: {
                    method: 'GET',
                    params: {
                        action: 'push', title: 'pickMeApp', message: 'Smokes coming up...'
                    }
                },
                list: {
                    method: 'GET',
                    params: {
                        action: 'listrequests'
                    }
                },
                status: {
                    method: 'GET',
                    isArray : true,
                    params: {
                        action: 'status'
                    }
                },
                close: {
                    method: 'GET',
                    params: {
                        action: 'close'
                    }
                },
                response: {
                    method: 'GET',
                    params: {
                        action: 'response', title: 'pickMeApp', message: 'Saw that smoke'
                    }
                }

            }
        );
        /*var pushHttp = function (regid, phonenumber) {
            $http.post('http://pickmeapp.stetro.ursa.uberspace.de/index.php/sendtest', {'regid': regid, 'phonenumber': phonenumber}).then(function (resp) {
                console.log('Success', resp);
                // For JSON responses, resp.data contains the result
            }, function (err) {
                console.error('ERR', err);
                // err.status will contain the status code
            });
        };*/
        var factory = {};
        factory.Send = function (regid, phonenumber) {
            return push.send({regid: regid, phonenumber: phonenumber});
        };
        factory.listRequests = function () {
            return push.list();
        };
        factory.status = function () {
            return push.status();
        };
        factory.respond = function (regid, own_regid) {
            return push.response({regid: regid, own_regid : own_regid});
        };
        /*factory.httpSend = function (regid, phonenumber) {
            return pushHttp(regid, phonenumber);
        };*/
        return factory;
    })

    .factory('buddyList', function () {
        var factory = {};
        factory.buddies = [
            {
                name: 'Ziya',
                distance: 2500,
                area: 'Ehrenfeld',
                phone: 017697591622
            },
            {
                name: 'Lars',
                distance: 500,
                area: 'Rudolfplatz',
                phone: 017697591622
            },
            {
                name: 'Valerie',
                distance: 100,
                area: 'Nippes',
                phone: 017697591622
            },
            {
                name: 'Ahmet',
                distance: 5000,
                area: 'Kalk',
                phone: 017697591622
            },
            {
                name: 'Johnny',
                distance: 40000,
                area: 'Bonn',
                phone: 017697591622
            }
        ];
        return factory;
    })
    .factory('tokenService', function ($http,$q) {
        var tokenCache = localStorage.getItem('access-token');
        var token;
        return {
            /*checks local cache against registration token*/
            checkCache: function(token) {
                var _token = token || tokenCache;
                clog('tokenCache',_token);
                return existy(_token);
            },
            /*matches existing token with the server*/
            matchToken: function(url, headers) {
                var _headers =  headers || {'access-token': tokenCache};
                var _url = url || 'http://yourapirul';
                var deferred = $q.defer();
                $http({method: 'GET', url: _url , headers: _headers}).success(function(data, status, headers) {
                    deferred.resolve(headers('Authorization'));
                });
                deferred.promise.then(function(value) {
                    clog('Authorization',value);
                });
            }
        }
    })
    .factory('smokeUser', function ($http,$q) {
        var tokenCache = localStorage.getItem('access-token');
        var deviceUuid = localStorage.getItem('device-uuid');
        var phoneNo = localStorage.getItem('phone-no');
        var token;
        return {
            /*checks local cache against registration token*/
            checkToken: function(token) {
                var _token = token || tokenCache;
                clog('tokenCache',_token);
                return existy(_token);
            },
            /*sends user data and gets a JSON object back from the server*/
            status: function(url, headers, userData) {
                var _headers =  headers || {'access-token': tokenCache};
                var _url = url || 'http://yourapirul';
                var _userData = userData || {user:{deviceUuid:deviceUuid,phoneNo:phoneNo}};
                var deferred = $q.defer();
                $http({method: 'GET', url: _url ,data: _userData, headers: _headers}).success(function(data, status, headers) {
                    deferred.resolve(data);
                });
                deferred.promise.then(function(value) {
                    clog('data',JSON.stringify(value));
                });
                return deferred.promise;
            }
        }
    });