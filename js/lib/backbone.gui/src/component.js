define([
  'jquery',
  'lodash',
  'backbone'
], function($, _, Backbone) {

  var Component = Backbone.View.extend(_.extend({

    events: {
      'change': 'change'
    },

    initialize: function(opts) {
      Backbone.View.prototype.initialize.apply(this, arguments);
      _.extend(this.options, opts);
      this.model && this.model.on('change:' + this.options.property, _.bind(this.onChange, this));
    },

    change: function(e) {
      var new_val = this.$el.val();
      this.model && this.model.set(this.options.property, new_val);
      this.trigger('change', new_val);
      e.preventDefault();
    },

    onChange: function(model, val) {
      this.$el.val(val);
    },

    render: function() {
      var self = Backbone.View.prototype.render.apply(this, arguments),
        model = this.model,
        val = model? model.get(this.options.property): null;
      self.onChange(model, val);
      return self;
    }

  }, Backbone.Events));

  return Component;

});