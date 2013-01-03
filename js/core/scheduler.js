define([
	'backbone'
], function (Backbone) {

	var Playback = Backbone.Model.extend({
		defaults: {
			state: null,
			origin: null
		}
	});

	var PlaybackStore = Backbone.Collection.extend({
		model: Playback
	});

	var Scheduler = Backbone.Model.extend({

		defaults:{
			bpm:120
		},

		initialize:function (attrs, options) {

			var audiolet = this.audiolet = options.audiolet;
			this.playbackStore = new PlaybackStore();

			Backbone.Model.prototype.initialize.apply(this, arguments);

			this.set('state', {}); // Stores the playback event

			this.properties();

		},

		properties:function () {

			var self = this,
				scheduler = self.audiolet.scheduler;

			self.on('change:bpm', function (self, val) {
				scheduler.setTempo(val);
			}); // derp

		},

		play:function (args, options) {
			this.playbackStore.add({
				state: this.audiolet.scheduler.play(
					[new PSequence([args], (options.repeat || Infinity))],
					(options.per_beat || 1) / 4,
					options.callback
				),
				origin: options.origin
			});

			console.log("playbackStore", this.playbackStore);

			/*this.set("state", this.audiolet.scheduler.play(
				[new PSequence([args], (repeat || Infinity))],
				(per_beat || 1) / 4,
				cb
			));*/
		},

		stop:function () {
			//this.audiolet.scheduler.remove(this.get('state'));
			var self = this;
			this.playbackStore.each(function(item){
				self.audiolet.scheduler.remove(item.get("state"));
			});

			console.log("stop playbackStore", this.playbackStore);
			//this.set('state', {});
		}

	});

	return Scheduler;

});