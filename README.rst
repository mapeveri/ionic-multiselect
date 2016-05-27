Ionic Multiselect
===================

Multiselect for Inonic Framework. Inspired by ionic-fancy-select and this snippet: http://codepen.io/mhartington/pen/CImqy?editors=101.

Install
-------

Via bower::

    bower install ionic-multiselect

Getting started
---------------

1. Add script js::

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js"></script>
    <script src="bower_components/ionic-multiselect/dist/ionic-multiselect.min.js"></script>

2. Add the module **ionic-multiselect** to module main::

    var App = angular.module("MainApp", ["ionic-multiselect"]);

3. Add to html this line::

    <multiselect
      header-text="Header"
      items="data"
      text-property="value"
      value-property="id"
      is-translate="true"
      index-translate="TAG_TRANSLATE"
      text="Text default multiselect"
      modal-template-url="bower_components/ionic-multiselect/templates/modal-template.html"
      template-url="bower_components/ionic-multiselect/templates/item-template.html"
      note-text="Note Text"
      value-changed="onValueChanged(value)">
    </multiselect>

4. Get value selected::

	//Your controller
	$scope.onValueChanged = function(value){
		//Value return a array objects with items selected
		console.log(value);
	}

Attributes
----------

1. header-text
	
	Type: String
	Used to specify the text that is shown in the Modal's header bar.

2. Items

	Type: Array
	A list of items that is bound to the select.

3- text-property

	Type: String
	Property description of item the array.

4. value-property

	Type: String
	Property id of item the array.

5. Is-Translate

	type: Boolean
	If used angular translate for item text.

6. Index-translate

	type: String
	If used angular-translate this is the tag for indicate el tag main for items. For example, if we need to show the categories used the tag 'CATEGORY_' and ionic-multiselect automatically search the following internally in the ng-repeat 'CATEGORY_1' 'CATEGORY_2', etc. Internally uses the value-property field.

7. text

	Type: String
	Value default multiselect.

8. modal-template-url

	Type: URL
	An optional URL that can be used to customise the look and feel of the Modal

9. template-url

	Type: URL
	An optional URL that can be used to custome the look and feel of fancy-select element.

10. note-text

	Type: String
	An optional note that can be displayed in the default multiselect element.

11. value-changed (Callback)

	Parameters: value - The currently selected value or list of values
	Raised when the current value changes.

Example
-------

Check the file `index`_.

.. _index: https://github.com/mapeveri/ionic-multiselect/blob/master/example/index.html
