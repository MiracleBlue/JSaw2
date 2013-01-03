define([
	'backbone',
	'core/sequencer/midinote',
	'core/sequencer/pattern'
], function (Backbone, MidiNote, Pattern) {

	var MidiNotes = Backbone.Collection.extend({
		model: MidiNote
	});

	var Point = Backbone.Model.extend({
		defaults:{
			row:   null,
			step:  null,
			active:null,
			note: null
		}
	});

	var Points = Backbone.Collection.extend({
		model:Point
	});

	var Sequencer = Backbone.Model.extend({

		defaults:{
			playing:false,
			steps:  16,
			step:   0,
			name: "Sequencer derp"
		},

		initialize:function (attrs, options) {

			var rows = this.rows = options.rows,
				scheduler = this.scheduler = options.scheduler,
				points = this.points = new Points(),
				notes = this.midiNotes = new MidiNotes(),
				steps = this.get('steps');
				//this.set("instrument", options.instrument);

			var self = this;

			this.on('change:playing', _.bind(this.changePlaying, this));
			this.on('change:step', _.bind(this.changeStep, this));

			rows.each(function (row) {
				for (var i = 0; i < steps; i++) {
					points.add({
						row: row,
						step:i
					});
				}
			});

			points.on("change:active", function(data) {
				console.log("DERP");
				console.log("model change:active, ", data);
				var active = data.get("active");

				if (active) {
					// Add a new note object to the midiNotes collection.
					console.log("notes", self.midiNotes.add({key: "A", row: data.get("row")}));
					console.log(self.midiNotes.last());
					data.set("note", self.midiNotes.last());
				}
				else {
					console.log("active state off");
					self.midiNotes.remove(data.get("note"));
					data.set("note", null);
				}

			});

			return Backbone.Model.prototype.initialize.apply(this, arguments);

		},

		rowAdded: function() {
			console.log("sequencer row added");
		},

		changePlaying:function (self, playing) {
			var self = this,
				steps = this.get('steps'),
				scheduler = this.scheduler;
			scheduler.play([], function () {
				var step = self.get('step'),
					reset = step == self.get('steps') - 1,
					next = reset ? 0 : step + 1;
				self.set('step', next);
			});
		},

		changeStep:function (self, step) {
			var self = this;
			var active = this.points.filter(function (point) {
				var is_active = point.get('active'),
					is_current_step = point.get('step') == step;
				return is_current_step && is_active;
			});
			_.each(active, function (point) {
				var row_name = point.get('row').get("name");
				self.trigger("noteOn", {key: row_name});

			});
		}

	});

	return Sequencer;

});