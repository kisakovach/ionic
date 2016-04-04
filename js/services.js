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
		},
		check: function(guid){
			var res=false;
			var temp=$localstorage.getObject('faves');
			if(temp.length>0){
				temp.forEach(function(item){
					if(item.guid==guid){
						res=true;
					}
				});
				
			};
			return res
		}	
	}
})

.factory('Nest_api',function($q,$resource){
	
  var api=$resource("http://api.nestoria.co.uk/api",
	  { country :'uk',
        pretty: '1',
        action: 'search_listings',
        encoding: 'json',
        listing_type: 'buy',
		callback: 'JSON_CALLBACK'	
		},{'search':{method:"JSONP",headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
			'Access-Control-Allow-Origin':'http://api.nestoria.co.uk'
            }}});
  var successCodes=['100','101','110'];
  var ambigCodes=['200','202'];
  
  return {
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
			   q.reject(res.response.locations.map(function(item){
				   return {place_name:item.place_name, title:item.title};
			   }));
		   } else {
			   q.reject(res.response);
		   }
	   }, function(error){
		   q.reject('An error occurred while searching. Please check your network connection and try again.');   
	   });
	   return q.promise;
	},
	searchByCords: function(){
		
	}	
  };
})

.factory('Properties', function($q, Nest_api){
	var properties=[];
	var page=1;
	var last="";
	var lastRes;
	var locations=[];
	var getProperties = function(listings){
		
		function price(price){
			var f_price = price.split(' ');
			return '£ '+f_price[0];	
		};
		
		function filterTitle(title){
			var f_title=title.split(', ');
			f_title.length=2;
			return f_title.join(', ');
		};
		
		return listings.map(function(item){
			
			return {
				giud:item.guid,
				price:price(item.price_formatted),
				img_url:item.url,
				thumb_url:item.thumb_url,
				title:filterTitle(item.title),
				rooms:item.bedroom_num+ ' bed, '+item.bathroom_num+' bathrooms',
				summary:item.summary	
			}
		});
	};
	
	var search = function(text,p){
		var q=$q.defer();
		Nest_api.search(text,p).then(function(res){
		    var resProperties=getProperties(res.listings);
			if(!resProperties.length){
				q.rject("There were no properties found for "+text);
				return;
			}
			if(text!==last){
				properties=resProperties;
			}
			else {
				properties=properties.concat(resProperties);
			};
			last=text;
			lastRes=res	
			q.resolve(properties);
		},function(error){
			q.reject(error);	
		});
		return q.promise
	};
	
	var searchLocation = function(text){
		
		
	};
	
	var getByGuid = function(guid){
		
		
	};
	
	
	return {
		
		search:function(text){
			console.log(text);
			properties=[];
			return search(text,1);
			
		},
		searchLocation:function(){
			
		},
		get:function(guid){
			
		},
		current: function(){
			return properties;
		},
		getTotal:function (){
			
			return lastRes.total_results;
		},
		count:function(){
			return properties.length;
		}	
	}
});

