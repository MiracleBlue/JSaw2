define([
  'lodash',
  'lib/backbone.gui/js/src/component',
  'lib/backbone.gui/js/src/components/radio-buttons'
], function(_, Component, RadioButtons) {

  var Dropdown = RadioButtons.extend({

    options: {
      property: false,
      options: false
    },

    events: {
      'change select': 'changeInput'
    },

    template: '<div class="bb-gui-component"><form class="dropdown"><select></select></form></div>',

    changeInput: function(e) {
      var val = this.$inputs.val();
      this.model.set(this.options.property, val);
    },

    setElement: function($el) {
      this.$inputs = $('select', $el);
      Component.prototype.setElement.apply(this, arguments);
    },

    render: function() {

      var $el = $(this.template),
        prop = this.options.property,
        input_name = this,
        $select = $('select', $el);

      _.each(this.options.options, function(opt) {
        $select.append('<option value="' + opt + '">' + opt + '</option>');
      });

      this.setElement($el);
      return this;

    }

  });

  return Dropdown;

});