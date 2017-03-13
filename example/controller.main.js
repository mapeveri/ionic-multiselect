var App = angular.module("MainApp", ["ionic", "ionic-multiselect"]);

App.config(function(multiselectProvider) {
    multiselectProvider.setTemplateUrl('bower_components/ionic-multiselect/dist/templates/item-template.html');
    multiselectProvider.setModalTemplateUrl('bower_components/ionic-multiselect/dist/templates/modal-template.html');
});

App.controller("MainController", function($scope){

  $scope.data = [{id: 1, value: "Item 1"}, {id: 2, value: "Item 2"}, {id: 3, value: "Item 3"}];
  $scope.default=["Item 2"];
  $scope.onValueChanged = function(value){
  	console.log(value);
  }
});
