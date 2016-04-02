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

.factory('SearchLocation', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  
  var api={
	  county:"uk",
	  place_name:"glazgo",
	  url:"http://api.nestoria.co.uk/api?place_name="+this.place+"&country="+this.country
  };
  
  var search = [
  {'text':"detroid",'count':23,'id':2},
  {'text':"mariup",'count':3,'id':5},
  {'text':"new york",'count':33,'id':8}
  ];
  

  return {
    all: function() {
      return ressearch;
    },
    
	get: function($text){
	  
	  
	}
	
  };
});;
