define([
	'jquery',
	'lodash',
  'lib/backbone.gui/js/src/component'
], function($, _, Component) {

	var VerticalSlider = Component.extend({

	  options: {
	    property: false,
	    min: 0,
	    max: 100
	  },

	  events: {
	    'mousedown .grip': 'startSlide'
	  },

	  template: '<div class="bb-gui-component">' +
		'<div class="vertical slider">' +
			'<div class="track-outer">' +
			  '<div class="track-inner">' +
			    '<div class="grip"></div>' +
			  '</div>' +
			'</div>' +
		'</div>' +
	  '</div>',

	  setVal: function(val) {

	    var height_range = 100,
	      val_range = this.options.max - this.options.min,
	      ratio = (val - this.options.min) / val_range,
	      height = height_range * ratio;

	    this.$track.height(height + '%');

	  },

	  startSlide: function(e) {
	    $(window).on('mousemove.slider', _.bind(this.onSlide, this));
	    $(window).one('mouseup',this.stopSlide);
	  },

	  stopSlide: function() {
	    $(window).off('mousemove.slider');
	  },

	  onSlide: function(e) {

	    // calculate new value based on
	    // el position, el offset, and mouse position
	    var model = this.model,
	      opts = this.options,
	      $el = this.$el,
	      height = $el.height(),                  // height of el
	      top = $el.offset().top,                 // top px of el
	      bottom = top + height,                  // bottom px of el
	      rel_y_px = bottom - e.clientY,          // px from bottom user clicked
	      rel_y = (rel_y_px / height),            // % from bottom user clicked
	      range_y = opts.max - opts.min,          // total range of values
	      new_val = opts.min + (range_y * rel_y), // the new value
	      normalized_val;

	    if (new_val < opts.min) {
	      normalized_val = opts.min;
	    
	    } else if (new_val > opts.max) {
	      normalized_val = opts.max
	    
	    } else {
	      normalized_val = new_val;
	    }

	    model.set(opts.property, normalized_val);

	  },

	  setElement: function($el) {
	    this.$track = $('.track-inner', $el);
	    Component.prototype.setElement.apply(this, arguments);
	  }

	});

	return VerticalSlider;

});