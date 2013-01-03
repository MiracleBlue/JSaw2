define([
  'lodash',
  'jquery',
  '../component'
], function(_, $, Component) {

  var Dropdown = Component.extend({

    options: {
      property: false,
      options: false,
      val: false
    },

    tagName: 'select',

    change: function(e) {
      var $selected = $(':selected', this.$el),
        new_val = $selected.data('val');
      this.model && this.model.set(this.options.property, new_val);
      this.trigger('change', new_val);
      e.preventDefault();
    },

    render: function($el) {

      var self = Component.prototype.render.apply(this, arguments),
        $el = this.$el,
        options = this.options.options,
        defaultVal = this.options.val,
        options_keys = _.keys(options);
		console.log(options);
      for (var i in options) {
        var option = options[i],
	        name = option,
          val = option,
          $option = $('<option />'),
          selected;
        $option
          .text(name)
          .val(name)
          .data('val', val)
          .appendTo($el);
        if (defaultVal
            && defaultVal instanceof(val)) {
          $option.prop('selected', true);
        }
      }

      return self;

    }

  });

  return Dropdown;

});