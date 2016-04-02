angular.module('propertycross.controllers', ['ionic'])

.controller('homeCtrl', function($scope, $rootScope, $state, RecientSearch, SearchLocation) {
	$rootScope.currentResult = {};
	$scope.search='';
	$scope.ressearches=RecientSearch.all();
	$scope.go_faves=function(){
		console.log("go faves list view");
	};
	
	$scope.go_res = function(text){
		//console.log($scope.search.text);
		SearchLocation.search(text).then(function(res){
			$rootScope.currentResult=res;
			$state.go('results');	
		},function(error){
				console.log(error);
		});
		
	}
	
})

.controller('resCtrl',function($scope, $rootScope, $stateParams){
	
	$scope.properties=$rootScope.currentResult;
});


