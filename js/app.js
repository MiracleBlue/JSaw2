require([

	'core/scheduler',
	'core/arrangement/tracks',
	'core/mixer/mixer',
	'core/sequencer/sequencer',
	'core/sequencer/arrangement-sequencer',

	'views/nav/nav',
	'views/arrangement/arrangement',
	'views/mixer/mixer',
	'views/sequencer/sequencer',
	'views/sequencer/arrangement-sequencer',
	'core/instrument',
	'dsp/gen/synth'
], function (Scheduler, Tracks, Mixer, Sequencer, ArrangementSequencer, NavView, ArrangementView, MixerView, SequencerView, ArrangementSequencerView, Instrument, Synth1) {

	//
	// create nodes
	//

	var audiolet = new Audiolet(),
		scheduler = new Scheduler({}, { audiolet:audiolet }),
		tracks = new Tracks(),
		mixer = new Mixer({}, { audiolet:audiolet });

	//
	// route graph
	//

	// by default, newly added tracks get routed
	// to the mixer master channel
	tracks.on('add', function (track) {
		track.connect(mixer.channels.at(0));
	});

	// removing a track from the collection
	// should remove it from the audiolet graph
	tracks.on('remove', function (track) {
		tracks.remove();
	});

	// connect mixer to output
	mixer.connect(audiolet.output);

	// Maintain application state somehow
	var ApplicationStateManager = Backbone.Model.extend({
		defaults: {
			tempo: 120
		},

		elem: {
			body: $("body")
		},

		sequencerView: null,

		initialize: function() {
			console.log("Initialize ApplicationStateManager");
		},

		// Hot swap the sequencer view with a new sequencer
		swapSequencerView: function(newSequencer) {
			// Completely destroy the view
			if (this.sequencerView) {
				this.sequencerView.remove();
				this.sequencerView = null;
			}
			// Create new sequencer view
			this.sequencerView = new SequencerView({
				model: newSequencer
			});

			this.elem.body.append(this.sequencerView.render().$el);

			return this; // Chain?
		}

	});

	window.app = new ApplicationStateManager();

	//
	// build ui
	//

	var $body = $('body');

	var nav_view = new NavView({
		model:scheduler
	});

	var arrangement_view = new ArrangementView({
		audiolet:audiolet,
		tracks:  tracks,
		mixer:   mixer
	});

	var mixer_view = new MixerView({
		model:   mixer,
		audiolet:audiolet
	});

	$body.append(nav_view.render().el);
	$body.append(arrangement_view.render().el);
	$body.append(mixer_view.render().el);

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
			tracks.each(function (track) {
				track.instrument.playNotes([
					{
						key:self.get('name')
					}
				]);
			});
		}

	});

	// Collection of rows for sequencer
	var Keys = Backbone.Collection.extend({
		model:Key
	});

	// Add a test track
	tracks.add({}, {
		audiolet: audiolet,
		instrument: new Instrument({generator: Synth1}, {audiolet: audiolet})
	});

	console.log(tracks.last().instrument);

	/*var sequencer = new Sequencer({ }, {
		instrument:tracks.last().instrument,
		scheduler:scheduler,
		rows:     new Keys([
			{ name:'A' },
			{ name:'B' },
			{ name:'D' },
			{ name:'G' }
		])
	});*/



	// Arrangement rows


	// Arrangement sequencer
	var arrangement_sequencer = new ArrangementSequencer({}, {
		scheduler: scheduler,
		rows: tracks
	});

	arrangement_sequencer.patterns.add({
		row: tracks.last(),
		sequencer: new Sequencer({}, {
			instrument:tracks.last().instrument,
			scheduler:scheduler,
			rows:     new Keys([
				{ name:'A' },
				{ name:'B' },
				{ name:'D' },
				{ name:'G' }
			])
		})
	});

	var test_sequencer = arrangement_sequencer.patterns.last().get("sequencer");

	app.swapSequencerView(test_sequencer);

	/*var sequencer_view = new SequencerView({
		model:test_sequencer
	});

	$body.append(sequencer_view.render().$el);*/

	test_sequencer.set('playing', true);

	var arrangement_sequencer_view = new ArrangementSequencerView({
		model: arrangement_sequencer
	});

	$body.append(arrangement_sequencer_view.render().$el);

});