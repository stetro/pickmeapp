/**
 * Created by miganga on 5/24/14.
 */

angular.module('starter.services', [])

.factory('cordovaReady', function($rootScope, $q) {
    var loadingDeferred = $q.defer();

    document.addEventListener('deviceready', function() {
        $rootScope.$apply(loadingDeferred.resolve);
    });

    return function cordovaReady() {
        return loadingDeferred.promise;
    };
})

.service('phone', function() {
    this.isAndroid = function() {
        var uagent = navigator.userAgent.toLowerCase();
        return uagent.search('android') > -1 ? true : false;
    };
})

.factory('push', function($rootScope, phone, cordovaReady) {
    return {
        registerPush: function(fn) {
            cordovaReady().then(function() {
                var pushNotification = window.plugins.pushNotification,
                    successHandler = function(result) {},
                    errorHandler = function(error) {},
                    tokenHandler = function(result) {
                        return fn({
                            'type': 'registration',
                            'id': result,
                            'device': 'ios'
                        });
                    };
                    console.log("REGISTRATION STARTED");

                navigator.onNotificationAPN = function(event) {
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

                navigator.onNotificationGCM = function(event) {
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
                                if (event.coldstart) {} else {}
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
});