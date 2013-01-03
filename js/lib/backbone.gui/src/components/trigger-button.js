define([
  'lodash',
  '../components/hold-button'
], function(_, HoldButton) {

  // options
  // `mode` (default: `hold`): `hold` for intantaneous or `trigger` for toggle
  // `action` (optional): a function, or string representing a model's action by key
  //                      triggered *when* true is set if `trigger`, and *while* true is set if `hold`
  // `property` (optional): a boolean property to set `true` or `false`

  var TriggerButton = HoldButton.extend({

    onMousedown: function(e) {

      var self = this,
        model = this.model,
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
        self.onChange(model, true);
        $(window).one('mouseup.button', function() {
          self.onChange(model, false);
        });

      }

      e.preventDefault();

    }

  });

  return TriggerButton;

});