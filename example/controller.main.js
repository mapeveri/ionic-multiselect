var App = angular.module("MainApp", ["ionic-rating-stars"]);

App.controller("MainController", function($scope){

  $scope.rating = 3;
  $scope.max_stars = 5;

  $scope.getValue = function(){
    console.log($scope.rating);
  }
});
