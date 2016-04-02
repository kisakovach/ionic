angular.module('propertycross.services', ['ngResource'])

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

.factory('SearchLocation', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  
  var api=$resource("http://api.nestoria.co.uk/api",
	  { 'country':'uk',
		 'listing_type':'buy',
		 'pretty':1,
		 'action':'search_listing',
		 'encoding':'json',
		 'page':1,
		 'place_name':'london' 
  },{'search':{method:"JSNOP"}});
  var successCodes=['101','102','103','104']
  var search = [
  {'text':"detroid",'count':23,'id':2},
  {'text':"mariup",'count':3,'id':5},
  {'text':"new york",'count':33,'id':8}
  ];
  

  return {
    all: function() {
      //return ressearch;
    },
    
	get: function($text){
	  return api.search({'place_name':$text});
	}
	
  };
});;
