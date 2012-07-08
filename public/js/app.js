// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, App, Backbone, Check, CheckView, Checks, LoginView, Marionette, NavBarView, Task, TaskView, Tasks, TasksView, User, initialize, _, _ref;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Marionette = require('marionette');
    require('plugins');
    _ref = require('models'), User = _ref.User, Task = _ref.Task, Tasks = _ref.Tasks, Check = _ref.Check, Checks = _ref.Checks;
    Backbone.Marionette.Renderer.render = function(template, data) {
      return _.template(template, data);
    };
    ({
      getWeekdaysAsArray: function() {
        var day, firstDayOfWeek, startingWeekday, today, week;
        today = moment();
        startingWeekday = app.user.get('starting_weekday');
        firstDayOfWeek = moment().day(startingWeekday);
        if (firstDayOfWeek.day() > today.day()) {
          firstDayOfWeek.day(startingWeekday - 7);
        }
        return week = (function() {
          var _i, _results;
          _results = [];
          for (day = _i = 0; _i <= 6; day = ++_i) {
            _results.push(firstDayOfWeek.clone().add('d', day));
          }
          return _results;
        })();
      }
    });
    TasksView = (function(_super) {

      __extends(TasksView, _super);

      function TasksView() {
        return TasksView.__super__.constructor.apply(this, arguments);
      }

      TasksView.prototype.tagName = 'table';

      TasksView.prototype.id = 'tasksView';

      TasksView.prototype.template = require('jade!../templates/tasks-table')();

      TasksView.prototype.templateHelpers = function() {
        return {
          getWeekdaysAsArray: this.getWeekdaysAsArray
        };
      };

      TasksView.prototype.render = function() {
        this.$el.html(_.template(this.template, this.serializeData()));
        return this.showCollection();
      };

      TasksView.prototype.appendHtml = function(collectionView, itemView) {
        return collectionView.$("tbody").append(itemView.el);
      };

      TasksView.prototype.getWeekdaysAsArray = function() {
        var day, firstDayOfWeek, startingWeekday, today, week;
        console.log('template function');
        today = moment();
        startingWeekday = app.user.get('starting_weekday');
        firstDayOfWeek = moment().day(startingWeekday);
        if (firstDayOfWeek.day() > today.day()) {
          firstDayOfWeek.day(startingWeekday - 7);
        }
        return week = (function() {
          var _i, _results;
          _results = [];
          for (day = _i = 0; _i <= 6; day = ++_i) {
            _results.push(firstDayOfWeek.clone().add('d', day));
          }
          return _results;
        })();
      };

      return TasksView;

    })(Backbone.Marionette.CollectionView);
    TaskView = (function(_super) {

      __extends(TaskView, _super);

      function TaskView() {
        return TaskView.__super__.constructor.apply(this, arguments);
      }

      TaskView.prototype.tagName = 'tr';

      TaskView.prototype.template = require('jade!../templates/task-row')();

      return TaskView;

    })(Backbone.Marionette.ItemView);
    LoginView = (function(_super) {

      __extends(LoginView, _super);

      function LoginView() {
        return LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.template = require('jade!../templates/login')();

      LoginView.prototype.render = function() {
        this.$el.html(this.template);
        return this;
      };

      return LoginView;

    })(Backbone.Marionette.ItemView);
    CheckView = (function(_super) {

      __extends(CheckView, _super);

      function CheckView() {
        return CheckView.__super__.constructor.apply(this, arguments);
      }

      CheckView.prototype.tagname = 'a';

      CheckView.prototype.initialize = function() {
        return this.template = _.template($('#check-template').html());
      };

      return CheckView;

    })(Backbone.Marionette.ItemView);
    NavBarView = (function(_super) {

      __extends(NavBarView, _super);

      function NavBarView() {
        return NavBarView.__super__.constructor.apply(this, arguments);
      }

      NavBarView.prototype.template = require('jade!../templates/navbar')();

      NavBarView.prototype.initialize = function() {
        app.vent.on('scroll:window', this.addDropShadow, this);
        return this.model.bind('change', this.render, this);
      };

      NavBarView.prototype.render = function() {
        this.$el.html(_.template(this.template, this.model.toJSON()));
        return this;
      };

      NavBarView.prototype.serializeData = function() {
        return {
          name: this.model.get('name')
        };
      };

      NavBarView.prototype.addDropShadow = function() {
        if (window.pageYOffset > 0) {
          return this.$el.children().addClass('nav-drop-shadow');
        } else {
          return this.$el.children().removeClass('nav-drop-shadow');
        }
      };

      return NavBarView;

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
        this.showApp();
        $(window).bind('scroll touchmove', function() {
          return _this.vent.trigger('scroll:window');
        });
        return this.user.isSignedIn((function() {
          return _this.showTasks();
        }), (function() {
          return _this.showLogin();
        }));
      };

      App.prototype.showApp = function() {
        this.addRegions({
          navigation: ".navigation",
          body: ".body"
        });
        return this.navigation.show(this.navigation = new NavBarView({
          model: this.user
        }));
      };

      App.prototype.showTasks = function() {
        this.body.show(this.tasksView = new TasksView({
          collection: this.tasks,
          itemView: TaskView
        }));
        return this.tasks.fetch();
      };

      App.prototype.showLogin = function() {
        return this.body.show(this.loginView = new LoginView);
      };

      return App;

    })(Backbone.Marionette.Application);
    initialize = function() {
      window.app = new App;
      return window.app.initialize();
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
