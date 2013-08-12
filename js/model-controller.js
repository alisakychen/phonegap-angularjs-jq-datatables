/* PhoneGap Ready
 * 
 * using an AngularJS promise to run script when PhoneGap is ready
 *
 * author: Andy Joslin (ajoslin), iterating on Brian Ford (bford)'s wrapper
 * source: https://github.com/btford/angular-phonegap-ready/issues/1
 */

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
  

// NOTE: use like this
// phonegapReady().then(function() {
//   doStuff();
// });

phonegapReady().then(function() {
  function TodoCtrl($scope) {
    $scope.todos = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];
   
    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
    };
   
    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
   
    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };
  }
});
