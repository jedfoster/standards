// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, App, AppRouter, Backbone, ButtonRadio, CheckView, Checks, ErrorView, Form, InfoForm, Marionette, MultiRegion, NavBarView, NoticeView, PasswordForm, SettingsView, Task, TaskRowView, TaskView, Tasks, TasksView, Timezone, User, colorArray, getWeekdaysAsArray, heatmapHeader, initialize, renderColors, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Marionette = require('marionette');
    require('moment');
    require('jquery-hammer');
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

      Tasks.prototype.selectTask = function(task) {
        return app.vent.trigger('task:clicked', task.id);
      };

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
    heatmapHeader = function() {
      var day, firstDayOfWeek, week;
      firstDayOfWeek = moment().sod().day(0);
      return week = (function() {
        var _i, _results;
        _results = [];
        for (day = _i = 0; _i <= 6; day = ++_i) {
          _results.push(firstDayOfWeek.clone().add('d', day));
        }
        return _results;
      })();
    };
    getWeekdaysAsArray = function(full) {
      var day, firstDayOfWeek, lengthOfWeek, startingWeekday, today, week, _ref, _ref1;
      today = moment().sod();
      if (app.daysInView === 6) {
        startingWeekday = parseInt(app.user.get('starting_weekday')) + parseInt((_ref = app.offset) != null ? _ref : 0);
      } else {
        startingWeekday = parseInt(today.day()) + parseInt((_ref1 = app.offset) != null ? _ref1 : 0) - 1;
      }
      firstDayOfWeek = moment().sod();
      firstDayOfWeek.day(startingWeekday);
      if (firstDayOfWeek.diff(today, 'days') > 0) {
        firstDayOfWeek.day(startingWeekday - 7);
      }
      lengthOfWeek = full ? app.daysInView : Math.min(app.daysInView, today.diff(firstDayOfWeek, 'days'));
      return week = (function() {
        var _i, _results;
        _results = [];
        for (day = _i = 0; 0 <= lengthOfWeek ? _i <= lengthOfWeek : _i >= lengthOfWeek; day = 0 <= lengthOfWeek ? ++_i : --_i) {
          _results.push(firstDayOfWeek.clone().add('d', day));
        }
        return _results;
      })();
    };
    colorArray = function(numberOfRows) {
      var alpha, color, colors, hue, i, lightness, saturation, _i;
      colors = [];
      for (i = _i = 0; 0 <= numberOfRows ? _i <= numberOfRows : _i >= numberOfRows; i = 0 <= numberOfRows ? ++_i : --_i) {
        hue = i * 340 / (numberOfRows + 2);
        saturation = 0.8;
        lightness = 0.5;
        alpha = 1.0;
        color = $.Color({
          hue: hue,
          saturation: saturation,
          lightness: lightness,
          alpha: alpha
        }).toHslaString();
        colors.push($.Color(color).toHexString());
      }
      return colors;
    };
    renderColors = function() {
      var barColors, bgColors, rows;
      rows = $('tbody').children();
      bgColors = colorArray(rows.size(), 0.8);
      barColors = colorArray(rows.size(), 0.6);
      return $(rows).each(function(row) {
        var $ministat;
        $ministat = $(this).children('td.title').children('.ministat');
        $ministat.css("background-color", bgColors[row]);
        return $ministat.children('.minibar').css("background-color", barColors[row]);
      });
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

      TaskRowView.prototype.events = {
        'click .task': 'clickedTask'
      };

      TaskRowView.prototype.clickedTask = function(e) {
        e.preventDefault();
        console.log('clicked', this.model.id);
        return this.model.select();
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

      TasksView.prototype.initialize = function() {
        var _this = this;
        app.vent.on('window:resize', function() {
          return _this.render();
        });
        return app.vent.on('app:changeOffset', function() {
          return _this.render();
        });
      };

      TasksView.prototype.templateHelpers = function() {
        return {
          getWeekdaysAsArray: getWeekdaysAsArray
        };
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
        'click .settings': 'clickedSettings',
        'click .moveForward': 'clickedMoveForward',
        'click .moveBackward': 'clickedMoveBackward'
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
        return app.vent.trigger('home:clicked');
      };

      NavBarView.prototype.clickedSettings = function(e) {
        e.preventDefault();
        return app.vent.trigger('settings:clicked');
      };

      NavBarView.prototype.clickedMoveForward = function() {
        return app.vent.trigger('app:moveForward');
      };

      NavBarView.prototype.clickedMoveBackward = function() {
        return app.vent.trigger('app:moveBackward');
      };

      return NavBarView;

    })(Backbone.Marionette.ItemView);
    SettingsView = (function(_super) {

      __extends(SettingsView, _super);

      function SettingsView() {
        return SettingsView.__super__.constructor.apply(this, arguments);
      }

      SettingsView.prototype.template = require('jade!../templates/settings')();

      SettingsView.prototype.regions = {
        info: '.info',
        password: '.password'
      };

      return SettingsView;

    })(Backbone.Marionette.Layout);
    ButtonRadio = (function(_super) {

      __extends(ButtonRadio, _super);

      function ButtonRadio() {
        return ButtonRadio.__super__.constructor.apply(this, arguments);
      }

      ButtonRadio.prototype.tagName = 'div';

      ButtonRadio.prototype.events = {
        'click button': 'clickedButton'
      };

      ButtonRadio.prototype.render = function() {
        var el;
        el = ButtonRadio.__super__.render.apply(this, arguments);
        this.updateButtons();
        return el;
      };

      ButtonRadio.prototype.updateButtons = function() {
        var _this = this;
        return this.$('button').each(function(index, button) {
          if ($(button).val() === _this.getValue()) {
            return $(button).addClass('active');
          }
        });
      };

      ButtonRadio.prototype.clickedButton = function(e) {
        var _this = this;
        this.setValue($(e.target).val());
        return this.$('button').each(function(index, button) {
          if ($(button).val() === _this.getValue()) {
            return $(button).addClass('active');
          }
        });
      };

      ButtonRadio.prototype.getValue = function() {
        return this.$('input').val();
      };

      ButtonRadio.prototype.setValue = function(value) {
        return this.$('input').val(value != null ? value : this.getValue());
      };

      ButtonRadio.prototype._arrayToHtml = function(array) {
        var html,
          _this = this;
        html = [];
        html.push('<div class="btn-group" data-toggle="buttons-radio" data-toggle-name="starting_weekday" name="starting_weekday">');
        _.each(array, function(option, index) {
          var itemHtml, val, _ref;
          if (_.isObject(option)) {
            val = (_ref = option.val) != null ? _ref : '';
            itemHtml = '<button type="button" class="btn" name="' + _this.id + '" value="' + val + '" id="' + _this.id + '-' + index + '" data-toggle="button">' + option.label + '</button>';
          } else {
            itemHtml = '<button type="button" class="btn" name="' + _this.id + '" value="' + option + '" id="' + _this.id + '-' + index + '" data-toggle="button">' + option.label + '</button>';
          }
          return html.push(itemHtml);
        });
        html.push('</div>\n<input type="hidden" name="starting_weekday">');
        return html.join('');
      };

      return ButtonRadio;

    })(Backbone.Form.editors.Select);
    Timezone = (function(_super) {

      __extends(Timezone, _super);

      function Timezone() {
        return Timezone.__super__.constructor.apply(this, arguments);
      }

      Timezone.prototype.tagName = 'div';

      Timezone.prototype.events = {
        'change select': 'resetButton',
        'click button': 'getLocation'
      };

      Timezone.prototype.render = function() {
        var collection, options,
          _this = this;
        options = this.schema.options;
        if (options instanceof Backbone.Collection) {
          collection = options;
          if (collection.length > 0) {
            this.renderOptions(options);
          } else {
            collection.fetch({
              success: function(collection) {
                return _this.renderOptions(options);
              }
            });
          }
        } else if (_.isFunction(options)) {
          options(function(result) {
            _this.renderOptions(result);
            return _this.disableButton();
          });
        } else {
          this.renderOptions(options);
        }
        return this;
      };

      Timezone.prototype.disableButton = function() {
        if (navigator.geolocation == null) {
          return this.$('button').attr('disabled', 'disabled');
        }
      };

      Timezone.prototype.resetButton = function() {
        return this.$('button').css('color', '#333333');
      };

      Timezone.prototype.getLocation = function() {
        var $button,
          _this = this;
        $button = this.$('button');
        if ($button.attr('disabled') == null) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var lat, long, url, urlbase, username;
            lat = position.coords.latitude;
            long = position.coords.longitude;
            urlbase = "http://api.geonames.org/timezoneJSON?";
            username = "interstateone";
            url = urlbase + "lat=" + lat + "&" + "lng=" + long + "&" + "username=" + username;
            return $.get(url, function(data) {
              $button.css('color', 'green');
              return _this.setValue(data.timezoneId);
            }).error(function() {
              return $button.css('color', 'red');
            });
          });
          (function(error) {
            switch (error.code) {
              case error.TIMEOUT:
                return app.trigger('error', 'Geolocation error: Timeout');
              case error.POSITION_UNAVAILABLE:
                return app.trigger('error', 'Geolocation error: Position unavailable');
              case error.PERMISSION_DENIED:
                return app.trigger('error', 'Geolocation error: Permission denied');
              case error.UNKNOWN_ERROR:
                return app.trigger('error', 'Geolocation error: Unknown error');
            }
          });
          return {
            timeout: 5000
          };
        }
      };

      Timezone.prototype.getValue = function() {
        return this.$('select').val();
      };

      Timezone.prototype.setValue = function(value) {
        return this.$('select').val(value);
      };

      Timezone.prototype._arrayToHtml = function(array) {
        var html;
        html = [];
        html.push('<select id="timezone" name="timezone">');
        _.each(array, function(option) {
          var _ref;
          if (_.isObject(option)) {
            return html.push("<option value=\"" + ((_ref = option.val) != null ? _ref : '') + "\">" + option.label + "</option>");
          } else {
            return html.push("<option>" + option + "</option>");
          }
        });
        html.push('</select>\n<button class="btn geolocate" type="button"><i class="icon-map-marker"></i></button>');
        return html.join('');
      };

      return Timezone;

    })(Backbone.Form.editors.Select);
    InfoForm = (function(_super) {

      __extends(InfoForm, _super);

      function InfoForm() {
        return InfoForm.__super__.constructor.apply(this, arguments);
      }

      InfoForm.prototype.template = require('jade!../templates/info-form')();

      InfoForm.prototype.events = {
        'click button[type="submit"]': 'commitChanges'
      };

      InfoForm.prototype.commitChanges = function(e) {
        var errors;
        e.preventDefault();
        e.stopPropagation();
        errors = this.commit();
        if (errors == null) {
          return this.model.save({}, {
            success: function() {
              return app.vent.trigger('notice', 'Your info has been updated.');
            }
          });
        }
      };

      InfoForm.prototype.schema = {
        name: {
          title: 'Name',
          type: 'Text',
          validators: ['required']
        },
        email: {
          title: 'Email',
          type: 'Text',
          validators: ['email', 'required']
        },
        starting_weekday: {
          title: 'Weeks start on',
          type: ButtonRadio,
          options: function(callback) {
            var day;
            return callback((function() {
              var _i, _results;
              _results = [];
              for (day = _i = 0; _i <= 6; day = ++_i) {
                _results.push({
                  val: day,
                  label: moment().day(day).format('ddd').slice(0, 1)
                });
              }
              return _results;
            })());
          }
        },
        timezone: {
          title: 'Timezone',
          type: Timezone,
          options: function(callback) {
            return $.get('/api/timezones', function(data) {
              var result;
              result = _.map(data, function(obj) {
                return {
                  val: _.keys(obj)[0],
                  label: _.values(obj)[0]
                };
              });
              return callback(result);
            });
          }
        },
        email_permission: {
          title: 'Do you want to receive email updates about Standards?',
          type: 'Checkbox'
        }
      };

      InfoForm.prototype.fieldsets = [
        {
          legend: 'Info',
          fields: ['name', 'email', 'starting_weekday', 'timezone', 'email_permission']
        }
      ];

      return InfoForm;

    })(Form);
    PasswordForm = (function(_super) {

      __extends(PasswordForm, _super);

      function PasswordForm() {
        return PasswordForm.__super__.constructor.apply(this, arguments);
      }

      PasswordForm.prototype.template = require('jade!../templates/password-form')();

      PasswordForm.prototype.events = {
        'click button[type="submit"]': 'commitChanges'
      };

      PasswordForm.prototype.commitChanges = function(e) {
        var errors;
        e.preventDefault();
        e.stopPropagation();
        errors = this.validate();
        if (errors == null) {
          return $.ajax({
            url: '/api/user/password',
            type: 'POST',
            data: JSON.stringify({
              current_password: this.$('input[name="current_password"]').val(),
              new_password: this.$('input[name="new_password"]').val()
            }),
            success: function() {
              return app.vent.trigger('notice', 'Your password has been updated.');
            }
          });
        }
      };

      PasswordForm.prototype.schema = {
        current_password: {
          title: 'Current Password',
          type: 'Password'
        },
        new_password: {
          title: 'New Password',
          type: 'Password',
          validators: [
            function(value, formValues) {
              var lengthError;
              lengthError = {
                type: 'Password',
                message: 'Password must be at least 8 characters long.'
              };
              if (value.length < 8) {
                return lengthError;
              }
            }
          ]
        }
      };

      PasswordForm.prototype.fieldsets = [
        {
          legend: 'Change Password',
          fields: ['current_password', 'new_password']
        }
      ];

      return PasswordForm;

    })(Form);
    ErrorView = (function(_super) {

      __extends(ErrorView, _super);

      function ErrorView() {
        return ErrorView.__super__.constructor.apply(this, arguments);
      }

      ErrorView.prototype.template = require('jade!../templates/error-flash')();

      ErrorView.prototype.render = function() {
        return this.$el.html(_.template(this.template, this.serializeData()));
      };

      ErrorView.prototype.serializeData = function() {
        return {
          message: this.options.message
        };
      };

      return ErrorView;

    })(Backbone.Marionette.View);
    NoticeView = (function(_super) {

      __extends(NoticeView, _super);

      function NoticeView() {
        return NoticeView.__super__.constructor.apply(this, arguments);
      }

      NoticeView.prototype.template = require('jade!../templates/notice-flash')();

      NoticeView.prototype.render = function() {
        return this.$el.html(_.template(this.template, this.serializeData()));
      };

      NoticeView.prototype.serializeData = function() {
        return {
          message: this.options.message
        };
      };

      return NoticeView;

    })(Backbone.Marionette.View);
    TaskView = (function(_super) {

      __extends(TaskView, _super);

      function TaskView() {
        return TaskView.__super__.constructor.apply(this, arguments);
      }

      TaskView.prototype.template = require('jade!../templates/taskview')();

      TaskView.prototype.events = {
        'click a.delete': 'clickedDelete',
        'click a.delete-confirm': 'confirmDelete'
      };

      TaskView.prototype.clickedDelete = function() {
        return this.$(".deleteModal").modal();
      };

      TaskView.prototype.confirmDelete = function(e) {
        e.preventDefault();
        this.$('.delete-confirm').button('loading');
        return app.vent.trigger('task:delete', this.model.id);
      };

      TaskView.prototype.serializeData = function() {
        var count, createdDay, firstCheckDay, firstDay, heatmap, percentComplete, timeAgo, today, weekdayCount;
        count = this.model.get('checks').length;
        today = moment().sod();
        this.model.get('checks').comparator = function(check) {
          return check.get('date');
        };
        createdDay = moment(this.model.get('created_on')).sod();
        firstDay = createdDay;
        if (this.model.get('checks').length) {
          firstCheckDay = moment(this.model.get('checks').sort({
            silent: true
          }).first().get('date'));
          firstDay = moment(Math.min(createdDay.valueOf(), firstCheckDay.valueOf()));
        }
        percentComplete = Math.ceil(count * 100 / (today.diff(firstDay, 'days') + 1));
        timeAgo = today.diff(firstDay, 'hours') > 24 ? firstDay.fromNow() : 'today';
        console.log(today.diff(firstDay, 'hours'));
        weekdayCount = this.weekdayCount();
        heatmap = this.heatmap(weekdayCount);
        return _.extend(TaskView.__super__.serializeData.apply(this, arguments), {
          count: count,
          percentComplete: percentComplete,
          timeAgo: timeAgo,
          heatmap: heatmap
        });
      };

      TaskView.prototype.weekdayCount = function() {
        var weekdayCount;
        weekdayCount = [0, 0, 0, 0, 0, 0, 0];
        this.model.get('checks').each(function(check) {
          var weekdayIndex;
          weekdayIndex = moment(check.get('date')).day();
          return weekdayCount[weekdayIndex] += 1;
        });
        return weekdayCount;
      };

      TaskView.prototype.heatmap = function(countArray) {
        var count, heatmap, max, min, temp, _i, _len;
        heatmap = [];
        max = _.max(countArray);
        max || (max = 1);
        min = _.min(countArray);
        for (_i = 0, _len = countArray.length; _i < _len; _i++) {
          count = countArray[_i];
          temp = $.Color('#FF0000').hue(Math.abs(count - max) / max * 40);
          heatmap.push({
            count: count,
            temp: temp.toHexString()
          });
        }
        return heatmap;
      };

      TaskView.prototype.templateHelpers = {
        sentenceCase: function(string) {
          return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },
        titleCase: function(string) {
          var word;
          return ((function() {
            var _i, _len, _ref, _results;
            _ref = string.split(' ');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              word = _ref[_i];
              _results.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            }
            return _results;
          })()).join(' ');
        },
        pluralize: function(word, count) {
          if (count > 0) {
            return word += 's';
          }
        },
        heatmapHeader: heatmapHeader,
        getWeekdaysAsArray: getWeekdaysAsArray,
        gsub: function(source, pattern, replacement) {
          var match, result;
          result = '';
          if (_.isString(pattern)) {
            pattern = RegExp.escape(pattern);
          }
          if (!(pattern.length || pattern.source)) {
            replacement = replacement('');
            replacement + source.split('').join(replacement) + replacement;
          }
          while (source.length > 0) {
            if (match = source.match(pattern)) {
              result += source.slice(0, match.index);
              result += replacement(match);
              source = source.slice(match.index + match[0].length);
            } else {
              result += source;
              source = '';
            }
          }
          return result;
        },
        switchPronouns: function(string) {
          return this.gsub(string, /\b(I am|You are|I|You|Your|My)\b/i, function(pronoun) {
            switch (pronoun[0].toLowerCase()) {
              case 'i':
                return 'you';
              case 'you':
                return 'I';
              case 'i am':
                return "You are";
              case 'you are':
                return 'I am';
              case 'your':
                return 'my';
              case 'my':
                return 'your';
            }
          });
        }
      };

      return TaskView;

    })(Backbone.Marionette.ItemView);
    MultiRegion = (function(_super) {

      __extends(MultiRegion, _super);

      function MultiRegion() {
        return MultiRegion.__super__.constructor.apply(this, arguments);
      }

      MultiRegion.prototype.open = function(view) {
        return this.$el.append(view.el);
      };

      MultiRegion.prototype.close = function() {
        var view;
        view = this.currentView;
        if (!((view != null) || view.length > 0)) {
          return;
        }
        if (!_.isArray(view)) {
          this.currentView = view = [view];
        }
        _.each(view, function(v) {
          if (v.close) {
            v.close();
          }
          return this.trigger("view:closed", v);
        }, this);
        this.currentView = [];
        return this.$el.empty();
      };

      MultiRegion.prototype.append = function(view) {
        var _ref;
        this.ensureEl();
        view.render();
        this.open(view);
        if (view.onShow) {
          view.onShow();
        }
        view.trigger("show");
        if (this.onShow) {
          this.onShow(view);
        }
        this.trigger("view:show", view);
        if ((_ref = this.currentView) == null) {
          this.currentView = [];
        }
        if (!_.isArray(this.currentView)) {
          this.currentView = [this.currentView];
        }
        return this.currentView.push(view);
      };

      return MultiRegion;

    })(Backbone.Marionette.Region);
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
        this.daysInView = 6;
        this.offset = 0;
        this.navBar = new NavBarView({
          model: this.user
        });
        this.tasksView = new TasksView({
          collection: this.tasks
        });
        this.settingsView = new SettingsView({
          model: this.user
        });
        this.toggleWidth();
        this.showApp();
        this.router = new AppRouter({
          controller: this
        });
        Backbone.history.start({
          pushState: true
        });
        $(document).ajaxError(function(e, xhr, settings, error) {
          switch (xhr.status) {
            case 401:
              return app.vent.trigger('error', 'Authentication error, try logging in again.');
            case 404:
              return app.vent.trigger('error', 'The server didn\'t understand that action.');
            case 500:
              return app.vent.trigger('error', 'There was a server error, try again.');
          }
        });
        $(window).bind('scroll touchmove', function() {
          return _this.vent.trigger('scroll:window');
        });
        $(window).bind('resize', function() {
          return _this.toggleWidth();
        });
        app.vent.on('task:check', this.check, this);
        app.vent.on('task:uncheck', this.uncheck, this);
        app.vent.on('error', this.showError, this);
        app.vent.on('notice', this.showNotice, this);
        app.vent.on('task:clicked', this.showTask, this);
        app.vent.on('task:delete', this.deleteTask, this);
        app.vent.on('settings:clicked', this.showSettings, this);
        app.vent.on('home:clicked', this.showTasks, this);
        app.vent.on('app:moveForward', this.moveForward, this);
        return app.vent.on('app:moveBackward', this.moveBackward, this);
      };

      App.prototype.toggleWidth = function() {
        var old;
        old = this.daysInView;
        this.daysInView = $(window).width() <= 480 ? 1 : 6;
        if (this.daysInView !== old) {
          return app.vent.trigger('window:resize');
        }
      };

      App.prototype.showApp = function() {
        var _this = this;
        this.addRegions({
          navigation: '.navigation',
          body: '.body'
        });
        this.flash = new MultiRegion({
          el: '.flash'
        });
        this.navigation.show(this.navBar);
        return $(this.body.el).hammer().bind('swipe', function(ev) {
          switch (ev.direction) {
            case 'left':
              return _this.vent.trigger('app:moveForward');
            case 'right':
              return _this.vent.trigger('app:moveBackward');
          }
        });
      };

      App.prototype.showTasks = function() {
        this.offset = 0;
        this.router.navigate('');
        return this.body.show(this.tasksView = new TasksView({
          collection: this.tasks
        }));
      };

      App.prototype.showSettings = function() {
        this.router.navigate('settings');
        this.body.show(this.settingsView = new SettingsView);
        this.settingsView.info.show(this.infoForm = new InfoForm({
          model: this.user
        }));
        return this.settingsView.password.show(this.passwordForm = new PasswordForm);
      };

      App.prototype.showTask = function(id) {
        var task;
        task = this.tasks.get(id);
        if (task == null) {
          this.showTasks();
          return this.showError('That task doesn\'t exist.');
        } else {
          this.router.navigate("task/" + task.id);
          return this.body.show(this.taskView = new TaskView({
            model: task
          }));
        }
      };

      App.prototype.deleteTask = function(id) {
        var _this = this;
        return this.tasks.get(id).destroy({
          success: function() {
            $(".deleteModal").modal('hide');
            return _this.showTasks();
          }
        });
      };

      App.prototype.showError = function(message) {
        var error;
        return this.flash.append(error = new ErrorView({
          message: message
        }));
      };

      App.prototype.showNotice = function(message) {
        var notice,
          _this = this;
        this.flash.append(notice = new NoticeView({
          message: message
        }));
        return window.setTimeout((function() {
          return notice.$(".alert").alert('close');
        }), 2000);
      };

      App.prototype.hideErrors = function() {
        return this.flash.close();
      };

      App.prototype.moveForward = function() {
        if (this.offset !== 0) {
          if (this.daysInView === 1) {
            this.offset += 1;
          } else {
            this.offset += 7;
          }
          return this.vent.trigger('app:changeOffset');
        }
      };

      App.prototype.moveBackward = function() {
        if (this.daysInView === 1) {
          this.offset -= 1;
        } else {
          this.offset -= 7;
        }
        return this.vent.trigger('app:changeOffset');
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
        'settings': 'showSettings',
        'task/:id': 'showTask'
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
