angular.module('propertycross.controllers', ['ionic'])

.controller('homeCtrl', function($scope, $rootScope, $state, $ionicLoading, Properties) {
	var ressearch = [
  {'place_name':"detroid",'title':'sdsfsaf'},
  {'place_name':"mariupol",'title':'Mariupol'},
  {'place_name':"new york",'title':'New York'}
  ];
  $scope.ressearches = ressearch;
  $scope.locations=[];
  var loading;
  $scope.errMsg='';
  $scope.showErr=false;
  var errorParse=function(err){
	$scope.showErr=true;
	if(typeof err==='string'){	
		$scope.errMsg=err;
	} else if (err instanceof Array) {
		$scope.errMsg='Please select a location below:';
		$scope.locations=err;	
	}
  };
  
  var go = ionic.debounce(function(text_search){
				loading=$ionicLoading.show({template:"Searching..."});
				Properties.search(text_search).then(function(res){
					$ionicLoading.hide();
					$state.go('results');	
				},function(err){
					errorParse(err);
					$ionicLoading.hide();
				});	
			},200);
   
  $scope.go = function(text_search){
		go(text_search);
  };
     
})

.controller('resCtrl',function($scope, $state, $ionicLoading, Properties){
	$scope.start=Properties.count();
	$scope.total=Properties.getTotal();
	$scope.properties=Properties.current();
})

.controller('propCtrl',function($scope,$rootScope,$stateParams,Faves){
		
})

.controller('favesCtrl',function($scope,$state,$rootScope,Faves){
	
	 	
})
;


