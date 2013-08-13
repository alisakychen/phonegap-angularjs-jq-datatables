angular.module('btford.phonegap.ready', []).
  factory('phonegapReady', function ($rootScope, $q) {
    var loadingDeferred = $q.defer();
    document.addEventListener('deviceready', function() {
      $rootScope.$apply(loadingDeferred.resolve);
    });
    return function phonegapReady() {
      return loadingDeferred.promise;
    };
  });

phonegapReady().then(function() {
  var app = angular.module('hello-grid-app', ['ngGrid']);
  app.controller('MyCtrl', function($scope) {
      $scope.myData = [{name: "Moroni", age: 50},
                       {name: "Tiancum", age: 43},
                       {name: "Jacob", age: 27},
                       {name: "Nephi", age: 29},
                       {name: "Enos", age: 34}];
      $scope.gridOptions = { data: 'myData' };
  });
});
