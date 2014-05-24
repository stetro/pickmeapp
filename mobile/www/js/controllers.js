angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('BuddyListCtrl', function ($scope) {
        $scope.playlists = [
            {
                title: 'Reggae',
                id: 1
            },
            {
                title: 'Chill',
                id: 2
            },
            {
                title: 'Dubstep',
                id: 3
            },
            {
                title: 'Indie',
                id: 4
            },
            {
                title: 'Rap',
                id: 5
            },
            {
                title: 'Cowbell',
                id: 6
            }
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('SearchCtrl', function ($scope, $stateParams, pushSender) {
        $scope.send = function() {
            pushSender.Send({regid: 2312321321, phonenumber: 213213213123});
        }
    });
