(function () {
"use strict";

angular.module("ionic-multiselect", [])
.filter('translateItem', ["$injector", function($injector) {
  return function(item, scope) {

    var filterTranslate;
    try{
        var filterTranslate = $injector.get('$filter');
        return filterTranslate('translate')(scope.indexTranslate + eval('item.' + scope.valueProperty));
    }catch(e){
      return "";
    }
  };
}])
//Filter that show data text
.filter('showTextData', ["$injector", function($injector) {
  return function(value, scope) {

    var filterTranslate;
    try{
        var filterTranslate = $injector.get('$filter');
    }catch(e){}

    var arr = [];
    if(value.indexOf("-") > -1){
      arr = value.split("-");
      arr = arr.filter(Boolean);
      var tot = arr.length;
      for(var i=0;i<tot;i++){
          if(scope.isTranslate){
            var valueAux = filterTranslate('translate')(scope.indexTranslate + arr[i].trim());
          }else{
            var valueAux = arr[i].trim();
          }
          arr[i] = valueAux;
      }
    }
    if(arr.length == 0){
      return "";
    }else{
      return arr;
    }
  };
}])
.directive("multiselect", ["$ionicModal", function($ionicModal) {
  return {
    restrict: "E",
    //Template con el item para mostrar el modal y los resultados
    template: function(element, attrs) {
      if (attrs.templateUrl) {
        return "<ng-include src=\"'" + attrs.templateUrl + "'\"></ng-include>";
      } else {
        return '';
      }
    },
    //Atributos
    scope: {
      items: "=", // Needs to have a value
      value: "=", // Needs to have a value
      valueChangedCallback: "&valueChanged", // The callback used to signal that the value has changed
      getCustomTextCallback: "&getCustomText" // The callback used to get custom text based on the selected value
    },
    //Conectado la directiva
    link: function(scope, element, attrs) {
      // Header usado en ion-header-bar
      scope.headerText = attrs.headerText || '';
      // Text displayed on label
      scope.text = attrs.text || '';
      scope.defaultText = attrs.text || '';
      // Data binding properties
      scope.checkedProperty = attrs.checkedProperty || "checked";
      scope.textProperty = attrs.textProperty || "text";
      scope.valueProperty = attrs.valueProperty || "id";
      //Translate properties
      scope.isTranslate = (attrs.isTranslate === "true") || false;
      scope.indexTranslate = attrs.indexTranslate || "";
      // The modal properties
      scope.modalTemplateUrl = attrs.modalTemplateUrl;
      scope.modalAnimation = attrs.modalAnimation;
      // Note properties
      scope.noteText = attrs.noteText || "";

      //Inicializa el modal con los items
      if (scope.modalTemplateUrl) {
        $ionicModal.fromTemplateUrl(
          scope.modalTemplateUrl,
          {
            scope: scope,
            animation: scope.modalAnimation
          }
        ).then(function(modal) {
          scope.modal = modal;
        });
      } else {
        scope.modal = $ionicModal.fromTemplate('',
          {
            scope: scope,
            animation: scope.modalAnimation
          }
        );
      }

      //Cierro el modal al destruir la pantalla
      scope.$on("$destroy", function() {
        scope.modal.remove();
      });

      //Obtiene el texto de la propiedad de un objeto
      scope.getItemText = function(item) {
        return scope.textProperty ? item[scope.textProperty] : item;
      };

      //Obtiene el valor de la propiedad de un objeto
      scope.getItemValue = function(item) {
        console.log(item[scope.valueProperty]);
        return scope.valueProperty ? item[scope.valueProperty] : item;
      };

      //Obtiene los items seleccionados
      scope.getText = function(value) {
        // Push the values into a temporary array so that they can be iterated through
        var temp = value ? value : [];

        var text = "";
        if (temp.length) {
          //Concatena los items
          angular.forEach(scope.items, function(item, key) {
            for (var i = 0; i < temp.length; i++) {
              if (scope.getItemValue(item) == temp[i]) {
                //if is translate
                if(scope.isTranslate){
                  text += (text.length ? "-" : "") + scope.getItemValue(item);
                }else{
                  text += (text.length ? "-" : "") + scope.getItemText(item);
                }
                break;
              }
            }
          });
        } else {
          // Pone el texto por default
          text = scope.defaultText;
        }

        // If a callback has been specified for the text
        return scope.getCustomTextCallback({value: value}) || text;
      };

      //Oculta el modal
      scope.hideItems = function(event) {
        scope.modal.hide();
      };

      //Raised by watch when the value changes
      scope.onValueChanged = function(newValue, oldValue) {
        scope.text = scope.getText(newValue);

        // Notify subscribers that the value has changed
        scope.valueChangedCallback({value: scope.text});
      };

      //Muestro el modal
      scope.showItems = function(event) {
        event.preventDefault(); // Prevent the event from bubbling
        scope.modal.show();
      };

      //Validates the current list
      scope.validate = function(item) {
        scope.value = [];
        if (scope.items) {
          angular.forEach(scope.items, function(item, key) {
            if (item[scope.checkedProperty]) {
              scope.value[key] = scope.getItemValue(item);
            }else{
              scope.value[key] = "";
            }
          });
        }
        scope.hideItems();
      };

      // Watch the value property, as this is used to build the text
      scope.$watch(function(){
        return scope.value;
      }, scope.onValueChanged, true);
    }
  };
}]);
}());
