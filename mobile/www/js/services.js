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
            null,
            {
                send: {
                    method: 'GET',
                     params:{
                     action: 'sendtest'
                     }
                }
            }
        );
        var pushHttp = function(regid, phonenumber) {
            $http.post('http://pickmeapp.stetro.ursa.uberspace.de/index.php/sendtest',{'regid':regid,'phonenumber':phonenumber}).then(function (resp) {
                console.log('Success', resp);
                // For JSON responses, resp.data contains the result
            }, function (err) {
                console.error('ERR', err);
                // err.status will contain the status code
            });
        };
        var factory = {};
        factory.Send = function (regid, phonenumber) {
            return push.send({regid: regid, phonenumber: phonenumber});
        };
        factory.httpSend = function (regid, phonenumber) {
            return pushHttp(regid, phonenumber);
        };
        return factory;
    })
    .factory('buddyList', function() {
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
    });