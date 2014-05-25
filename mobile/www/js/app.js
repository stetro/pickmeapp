// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource'])

    .run(function ($ionicPlatform, push) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            /*var pushNotification = window.plugins.pushNotification;
             console.log("DO REGISTRATION");
             pushNotification.register(
             function(result) {
             console.log(result);
             console.log("REGISTRATION RESULT");
             },
             function() {
             console.log("REGISTRATION ERROR");
             }, {
             "senderID": "248058524630",
             "ecb": "onNotification"
             });*/
            var result = push.registerPush(function (result) {
                if (result.type === 'registration') {
                    localStorage.setItem('device_id', result.id);
                    localStorage.setItem('device', result.device);
                }
            });
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html",
                        controller: "SearchCtrl",
                        resolve: {
                            request: function(pushSender) {
                                return pushSender.list;

                            }
                        }
                    }
                }
            })

            .state('app.status', {
                url: "/status",
                views: {
                    'menuContent': {
                        templateUrl: "templates/status.html",
                        controller: "StatusCtrl"
                    }
                }
            })

            .state('app.buddyList', {
                url: "/buddylist",
                views: {
                    'menuContent': {
                        templateUrl: "templates/bestBuddyList.html",
                        controller: 'BuddyListCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/search');
    });

