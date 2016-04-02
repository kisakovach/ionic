angular.module('propertycross.controllers', ['ionic'])

.controller('homeCtrl', function($scope,RecientSearch) {
	
	$scope.ressearches=RecientSearch.all();
	
	$scope.go_faves=function(){
		
		console.log("go faves list view");
	};
	
	
});


