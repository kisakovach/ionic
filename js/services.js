angular.module('propertycross.services', ['ngResource'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('Faves',function($localstorage){
	
	var Faves=[];
	return {
		add: function(item){
			Faves=$localstorage.getObject('faves');
			if(Faves.length===undefined)Faves=[];
			Faves.push(item);
			$localstorage.setObject('faves',Faves);
		},
		remove: function(guid){
			Faves=$localstorage.getObject('faves');
			Faves=Faves.filter(function(el){
				if(el.guid==guid){
					return false;
				};
				return true;
			});
			$localstorage.setObject('faves',Faves);
		},
		list: function(){
			
			return $localstorage.getObject('faves');
		}
		
	}
})

.factory('RecientSearch', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var ressearch = [
  {'text':"detroid",'count':23,'id':2},
  {'text':"mariup",'count':3,'id':5},
  {'text':"new york",'count':33,'id':8}
  ];

  return {
    all: function() {
      return ressearch;
    }
     
  };
})

.factory('SearchLocation', function($resource,$q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  
  var api=$resource("http://api.nestoria.co.uk/api",
	  { country :'uk',
        pretty: '1',
        action: 'search_listings',
        encoding: 'json',
        listing_type: 'buy',
		'number_of_results':'5',
		callback: 'JSON_CALLBACK'	
		},{'search':{method:"JSONP",headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
			'Access-Control-Allow-Origin':'http://api.nestoria.co.uk'
            }}});
  var successCodes=['100','101','110'];
  var ambigCodes=['200','202'];
  
  return {
    all: function() {
      //return ressearch;
    },
	search: function(text,p=''){
	   if(p=='')p=1;
	   var q=$q.defer();
	   api.search({'place_name':text,'page':p}, function(res){ 
		   if(successCodes.indexOf(res.response.application_response_code)!=-1){
			   if(res.response.listings.length>0){
				q.resolve(res.response);
			   } else {
				   q.reject('There were no properties found for the given location.');
			   }
		   } else if(ambigCodes.indexOf(res.response.application_response_code)!=-1){
			   q.reject(res.response);
		   } else {
			   q.reject(res.response);
		   }
	   }, function(error){
		   q.reject('An error occurred while searching. Please check your network connection and try again.');   
	   });
	   return q.promise;
	},	
  };
});;
