angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('BuddyListCtrl', function ($scope, buddyList) {
        $scope.buddies = buddyList.buddies;
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {

    })

    .controller('SearchCtrl', function ($scope, $stateParams, $location, pushSender, buddyList, phone, request) {
        $scope.flag = true;
        /*if (localStorage.getItem('pushStatus') === 'sent') {
            //$location.path('/app/status');
            $scope.list = true;
            $scope.flag = false;
        }*/
        $scope.send = function() {
            pushSender.Send({regid: phone.specs.regid ,gps: phone.specs.regid});
            //localStorage.setItem('pushStatus', 'sent');
            //$location.path('/app/status');
            $scope.flag = false;
        };
        $scope.buddies = buddyList.buddies;
        $scope.doRefresh = function() {
            $scope.buddies.push({
                name: 'Ziya',
                distance: 2500,
                area: 'Ehrenfeld'
            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
        console.log(request);
    })

    .controller('StatusCtrl', function ($scope, buddyList) {
        $scope.doRefresh = function() {
            $scope.buddies.push({
                name: 'Ziya',
                distance: 2500,
                area: 'Ehrenfeld'
            });
            $scope.$broadcast('scroll.refreshComplete');

        };
        $scope.buddies = buddyList.buddies;
    })

    .controller('SettingsCtrl', function ($scope, buddyList) {

    });
