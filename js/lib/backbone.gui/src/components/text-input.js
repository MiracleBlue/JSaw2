define([
	'jquery',
  '../component'
], function($, Component) {

	var TextInput = Component.extend({

	  options: {
	    property: false
	  },

    tagName: 'input',
    
    attributes: {
      type: 'text'
    }

	});

	return TextInput;

});