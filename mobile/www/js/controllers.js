angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('BuddyListCtrl', function ($scope, buddyList) {
        $scope.buddies = buddyList.buddies;
    })

    .controller('PlaylistCtrl', function ($scope) {
        $scope.ziya = 'ziya';

    })

    .controller('SearchCtrl', function ($scope, $stateParams, $location, pushSender, buddyList, phone, request, userName) {

        if(userName == null) {
            $scope.register = true;
            $location.path('/app/register');
        } else if(request == true) {
            $scope.register = false;
            if(request.regid == phone.specs.regid) {
                $scope.flag = "status";
                $scope.title = "Ready & Waiting";
            } else {
                $scope.flag = "respond";
                $scope.title = "Smokes Coming Your Way";
            }
        } else {
            $scope.flag = "push";
            $scope.title = "Send Out A Smoke";
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

        $scope.respond = function(e) {
            switch(e) {
                case 'yes':
                    $scope.flag = "push";
                    pushSender.respond({regid: request.regid, own_regid : phone.regid});
                    break;
                case 'no':
                    $scope.flag = "push";
                    break;
                case 'call':
                    $scope.flag = "push";
                    break;
                case 'text':
                    $scope.flag = "push";
                    break;
            }


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
