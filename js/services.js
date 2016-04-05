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
      return JSON.parse($window.localStorage[key]||'[]');
    }
  }
}])

.factory('Geolocation',function($q){
	var get = function(){
				var q=$q.defer();
				navigator.geolocation.getCurrentPosition(function(pos){
					q.resolve(pos);
					console.log(pos);
				},function(err){
					q.reject(err);
					console.log(err);
				});
				return q.promise;
			 };
	return {
		
		get:function(){
			return get();
		}
	}
})

.factory('Faves',function($localstorage,$q){
	var faves=[];
	
	function save(){
		try{
			$localstorage.setObject('faves',faves);
		} catch(e){
			console.log('error save to faves')
		}
	}
		
	return {
		load: function(){
			var q=$q.defer();
			if(!faves||!faves.length)faves=$localstorage.getObject('faves');
			q.resolve(faves);
			return q.promise;	
		},
		add: function(item){
			if(faves.indexOf(item)==-1){
				faves.push(item);
				save();
			}	
		},
		remove: function(item){
			var i=faves.indexOf(item);
			if(i==-1) return i;
			faves.splice(i,1);
			save();
			return faves;
		},
		list: function(){
			return Faves;
		},
		check: function(item){
			return faves.indexOf(item)!=-1;
		},
		get:function(guid){
			var res=null;
			faves.forEach(function(el){
				if(el.guid==guid)res=el;
			});
			return res;
		}	
	}
})

.factory('Nest_api',function($q,$resource,RecentSearches){
	
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
	search: function(text,p){
	   var q=$q.defer();
	   api.search({'place_name':text,'page':p}, function(res){ 
		   if(successCodes.indexOf(res.response.application_response_code)!=-1){
			   if(res.response.listings.length>0){
				q.resolve(res.response);
				RecentSearches.add({place:text,total:res.response.total_results});
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
	searchByCords: function(point,p){
		if(p=='')p=1;
		var q=$q.defer();
		api.search({'centre_point':point,'page':1}, function(res){ 
		   if(successCodes.indexOf(res.response.application_response_code)!=-1){
			   if(res.response.listings.length>0){
				q.resolve(res.response);
				RecentSearches.add({place:text,total:res.response.total_results});
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
	}		
}
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
				guid:item.guid,
				price:price(item.price_formatted),
				img_url:item.img_url,
				thumb_url:item.thumb_url,
				title:filterTitle(item.title),
				rooms:item.bedroom_number+ ' bed, '+item.bathroom_number+' bathrooms',
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
	
	
	var searchLocation = function(point,p){
		var q=$q.defer();
		Nest_api.searchByCords(point,p).then(function(res){
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
	
	var getByGuid = function(guid){
		var property=null;
		q=$q.defer();
		properties.forEach(function(item){
			if(item.guid===guid){
				property=item;	
			};
		});
		if(property)q.resolve(property); else q.reject("error no suchproperty");
		return q.promise;
	};
	
	
	return {
		
		search:function(text,p){
			console.log(text);
			properties=[];
			return search(text,1);
			
		},
		searchLocation:function(point){
			properties=[];
			return searchLocation(point,1);
		},
		get:function(guid){
			var property=null;
			properties.forEach(function(item){
				if(item.guid==guid){
					property=item;
				}
			});
			return property
		},
		current: function(){
			return properties;
		},
		getTotal:function (){
			
			return lastRes.total_results;
		},
		count:function(){
			return properties.length;
		},
		more: function(){
			var q=$q.defer();
			search(last,page+1).then(function(res){
				properties.concat(res);
				page++;
				q.resolve(properties);
			},function(err){
				q.reject(err);
			});
			return q.promise;
			
		}	
	}
})

.factory("RecentSearches",function($q,$localstorage){
	var searches=[];
	function save(){
		try{
			if(searches.length)	
				$localstorage.setObject("searches",searches);
		}catch(e){
			
			console.log("Error save recent searches!!");
		}
	}
	
	return {
		add: function(item){
			if(!item) return;
			i=-1;
			searches.forEach(function(el,key){
				if(item.place==el.place)i=key;
			});
			if(i!=-1){
				searches.splice(i, 1);
			};
			searches.unshift(item);
			if (searches.length > 5) {
                searches.length = 5;
            }
            save();
            return searches;
		},
		get:function(){
			var q=$q.defer();
			searches=$localstorage.getObject('searches');
			q.resolve(searches);
			return q.promise;
		}
		
	}
	
})
;

