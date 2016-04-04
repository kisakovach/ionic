angular.module('propertycross.controllers', ['ionic'])

.controller('homeCtrl', function($scope, $rootScope, $state, $ionicLoading, Properties,RecentSearches) {
	var ressearch = [
					  {'place_name':"detroid",'title':'sdsfsaf'},
					  {'place_name':"mariupol",'title':'Mariupol'},
					  {'place_name':"new york",'title':'New York'}
					];
	RecentSearches.get().then(function(res){
		$scope.ressearches =res;
	});
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
  
  $scope.go_faves=function(){
		$state.go('faves');
  }  
})

.controller('resCtrl',function($scope, $state, $ionicLoading, Properties){
	$scope.start=Properties.count();
	$scope.total=Properties.getTotal();
	$scope.properties=Properties.current();
	$scope.go_faves=function(){
		$state.go('faves');
	}
})

.controller('propCtrl',function($scope,$ionicLoading,$stateParams,Faves,Properties){
	$scope.property=Faves.get($stateParams.guid);
	if(!$scope.property){
		$scope.property=Properties.get($stateParams.guid);
	} else { $scope.fave='fave'; };
	
	$scope.add_faves = function(){	
		if(Faves.check($scope.property)){
			Faves.remove($scope.property);
			$scope.fave='';
		} else {
				Faves.add($scope.property)
				$scope.fave='fave';
		};
	};
	
})

.controller('favesCtrl',function($scope,Faves){
		
	 	Faves.load().then(function(properties){
			$scope.properties=properties;	
		});		
})
;


