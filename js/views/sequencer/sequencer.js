define([
	'backbone',
	'layout',
	'handlebars',
	'text!../../../handlebars/sequencer/sequencer.handlebars',
	'text!../../../handlebars/sequencer/row.handlebars',
	'text!../../../handlebars/sequencer/point.handlebars'
], function (Backbone, Layout, Handlebars, tmpl, row_tmpl, point_tmpl) {

	Handlebars.registerHelper('times', function(num, options) {
		var ret = "";

		for(var i=0, j=num; i<j; i++) {
			ret = ret + options.fn(this);
		}

		return ret;
	});

	var PointView = Layout.extend({

		tagName: 'td',
		template:Handlebars.compile(point_tmpl),

		events:{
			'click':'clickStep'
		},

		initialize:function () {
			this.listenTo(this.model, 'change:active', _.bind(this.render, this));
			return Layout.prototype.initialize.apply(this, arguments);
		},

		// Add or remove a new item in the step
		clickStep:function (e) {
			var point = this.model,
				active = point.get('active');
			point.set('active', !active);
			e.preventDefault();

			console.log("clickStep: ", this.model);
		}

	});

	var SequencerRow = Layout.extend({

		tagName: 'tr',
		template:Handlebars.compile(row_tmpl),

		initialize:function (options) {
			this.points = options.points;
			return Layout.prototype.initialize.apply(this, arguments);
		},

		render:function () {
			var self = Layout.prototype.render.apply(this, arguments),
				points = self.points;
			_.each(points, function (point) {
				var view = new PointView({
					model:point
				});
				self.$el.append(view.render().el);
			});
			return self;
		}

	});

	var Sequencer = Layout.extend({

		tagName:  'div',
		className:'sequencer',
		template: Handlebars.compile(tmpl),

		events: {
			"click .playback-toggle": "playbackToggle"
		},

		initialize:function (options) {
			var self = this;

			this.listenTo(this.model.points, "change:active", function(data) {

			});

			this.listenTo(this.model.points, 'add', function (point) {
				console.log(point.get('row'), point.get('step'));
			});

			this.listenTo(this.model.rows, "add", function() {
				console.log(this.model);
				this.model.rowAdded();
				this.render();
			}.bind(this));

			this.listenTo(this.model, "change:playing", function(context, data) {
				var btn = self.$el.find(".playback-toggle");
				if (data) {
					btn.html("Stop");
				}
				else {
					btn.html("Play");
				}
				console.log("change:playing", data);
			});

			return Layout.prototype.initialize.apply(this, arguments);
		},

		playbackToggle: function() {
			console.log("playbackToggle");
			this.model.set("playing", !this.model.get("playing"));
		},

		/*serialize:function () {
			return new Array(this.model.get('steps'));
		},*/

		render:function () {
			var self = Layout.prototype.render.apply(this, arguments),
				$tbody = $('tbody', self.$el),
				points = this.model.points,
				rows = this.model.rows;
			rows.each(function (row) {
				var view = new SequencerRow({
					model: row,
					points:points.filter(function (p) {
						return p.get('row') == row
					})
				});
				$tbody.append(view.render().el);
			});
			return self;
		}

	});

	return Sequencer;

});