define([
	'lodash',
  '../component'
], function(_, Component) {

	var RadioButtons = Component.extend({

	  options: {
	    property: false,
	    options: false
	  },

	  events: {
	    'click input': 'changeInput'
	  },

	  template: '<div class="bb-gui-component"><form class="radio"></form></div>',

	  setVal: function(val) {
	    this.$inputs.val([val]);
	  },

	  changeInput: function(e) {
	    var val = this.$inputs.filter(':checked').val();
	    this.model.set(this.options.property, val);
	  },

	  setElement: function($el) {
	    this.$inputs = $('input', $el);
	    Component.prototype.setElement.apply(this, arguments);
	  },

	  render: function() {

	    var $el = $(this.template),
	      prop = this.options.property,
	      cid = this.cid,
	      $form = $('form', $el);

	    _.each(this.options.options, function(opt) {
	      $form.append('<div class="input"><input type="radio" name="' + cid + '-' + prop + '" value="' + opt + '" /><span>' + opt + '</span></div>');
	    });

	    this.setElement($el);
	    return this;

	  }

	});

	return RadioButtons;

});