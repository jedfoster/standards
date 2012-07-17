// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, App, AppRouter, Backbone, CheckView, Checks, Form, Marionette, NavBarView, SettingsView, Task, TaskRowView, Tasks, TasksView, User, getWeekdaysAsArray, initialize, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Marionette = require('marionette');
    require('moment');
    require('plugins');
    User = require('user');
    Task = require('task');
    Form = require('form');
    Tasks = (function(_super) {

      __extends(Tasks, _super);

      function Tasks() {
        return Tasks.__super__.constructor.apply(this, arguments);
      }

      Tasks.prototype.model = Task;

      Tasks.prototype.url = '/api/tasks';

      return Tasks;

    })(Backbone.Collection);
    Checks = (function(_super) {

      __extends(Checks, _super);

      function Checks() {
        return Checks.__super__.constructor.apply(this, arguments);
      }

      Checks.prototype.model = Check;

      Checks.prototype.url = '/api/checks';

      return Checks;

    })(Backbone.Collection);
    Backbone.Marionette.Renderer.render = function(template, data) {
      return _.template(template, data);
    };
    jQuery.fn.reset = function() {
      return $(this).each(function() {
        return this.reset();
      });
    };
    getWeekdaysAsArray = function(full) {
      var day, firstDayOfWeek, lengthOfWeek, startingWeekday, today, week;
      today = moment().sod();
      startingWeekday = app.user.get('starting_weekday');
      firstDayOfWeek = moment().sod();
      firstDayOfWeek.day(startingWeekday);
      if (firstDayOfWeek.day() > today.day()) {
        firstDayOfWeek.day(startingWeekday - 7);
      }
      lengthOfWeek = full ? 6 : Math.min(6, today.diff(firstDayOfWeek, 'days'));
      return week = (function() {
        var _i, _results;
        _results = [];
        for (day = _i = 0; 0 <= lengthOfWeek ? _i <= lengthOfWeek : _i >= lengthOfWeek; day = 0 <= lengthOfWeek ? ++_i : --_i) {
          _results.push(firstDayOfWeek.clone().add('d', day));
        }
        return _results;
      })();
    };
    CheckView = (function(_super) {

      __extends(CheckView, _super);

      function CheckView() {
        return CheckView.__super__.constructor.apply(this, arguments);
      }

      CheckView.prototype.tagName = 'td';

      CheckView.prototype.template = require('jade!../templates/check')();

      CheckView.prototype.initialize = function() {
        if (this.model.isNew != null) {
          return this.date = this.model.get('date');
        } else {
          return _.extend(this, this.model);
        }
      };

      CheckView.prototype.events = {
        'click': 'toggleCheck'
      };

      CheckView.prototype.toggleCheck = function() {
        if (this.model.isNew != null) {
          return this.trigger('task:uncheck', this.model);
        } else {
          return this.trigger('task:check', this.date);
        }
      };

      CheckView.prototype.render = function() {
        this.$el.html(this.template);
        if (this.model.isNew != null) {
          this.$('img').addClass('complete');
        }
        return this;
      };

      return CheckView;

    })(Backbone.Marionette.ItemView);
    TaskRowView = (function(_super) {

      __extends(TaskRowView, _super);

      function TaskRowView() {
        return TaskRowView.__super__.constructor.apply(this, arguments);
      }

      TaskRowView.prototype.tagName = 'tr';

      TaskRowView.prototype.template = require('jade!../templates/task-row')();

      TaskRowView.prototype.itemView = CheckView;

      TaskRowView.prototype.initialEvents = function() {
        if (this.collection != null) {
          this.bindTo(this.collection, 'add', this.render, this);
          this.bindTo(this.collection, 'sync', this.render, this);
          this.bindTo(this.collection, 'remove', this.render, this);
          return this.bindTo(this.collection, 'reset', this.render, this);
        }
      };

      TaskRowView.prototype.initialize = function() {
        this.collection = this.model.get('checks');
        this.collection.comparator = function(check) {
          return check.get('date');
        };
        this.on('itemview:task:check', this.check, this);
        return this.on('itemview:task:uncheck', this.uncheck, this);
      };

      TaskRowView.prototype.onRender = function() {
        return this.renderHeight();
      };

      TaskRowView.prototype.renderCollection = function() {
        this.triggerBeforeRender();
        this.closeChildren();
        this.showCollection();
        this.triggerRendered();
        return this.trigger("composite:collection:rendered");
      };

      TaskRowView.prototype.showCollection = function() {
        var ItemView, boilerplate, check, day, index, weekdays, _i, _len, _results;
        ItemView = this.getItemView();
        weekdays = getWeekdaysAsArray();
        _results = [];
        for (index = _i = 0, _len = weekdays.length; _i < _len; index = ++_i) {
          day = weekdays[index];
          check = this.collection.find(function(check) {
            if ((check.get('date')) != null) {
              return (day.diff(moment(check.get('date')))) === 0;
            }
          });
          boilerplate = {
            date: day.format('YYYY-MM-DD')
          };
          _results.push(this.addItemView(check || (check = boilerplate), ItemView, index));
        }
        return _results;
      };

      TaskRowView.prototype.check = function(itemView, date) {
        return this.collection.create({
          date: date
        });
      };

      TaskRowView.prototype.uncheck = function(itemView, model) {
        return model.destroy();
      };

      TaskRowView.prototype.renderHeight = function() {
        var count, createdDay, firstCheckDay, firstDay, today, total;
        count = this.model.get('checks').length;
        createdDay = moment(this.model.get('created_on'));
        firstDay = createdDay.valueOf();
        if (this.model.get('checks').length) {
          firstCheckDay = moment(this.model.get('checks').sort({
            silent: true
          }).first().get('date'));
          firstDay = Math.min(createdDay.valueOf(), firstCheckDay.valueOf());
        }
        today = moment().sod();
        total = (today.diff(moment(firstDay), 'days')) + 1;
        return this.$('.minibar').css("height", Math.min(50 * count / total, 50));
      };

      return TaskRowView;

    })(Backbone.Marionette.CompositeView);
    TasksView = (function(_super) {

      __extends(TasksView, _super);

      function TasksView() {
        return TasksView.__super__.constructor.apply(this, arguments);
      }

      TasksView.prototype.tagName = 'table';

      TasksView.prototype.id = 'tasksView';

      TasksView.prototype.itemView = TaskRowView;

      TasksView.prototype.itemViewContainer = 'tbody';

      TasksView.prototype.template = require('jade!../templates/tasks-table')();

      TasksView.prototype.events = {
        'click a.add': 'clickedAdd',
        'keypress #newtask': 'keypressNewTask',
        'submit #newtask': 'submitNewTask'
      };

      TasksView.prototype.templateHelpers = function() {
        return {
          getWeekdaysAsArray: getWeekdaysAsArray
        };
      };

      TasksView.prototype.render = function() {
        this.$el.html(_.template(this.template, this.serializeData()));
        return this.showCollection();
      };

      TasksView.prototype.clickedAdd = function() {
        this.toggleNewTaskButton();
        return this.toggleNewTaskForm();
      };

      TasksView.prototype.toggleNewTaskButton = function() {
        if (!this.$('i').hasClass('cancel')) {
          return this.$('i').animate({
            transform: 'rotate(45deg)'
          }, 'fast').toggleClass('cancel');
        } else {
          return this.$('i').animate({
            transform: ''
          }, 'fast').toggleClass('cancel');
        }
      };

      TasksView.prototype.toggleNewTaskForm = function() {
        if (this.$('#newtask').css('opacity') === '0') {
          return this.$('#newtask').animate({
            opacity: 1
          }, 'fast').css('visibility', 'visible');
        } else {
          return this.$('#newtask').animate({
            opacity: 0
          }, 'fast').reset().css('visibility', 'hidden');
        }
      };

      TasksView.prototype.keypressNewTask = function(e) {
        var key;
        key = e.which != null ? e.which : e.keyCode;
        if (key === 13) {
          e.preventDefault();
          e.stopPropagation();
          $('#newtask').submit();
          return _gaq.push(['_trackEvent', 'task', 'create']);
        }
      };

      TasksView.prototype.submitNewTask = function(e) {
        var purpose, title;
        e.preventDefault();
        title = this.$('input#title').val();
        purpose = this.$('input#purpose').val();
        this.collection.create({
          title: title,
          purpose: purpose
        });
        this.toggleNewTaskButton();
        return this.toggleNewTaskForm();
      };

      return TasksView;

    })(Backbone.Marionette.CompositeView);
    NavBarView = (function(_super) {

      __extends(NavBarView, _super);

      function NavBarView() {
        return NavBarView.__super__.constructor.apply(this, arguments);
      }

      NavBarView.prototype.template = require('jade!../templates/navbar')();

      NavBarView.prototype.events = {
        'click .brand': 'clickedHome',
        'click .settings': 'clickedSettings'
      };

      NavBarView.prototype.initialize = function() {
        return app.vent.on('scroll:window', this.addDropShadow, this);
      };

      NavBarView.prototype.addDropShadow = function() {
        if (window.pageYOffset > 0) {
          return this.$el.children().addClass('nav-drop-shadow');
        } else {
          return this.$el.children().removeClass('nav-drop-shadow');
        }
      };

      NavBarView.prototype.clickedHome = function(e) {
        e.preventDefault();
        app.vent.trigger('home:clicked');
        return app.router.navigate('');
      };

      NavBarView.prototype.clickedSettings = function(e) {
        e.preventDefault();
        app.vent.trigger('settings:clicked');
        return app.router.navigate('settings');
      };

      return NavBarView;

    })(Backbone.Marionette.ItemView);
    SettingsView = (function(_super) {

      __extends(SettingsView, _super);

      function SettingsView() {
        return SettingsView.__super__.constructor.apply(this, arguments);
      }

      SettingsView.prototype.template = require('jade!../templates/settings')();

      return SettingsView;

    })(Backbone.Marionette.Layout);
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        return App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.initialize = function() {
        var _this = this;
        this.user = new User;
        this.tasks = new Tasks;
        if (window.bootstrap.user != null) {
          this.user.set(window.bootstrap.user);
        }
        if (window.bootstrap.tasks != null) {
          this.tasks.reset(window.bootstrap.tasks);
        }
        this.navBar = new NavBarView({
          model: this.user
        });
        this.tasksView = new TasksView({
          collection: this.tasks
        });
        this.settingsView = new SettingsView({
          model: this.user
        });
        this.showApp();
        this.router = new AppRouter({
          controller: this
        });
        Backbone.history.start({
          pushState: true
        });
        $(window).bind('scroll touchmove', function() {
          return _this.vent.trigger('scroll:window');
        });
        app.vent.on('task:check', this.check, this);
        app.vent.on('task:uncheck', this.uncheck, this);
        app.vent.on('settings:clicked', this.showSettings, this);
        return app.vent.on('home:clicked', this.showTasks, this);
      };

      App.prototype.showApp = function() {
        this.addRegions({
          navigation: ".navigation",
          body: ".body"
        });
        return this.navigation.show(this.navBar);
      };

      App.prototype.showTasks = function() {
        return this.body.show(this.tasksView = new TasksView({
          collection: this.tasks
        }));
      };

      App.prototype.showSettings = function() {
        return this.body.show(this.settingsView = new SettingsView({
          model: this.user
        }));
      };

      return App;

    })(Backbone.Marionette.Application);
    AppRouter = (function(_super) {

      __extends(AppRouter, _super);

      function AppRouter() {
        return AppRouter.__super__.constructor.apply(this, arguments);
      }

      AppRouter.prototype.appRoutes = {
        '': 'showTasks',
        'settings': 'showSettings'
      };

      return AppRouter;

    })(Backbone.Marionette.AppRouter);
    initialize = function() {
      window.app = new App;
      return window.app.initialize();
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
