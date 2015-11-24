var App = angular.module("MainApp", ["ionic", "ionic-multiselect"]);

App.controller("MainController", function($scope){

  $scope.data = [{id: 1, value: "Item 1"}, {id: 2, value: "Item 2"}, {id: 3, value: "Item 3"}];

  $scope.onValueChanged = function(value){
  	console.log(value);
  }
});
