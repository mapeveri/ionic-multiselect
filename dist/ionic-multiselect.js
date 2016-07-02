(function () {
"use strict";

angular.module("ionic-multiselect", [])
  .filter('translateItem', ["$injector", "$parse", function($injector, $parse) {
    /**
    * @name translateItem
    * @desc Translate value item modal in base to value_property
    * @param {Object} item: Object data item
    * @returns {String}
    */
    return function(item, scope) {

      var filterTranslate;
      try{
          var filterTranslate = $injector.get('$filter');
          //Parse item property of the object
          var parseFun = $parse('item.' + scope.valueProperty);
          var valueTranslate = parseFun(scope);
          return filterTranslate('translate')(scope.indexTranslate + valueTranslate);
      }catch(e){
        return "";
      }
    };
  }])
  .filter('showTextData', ["$injector", function($injector) {
    /**
    * @name showTextData
    * @desc Filter that show data text
    * @param {String} value: Value text show
    * @returns {Array}
    */
    return function(value, scope) {

      var filterTranslate;
      try{
          var filterTranslate = $injector.get('$filter');
      }catch(e){}

      var arr = [];
      if(value.indexOf("^") > -1){
        arr = value.split("^");
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
      }else{
        if(scope.isTranslate){
          arr.push(filterTranslate('translate')(scope.indexTranslate + value.trim()));
        }else{
          arr.push(value);
        }
      }

      if(arr.length == 0){
        return "";
      }else{
        return arr;
      }
    };
  }])
  /**
  * @desc Multiselect for Ionic Framework
  * @example
  *   <multiselect
  *      header-text="Header"
  *      items="data"
  *      text-property="value"
  *      value-property="id"
  *      is-translate="true"
  *      index-translate="TAG_TRANSLATE"
  *      text="Text default multiselect"
  *      modal-template-url="bower_components/ionic-multiselect/templates/modal-template.html"
  *      template-url="bower_components/ionic-multiselect/templates/item-template.html"
  *      note-text="Note Text"
  *      value-changed="onValueChanged(value)">
  *   </multiselect>
  */
  .directive("multiselect", ["$ionicModal", function($ionicModal) {
    return {
      restrict: "E",
      //Template with item for show modal
      template: function(element, attrs) {
        if (attrs.templateUrl) {
          return "<ng-include src=\"'" + attrs.templateUrl + "'\"></ng-include>";
        } else {
          return '';
        }
      },
      //Attributes
      scope: {
        items: "=", // Needs to have a values
        valueChangedCallback: "&valueChanged", // The callback used to signal that the value has changed
        getCustomTextCallback: "&getCustomText" // The callback used to get custom text based on the selected value
      },
      //Conected directive
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

        //Init modal with the items
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

        //Remove modal
        scope.$on("$destroy", function() {
          scope.modal.remove();
        });

        /**
        * @name getItemText
        * @desc Get text property of objeto
        * @param {Object} item: Object data item
        * @returns {String}
        */
        scope.getItemText = function(item) {
          return scope.textProperty ? item[scope.textProperty] : item;
        };

        /**
        * @name getItemValue
        * @desc Get value property of objet
        * @param {Object} item: Object data item
        * @returns {String}
        */
        scope.getItemValue = function(item) {
          return scope.valueProperty ? item[scope.valueProperty] : item;
        };

        /**
        * @name getText
        * @desc Get items selected
        * @param {Array} value: Array with values showed in modal
        * @returns {String}
        */
        scope.getText = function(value) {
          // Push the values into a temporary array so that they can be iterated through
          var temp = value ? value : [];

          var text = "";
          if (temp.length) {
            //Concatenate the items
            angular.forEach(scope.items, function(item, key) {
              for (var i = 0; i < temp.length; i++) {
                if (scope.getItemValue(item) == temp[i]) {
                  //if is translate
                  if(scope.isTranslate){
                    text += (text.length ? "^" : "") + scope.getItemValue(item);
                  }else{
                    text += (text.length ? "^" : "") + scope.getItemText(item);
                  }
                  break;
                }
              }
            });
          }else{
            //Text default (When is translate)
            text = scope.defaultText;
          }

          //Text default when not select nothing and not is translate
          if (!text.length && !scope.isTranslate) {
            text = scope.defaultText;
          }

          //Check if empty
          if(scope.isTranslate){
            if(text.trim() == ""){
              text = "^";
            }
          }

          // If a callback has been specified for the text
          return scope.getCustomTextCallback({value: value}) || text;
        };

        /**
        * @name hideItems
        * @desc Hide modal
        * @param {Object} event: Event js
        */
        scope.hideItems = function(event) {
          scope.modal.hide();
        };

        /**
        * @name onCheckValueChanged
        * @desc Raised by watch when the check value changes
        * @param {Object} newValue: New value object
        * @param {Object} oldValue: Old value object
        */
        scope.onCheckValueChanged = function(newValue, oldValue) {
          if(typeof(newValue) !== "undefined"){
            // Notify subscribers that the value has changed
            scope.valueChangedCallback({value: newValue});
          }
        };

        /**
        * @name onValueChanged
        * @desc Raised by watch when the value changes
        * @param {Object} newValue: New value object
        * @param {Object} oldValue: Old value object
        */
        scope.onValueChanged = function(newValue, oldValue) {
          scope.text = scope.getText(newValue);
        };

        /**
        * @name showItems
        * @desc Show modal
        * @param {Object} event: Event js
        */
        scope.showItems = function(event) {
          event.preventDefault(); // Prevent the event from bubbling
          scope.modal.show();
        };

        /**
        * @name validate
        * @desc Validates the current list
        * @param {Object} item: Object data item
        */
        scope.validate = function(item) {
          scope.value = [];
          if (scope.items) {
            var arrChecked = [];
            angular.forEach(scope.items, function(item, key) {
              if (item[scope.checkedProperty]) {
                scope.value[key] = scope.getItemValue(item);
                arrChecked.push(item);
              }else{
                scope.value[key] = "";
              }
            });

            scope.itemChecked = arrChecked;
          }
          scope.hideItems();
        };

        // Watch itemChecked property
        scope.$watch(function(){
          return scope.itemChecked;
        }, scope.onCheckValueChanged, true);

        scope.$watch(function(){
          return scope.value;
        }, scope.onValueChanged, true);
      }
    };
  }]);
}());
