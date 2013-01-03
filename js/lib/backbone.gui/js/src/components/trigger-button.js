define([
  'lodash',
  'lib/backbone.gui/js/src/components/hold-button'
], function(_, HoldButton) {

  // options
  // `mode` (default: `hold`): `hold` for intantaneous or `trigger` for toggle
  // `action` (optional): a function, or string representing a model's action by key
  //                      triggered *when* true is set if `trigger`, and *while* true is set if `hold`
  // `property` (optional): a boolean property to set `true` or `false`
  // `label` (optional): label for the button

  var TriggerButton = HoldButton.extend({

    events: {
      'mousedown': 'click'
    },

    template: '<div class="bb-gui-component"><input type="button" class="button" /></div>',

    click: function(e) {

      var model = this.model,
        opts = this.options,
        prop = opts.property,
        action = opts.action,
        method,
        interval;

      // if there's a `property`
      // this button should set boolean for that property
      if (prop) {
        model.set(prop, !model.get(prop));

      // if there's an `action`
      // this button should also trigger a function
      } else if (action) {
        method = _.isFunction(action)? action: model[action];
        method();

      }

      e.preventDefault();

    }

  });

  return TriggerButton;

});