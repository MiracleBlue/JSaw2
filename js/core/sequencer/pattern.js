define([
	'backbone',
	'lodash',
	'core/sequencer/midinote',
	'core/sequencer/sequencer'
], function(Backbone, _, MidiNote, Sequencer) {

	var MidiNotes = Backbone.Collection.extend({
		model: MidiNote
	});

	var Pattern = Backbone.Model.extend({
		defaults: {
		    name: "Pattern derp",
			duration: 1,
			position: 0,
			row: null,
		    sequencer: null
		},

		initialize: function(attrs, options) {
			var self = this;
			console.log("Pattern initialize");

			this.get("sequencer").on("noteOn", function(data) {
				var active_instrument = self.get("row").instrument;

				console.log("sequencer fired noteOn", data, active_instrument);

				active_instrument.playNotes([
					data
				]);
			});


			return Backbone.Model.prototype.initialize.apply(this, arguments);
		}
	});

	return Pattern;

}); // Derp