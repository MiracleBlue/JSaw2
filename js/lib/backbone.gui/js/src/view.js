define([
  'jquery',
  'lodash',
  'backbone',
  'lib/backbone.gui/js/src/components/text-input',
  'lib/backbone.gui/js/src/components/horizontal-slider',
  'lib/backbone.gui/js/src/components/trigger-button'
], function($, _, Backbone, TextInput, HorizontalSlider, TriggerButton) {

  var View = Backbone.View.extend({

    template: '<div class="bb-gui"></div>',
    row_template: '<div class="row"><% if (key) { %><span class="label"><%= key %></span><% } %></div>',

    initialize: function(opts) {
      this.gui = opts.gui;
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        
      var model = this.model,
        $el = $(this.template),
        user_opts = _.extend({}, model.params, this.params),
        row_template = _.template(this.row_template);

      // create a component for each attribute
      // of the model
      _.each(model.attributes, function(attr, key) {

        var type = typeof(attr),
          cur_opts = user_opts[key],
          cur_opts_advanced = !_.isString(cur_opts),
          opts = _.extend({ model: model, property: key }, cur_opts_advanced? cur_opts: {}),
          component,
          $row,
          view;

        // pass in `component` option to 
        // bypass component inference
        if (!cur_opts_advanced || opts.component) {

          // options is a hash of options
          // who defines a `component`
          if (cur_opts_advanced) {
            component = opts.component;

          // options is a string, simply defining component
          } else {
            component = cur_opts;
          }

        // if no `component` was declared in this.gui
        // infer component from type
        } else {
          switch (type) {
            case 'string':
              component = TextInput;
              break;
            case 'number':
              component = HorizontalSlider;
              break;
            case 'boolean':
              component = TriggerButton;
              break;
          }
        }

        // set this.gui[key] to `null`
        // to not render the component
        if (user_opts[key] !== null && component) {
          needs_label = ['HoldButton', 'TriggerButton'].indexOf(component) == -1
          $row = $(row_template({ key: needs_label? key: false }))
          view = new component(opts);
          $row.append(view.render().el);
          $el.append($row);
        } 

      });
      
      this.setElement($el);
      return this;

    }

  });

  return View;

});