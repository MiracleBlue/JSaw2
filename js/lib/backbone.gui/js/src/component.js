define([
  'jquery',
  'lodash',
  'backbone'
], function($, _, Backbone) {

  var Component = Backbone.View.extend({

    initialize: function(opts) {

      Backbone.View.prototype.initialize.apply(this, arguments);
      _.extend(this.options, opts);

      var self = this,
        model = self.model,
        prop = this.options.property;

      // update the slider position
      // when the model property changes
      if (model && prop) {
        model.on('change:' + prop, function(model, val) {
          self.setVal(val);
        });
      }

    },

    setElement: function() {
      var model = this.model;
      Backbone.View.prototype.setElement.apply(this, arguments);
      this.setVal(model? model.get(this.options.property): 0);
    },

    setVal: function() {
    },

    render: function() {
      this.setElement($(this.template));
      return this;
    }

  });

  return Component;

});