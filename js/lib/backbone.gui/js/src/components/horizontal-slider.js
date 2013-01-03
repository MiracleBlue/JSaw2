define([
  'lib/backbone.gui/js/src/components/vertical-slider'
], function(VerticalSlider) {

  var HorizontalSlider = VerticalSlider.extend({

    template: '<div class="bb-gui-component">' +
    '<div class="horizontal slider">' +
      '<div class="track-outer">' +
        '<div class="track-inner">' +
          '<div class="grip"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>',

    setVal: function(val) {

      var width_range = 100,
        val_range = this.options.max - this.options.min,
        ratio = (val - this.options.min) / val_range,
        width = width_range * ratio;

      this.$track.width(width + '%');

    },

    onSlide: function(e) {

      // calculate new value based on
      // el position, el offset, and mouse position
      var model = this.model,
        opts = this.options,
        $el = this.$el,
        width = $el.width(),                    // width of el
        left = $el.offset().left,               // left px of el
        rel_x_px = e.clientX - left,            // px from left user clicked
        rel_x = (rel_x_px / width),             // % from bottom user clicked
        range_x = opts.max - opts.min,          // total range of values
        new_val = opts.min + (range_x * rel_x), // the new value
        normalized_val;

      if (new_val < opts.min) {
        normalized_val = opts.min;
      
      } else if (new_val > opts.max) {
        normalized_val = opts.max
      
      } else {
        normalized_val = new_val;
      }

      model.set(opts.property, normalized_val);

    }

  });

  return HorizontalSlider;

});