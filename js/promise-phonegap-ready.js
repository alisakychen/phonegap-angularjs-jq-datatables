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