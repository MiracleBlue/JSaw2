define([
	'backbone',
	'core/sequencer/midinote',
	'core/sequencer/pattern',
	'core/sequencer/sequencer'
], function (Backbone, MidiNote, Pattern, Sequencer) {

	// Rows for the sequencer
	var Key = Backbone.Model.extend({

		defaults:{
			name:null
		},

		initialize:function () {
			this.on('noteOn', _.bind(this.noteOn, this));
			return Backbone.Model.prototype.initialize.apply(this, arguments);
		},

		// for now just to demo pianoroll,
		// each key just controls each instrument in the arrangement.
		// really, it should only control one specific instrument at a time.
		noteOn:    function (self) {
			var self = this;
		}

	});

	// Collection of rows for sequencer
	var Keys = Backbone.Collection.extend({
		model:Key
	});

	var MidiNotes = Backbone.Collection.extend({
		model: MidiNote
	});

	var PatternSequencers = Backbone.Collection.extend({
		model: Pattern
	});

	var Point = Backbone.Model.extend({
		defaults:{
			row:   null,
			step:  null,
			active:null,
			sequencer: null
		}
	});

	var Points = Backbone.Collection.extend({
		model:Point
	});

	var ArrangementSequencer = Backbone.Model.extend({

		defaults:{
			playing:false,
			steps:  16,
			step:   0
		},

		initialize:function (attrs, options) {

			var rows = this.rows = options.rows,
				scheduler = this.scheduler = options.scheduler,
				points = this.points = new Points(),
				//notes = this.midiNotes = new MidiNotes();
				patterns = this.patterns = new PatternSequencers();
			var steps = this.get('steps');

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

			rows.on("add", function() {
				var new_row = rows.last();
				for (var i = 0; i < steps; i++) {
					points.add({
						row: new_row,
						step:i
					});
				}
				console.log("row added")
			});

			points.on("change:active", function(data) {

			})

			return Backbone.Model.prototype.initialize.apply(this, arguments);

		},

		rowAdded: function() {
			console.log("row added yo");
		},

		createNewPattern: function(options) {
			// This should replace the newPattern method in the view.
			this.patterns.add({
				row: options.row,
				sequencer: new Sequencer({}, {
					instrument:options.instrument,
					scheduler: this.scheduler,
					rows:     new Keys([
						{ name:'A' },
						{ name:'B' },
						{ name:'D' },
						{ name:'G' }
					])
				})
			});

			return this.patterns.last();
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
				point.get('row').trigger('noteOn');
			});
		}

	});

	return ArrangementSequencer;

});