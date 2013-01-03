define([
	'backbone',
	'layout',
	'handlebars',
	'text!../../../handlebars/sequencer/arrangement-sequencer.handlebars',
	'text!../../../handlebars/sequencer/arrangement-row.handlebars',
	'text!../../../handlebars/sequencer/point.handlebars'
], function (Backbone, Layout, Handlebars, tmpl, row_tmpl, point_tmpl) {

	Handlebars.registerHelper('');

	var PointView = Layout.extend({

		tagName: 'td',
		template:Handlebars.compile(point_tmpl),

		events:{
			'click':'clickStep'
		},

		initialize:function () {
			this.model.on('change:active', _.bind(this.render, this));
			return Layout.prototype.initialize.apply(this, arguments);
		},

		// Add or remove a new item in the step
		clickStep: function (e) {
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

		events:{
			"click .new-pattern": "newPattern"
		},

		initialize:function (options) {
			this.points = options.points;
			this.context = options.context;

			return Layout.prototype.initialize.apply(this, arguments);
		},

		newPattern: function(e) {
			console.log("newPattern");

			var newPattern = this.context.createNewPattern({
				row: this.model,
				instrument: this.model.instrument
			});

			console.log(newPattern);
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

	var ArrangementSequencer = Layout.extend({

		tagName:  'table',
		className:'sequencer',
		template: Handlebars.compile(tmpl),

		initialize:function (options) {
			var self = this;

			// Do something eventually
			this.model.points.on("change:active", function (data) {

			})

			this.model.points.on('add', function (point) {
				console.log(point.get('row'), point.get('step'));
			});

			// Re-render when the rows change (instruments added or removed)
			this.model.rows.on("add", function () {
				console.log(this.model);
				this.model.rowAdded();
				this.render();
			}.bind(this));

			// Re-render when instrument is removed
			this.model.rows.on("remove", function () {
				console.log("row removed");
				this.render();
			}.bind(this));

			// Call super
			return Layout.prototype.initialize.apply(this, arguments);
		},

		serialize:function () {
			return new Array(this.model.get('steps'));
		},

		render:function () {
			var self = Layout.prototype.render.apply(this, arguments),
				$tbody = $('tbody', self.$el),
				points = this.model.points,
				rows = this.model.rows;
			rows.each(function (row) {
				var view = new SequencerRow({
					context: self.model,
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

	return ArrangementSequencer;

});