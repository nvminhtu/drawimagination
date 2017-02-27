// App name: english
// template: Ionic Starter App
var app = angular.module('funnyEnglish', ['ionic','ngSanitize']);

// 01- Controller

// 01.1 - App Controller for manage all Controllers
app.controller("AppCtrl",function($scope, $ionicHistory) {
  
  // declare information for Application
  $scope.appName = "Funny Stories";
  $scope.appHome 	 = "Home";
  $scope.catBack    =  "Back";

  //GoBack Button
  $scope.GoBack = function() {
    $ionicHistory.goBack();
  };
});

// 01.2- Controller for Main View
app.controller("MainCtrl",function($scope, $stateParams, jokesCatService){
  jokesCatService.getCatJokes().then(function(jokecats){
    $scope.jokecats = jokecats;
  });
});

// 01.3- Controller for Category View
app.controller("CategoryCtrl",['$scope','$stateParams','jokesService','jokesCatService',function($scope, $stateParams, jokesService,jokesCatService){
  
  var index = $stateParams.index;
  $scope.param = index; 

  jokesService.getJokes().then(function(jokes){
    var availableJoke = [];
	for( var i=0; i< jokes.length; i++) {
      	if(jokes[i].cat_id==index)	{
      		availableJoke.push(jokes[i]);
      	}
    }
    $scope.jokes = availableJoke;

  });

  jokesCatService.getCatJokes().then(function(jokecats){
    $scope.jokecats = jokecats;
    $scope.isCat = function(jokecat){
    	return (jokecat.id == $scope.param);
    }
  });

}]);

// 01.4- Controller for Detail View
app.controller("DetailCtrl",function($scope,$stateParams, jokesService, jokesCatService){
  var index = $stateParams.index;
  var availableJoke = [],
  	  otherJokes = [],
  	  jokeCat = "";
  // assign varialbes - check limit
  // load related jokes in a category
  
  jokesService.getJokes().then(function(jokeNew){
    
    var length = jokeNew.length;
	  for( var i = 0; i< length; i++){
    	if( jokeNew[i].id == index ){
    		availableJoke.push(jokeNew[i]);
    		jokeCat = jokeNew[i].cat_id;
    	}
    }
    $scope.joke = availableJoke[0];
    $scope.content2 = availableJoke[0].content;
    var jokecatId = availableJoke[0].cat_id;

    // Others
    for( var i = 0; i< length; i++){
      	if( jokeNew[i].cat_id == jokeCat)	{
      		otherJokes.push(jokeNew[i]);
      	}
    }
    $scope.otherjokes = otherJokes;

    // Prev and Next
    var otherLength = otherJokes.length,
    	prevId = 1,
    	nextId = 1;

    for (var i = 0; i < otherLength ; i++){
    	if(otherLength > 0 ){
    		if(otherLength == 1) {
    			$scope.prevItem = otherJokes[i].id;
    			$scope.nextItem = otherJokes[i].id;
    		} else {
	    		if(otherJokes[i].id==index){
	    			if(i == 0) {
	    				prevId = otherJokes[otherLength-1].id;
	    				nextId = otherJokes[i+1].id;
	    			}
	    			else if(i == otherLength-1){
	    				prevId = otherJokes[i-1].id;
	    				nextId = otherJokes[0].id;
	    			} else {
	    				prevId = otherJokes[i-1].id;
	    				nextId = otherJokes[i+1].id;
	    			}
	    			
					//return next & prev
					$scope.prevItem = prevId;
					$scope.nextItem = nextId;
	    		}
    		}
    	}
    }
    
    //Get Cat Name
    jokesCatService.getCatJokes().then(function(jokecats){
      //$scope.jokecats = jokecats;
        var catName = "";
        for(i=0; i<jokecats.length; i++) {
          if(jokecats[i].id == jokecatId)  {
            catName = jokecats[i].title;
          }
        }
        $scope.catName = catName;
    });
  });

  $scope.goCats = false;


});

// 02- Config and Route
app.config(function($stateProvider ,$urlRouterProvider){
  $stateProvider

  .state('main', {
    url: "/main",
    templateUrl: "templates/main.html",
    controller: "MainCtrl"
  })

  .state('category', {
    url: "/category/:index",
    templateUrl: "templates/category.html",
    controller: "CategoryCtrl"
  })

  .state('detail', {
    url: "/detail/:index",
    templateUrl: "templates/detail.html",
    controller: "DetailCtrl"
  })

  .state('about', {
    url: "/about",
    templateUrl: "templates/about.html"
  });

  $urlRouterProvider.otherwise('/main');
});

// 03.1 - factory - jokesServices
app.factory('jokesService',function($http){
  var jokes = [],
  	  availableJoke = [];

    return {
      getJokes: function(){
        return $http.get('js/data/jokes.json').then(function(response){
          jokes = response.data.results;
          return jokes;
        });
      },
      getTest: function(){
        return $http.get('js/data/jokes.json').then(function(response){
          jokes = response.data.results;
          return jokes[0].content;
        });
      },
      getAvailableJokes: function(index){
        return $http.get('js/data/jokes.json').then(function(response){
          jokes = response.data.results;
          for( var i = 0; i < jokes.length; i++) {
          	if(jokes[i].id == index) {
          		availableJoke.push(jokes[i]);
          	}
          }
          return availableJoke[0];
        });
      },
      getJoke: function(index){
        //return availableJoke[0];
      }
    }
});

// 03.2 - factory - jokesCatServices
app.factory('jokesCatService',function($http){
  var jokes = [];
    return {
      getCatJokes: function(){
        return $http.get('js/data/jokescat.json').then(function(response){
          jokes = response.data.results;
          return jokes;
        });
      },
      getCat: function(index){
        return jokes[index];
      }
    }
});

// 03.3 - factory - filmService
app.factory('filmService',function($http){
  var films = [];
    return {
      getFilms: function(){
        return $http.get('js/data/users.json').then(function(response){
          films = response.data.results;
          return response.data.results;
        });
      },
      getFilm: function(index){
        return films[index];
      }
    }
});


// 09 - end
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
