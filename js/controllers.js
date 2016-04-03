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
			$rootScope.searchText=text;
			$state.go('results');	
		},function(error){
				console.log(error);
		});
		
	}
	
})

.controller('resCtrl',function($scope, $rootScope, $stateParams, $ionicLoading, SearchLocation){
	$scope.show = function() {
		$ionicLoading.show({
		  template: 'Loading...'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	
	var p=1;
	$scope.start=5*p;
	$scope.next=function(){
		p++;
		SearchLocation.search($rootScope.searchText,p)
		.then(function(res){
			$scope.properties=res.listings;
			$rootScope.currentResult=res;
			$scope.start=p*5;
				
		});	
	} 
	
	$scope.properties=$rootScope.currentResult.listings;
	$scope.total=$rootScope.currentResult.total_results;
})

.controller('propCtrl',function($scope,$rootScope,$stateParams,Faves){
	$scope.property={};
	var temp=$rootScope.currentResult.listings.filter(function(el){
		if(el.guid==$stateParams.guid){
			return true
		};
	});
	$scope.property=temp[0];
	$scope.add_faves = function (){
		Faves.add($scope.property);
	}
})

.controller('favesCtrl',function($scope,$rootScope){
	
	
})
;


