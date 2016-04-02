angular.module('propertycross.controllers', ['ionic'])

.controller('homeCtrl', function($scope, $state, RecientSearch) {
	$scope.search_text='';
	$scope.ressearches=RecientSearch.all();
	
	$scope.go_faves=function(){
		
		console.log("go faves list view");
	};
	
	$scope.go_res = function(){
		console.log($scope.search_text);
		$state.go('resuls',{text:$scope.search_text});
	}
	
})

.controller('resCtrl',function($scope, $stateParams,SearchLocation){
	
	$scope.res=SearchLocation($stateParams.text);
	console.log($scope.res);
	
})
;


