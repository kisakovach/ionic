// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('propertycross', ['ionic','propertycross.controllers','propertycross.services'])

.run(function($ionicPlatform,$ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	$ionicPlatform.onHardwareBackButton(function(){
		$ionicHistory.backView();
	})
	
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
	controller:'homeCtrl'
  })
  .state('results',{
	  url:'/results',
	  templateUrl: 'templates/results.html',
	  controller:'resCtrl'
	  
  })
  .state('property',{
	  url:'/property/:guid',
	  templateUrl: 'templates/property.html',
	  controller:'propCtrl'
	  
  })
  .state('faves',{
	  url:'/faves',
	  templateUrl: 'templates/faves.html',
	  controller:'favesCtrl'
	  
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
});
;
