angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('BuddyListCtrl', function ($scope, buddyList) {
        $scope.buddies = buddyList.buddies;
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {

    })

    .controller('SearchCtrl', function ($scope, $stateParams, $location, pushSender, buddyList, phone, request, userName) {
        /*if (localStorage.getItem('pushStatus') === 'sent') {
            //$location.path('/app/status');
            $scope.list = true;
            $scope.flag = false;
        }*/
        if(userName == null) {
            $scope.register = true;
            $location.path('/app/register');
        } else {
            $scope.register = false;
            if(request.regid == phone.specs.regid) {
                $scope.flag = "status";
            } else {
                $scope.flag = "push";
            }
        }


        $scope.send = function() {
            pushSender.Send({regid: phone.specs.regid ,gps: phone.specs.regid});
            //localStorage.setItem('pushStatus', 'sent');
            //$location.path('/app/status');
            $scope.flag = "status";
        };
        $scope.buddies = pushSender.status();
        $scope.doRefresh = function() {
            $scope.buddies = pushSender.status();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
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

    })

    .controller('RegisterCtrl', function ($scope, $location, buddyList) {
        $scope.register = function() {
            localStorage.setItem('userName', $scope.userName);
            $location.path('/app/search');
        }
    });
