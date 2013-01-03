define([
  'jquery',
  'lodash',
  '../component'
], function($, _, Component) {

  var HorizontalSlider = Component.extend({

    options: {
      model: false,
      property: false,
      min: 0,
      max: 100,
      step: 0.01
    },

    tagName: 'input',

    attributes: {
      type: 'range'
    },

    change: function(e) {

      // calculate new value based on
      // el position, el offset, and mouse position
      var model = this.model,
        opts = this.options,
        new_val = parseFloat(this.$el.val()),
        normalized_val;

      if (new_val < opts.min) {
        normalized_val = opts.min;
      
      } else if (new_val > opts.max) {
        normalized_val = opts.max
      
      } else {
        normalized_val = new_val;
      }

      model.set(opts.property, normalized_val);
      e.preventDefault();

    },

    render: function($el) {

      this.$el.attr({
        min: this.options.min,
        max: this.options.max,
        step: this.options.step
      });

      return Component.prototype.render.apply(this, arguments);

    }

  });

  return HorizontalSlider;

});