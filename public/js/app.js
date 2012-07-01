// Generated by CoffeeScript 1.3.3
(function() {
  var AppLayout, Check, CheckView, NavBarView, StandardsApp, StandardsRouter, Task, TaskView, Tasks, TasksView, User, WeekDayHeader,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  StandardsApp = (function(_super) {

    __extends(StandardsApp, _super);

    function StandardsApp() {
      return StandardsApp.__super__.constructor.apply(this, arguments);
    }

    StandardsApp.prototype.initialize = function() {
      console.log('test');
      this.user = new User;
      this.layout = new AppLayout;
      this.router = new StandardsRouter;
      this.tasks = new Tasks;
      _.templateSettings = {
        evaluate: /\{\[([\s\S]+?)\]\}/g,
        interpolate: /\{\{([\s\S]+?)\}\}/g
      };
      this.layout.navigation.show(this.navigation = new NavBarView);
      return this.layout.container.show(this.tasksView = new TasksView({
        collection: collection
      }));
    };

    return StandardsApp;

  })(Backbone.Marionette.Application);

  StandardsRouter = (function(_super) {

    __extends(StandardsRouter, _super);

    function StandardsRouter() {
      return StandardsRouter.__super__.constructor.apply(this, arguments);
    }

    StandardsRouter.prototype.routes = {
      "": "index"
    };

    StandardsRouter.prototype.index = function() {};

    return StandardsRouter;

  })(Backbone.Marionette.AppRouter);

  User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.url = '/api/user/info';

    User.prototype.isSignedIn = function() {
      return !this.isNew();
    };

    User.prototype.signIn = function(email, password, onFail, onSucceed) {
      $.ajax({
        url: '/sign-in',
        method: 'POST',
        dataType: 'json',
        data: {
          email: email,
          password: password
        },
        error: onFail,
        success: onSucceed,
        context: this
      });
      return this;
    };

    User.prototype.signOut = function() {
      return $.ajax({
        url: '/sign-out',
        method: 'POST'
      }).done(function() {
        this.clear();
        return this.trigger('signed-out');
      });
    };

    return User;

  })(Backbone.Model);

  Task = (function(_super) {

    __extends(Task, _super);

    function Task() {
      return Task.__super__.constructor.apply(this, arguments);
    }

    Task.prototype.url = "/task";

    return Task;

  })(Backbone.Model);

  Check = (function(_super) {

    __extends(Check, _super);

    function Check() {
      return Check.__super__.constructor.apply(this, arguments);
    }

    Check.prototype.url = "/check";

    return Check;

  })(Backbone.Model);

  Tasks = (function(_super) {

    __extends(Tasks, _super);

    function Tasks() {
      return Tasks.__super__.constructor.apply(this, arguments);
    }

    Tasks.prototype.model = Task;

    Tasks.prototype.url = '/api/tasks';

    return Tasks;

  })(Backbone.Collection);

  AppLayout = (function(_super) {

    __extends(AppLayout, _super);

    function AppLayout() {
      return AppLayout.__super__.constructor.apply(this, arguments);
    }

    AppLayout.prototype.regions = {
      navigation: "body > .navigation",
      container: "body > .container"
    };

    return AppLayout;

  })(Backbone.Marionette.AppLayout);

  WeekDayHeader = (function(_super) {

    __extends(WeekDayHeader, _super);

    function WeekDayHeader() {
      return WeekDayHeader.__super__.constructor.apply(this, arguments);
    }

    WeekDayHeader.prototype.template = '#weekday-header-template';

    return WeekDayHeader;

  })(Backbone.View);

  TaskView = (function(_super) {

    __extends(TaskView, _super);

    function TaskView() {
      return TaskView.__super__.constructor.apply(this, arguments);
    }

    TaskView.prototype.tagName = 'tr';

    TaskView.prototype.template = '#task-template';

    return TaskView;

  })(Backbone.Marionette.ItemView);

  TasksView = (function(_super) {

    __extends(TasksView, _super);

    function TasksView() {
      return TasksView.__super__.constructor.apply(this, arguments);
    }

    TasksView.prototype.tagName = 'table';

    TasksView.prototype.id = 'tasksView';

    TasksView.prototype.template = '#tasks-template';

    TasksView.prototype.itemView = TaskView;

    TasksView.prototype.appendHtml = function(collectionView, itemView) {
      return collectionView.$("tbody").append(itemView.el);
    };

    return TasksView;

  })(Backbone.Marionette.CompositeView);

  CheckView = (function(_super) {

    __extends(CheckView, _super);

    function CheckView() {
      return CheckView.__super__.constructor.apply(this, arguments);
    }

    CheckView.prototype.tagname = 'a';

    CheckView.prototype.initialize = function() {
      return this.template = _.template($('#check-template').html());
    };

    CheckView.prototype.render = function() {
      var renderedContent;
      renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    };

    return CheckView;

  })(Backbone.Marionette.ItemView);

  NavBarView = (function(_super) {

    __extends(NavBarView, _super);

    function NavBarView() {
      return NavBarView.__super__.constructor.apply(this, arguments);
    }

    NavBarView.prototype.initialize = function() {
      return this.template = _.template($('#navbar-template').html());
    };

    NavBarView.prototype.render = function() {
      var renderedContent;
      renderedContent = this.template;
      $(this.el).html(renderedContent);
      return this;
    };

    return NavBarView;

  })(Backbone.Marionette.Layout);

  /* -------------------------------------------- 
       Begin scripts.coffee 
  --------------------------------------------
  */


  $(function() {
    var $button, $select, addDropShadow, colorArray, decrementHeight, incrementHeight, name, renderColors, renderHeight, timezone;
    $(document).on(function() {
      'click';

      'a[href]:not(.delete, .delete-confirm, .target, .title)';
      return function(event) {
        event.preventDefault();
        return window.location = $(this).attr("href");
      };
    });
    $(document).on(function() {
      'tap';

      'a[href]:not(.delete, .delete-confirm, .target, .title)';
      return function(event) {
        event.preventDefault();
        return window.location = $(this).attr("href");
      };
    });
    $('section [href^=#]').click(function(e) {
      return e.preventDefault();
    });
    window.onscroll = addDropShadow;
    window.addEventListener('touchmove', addDropShadow, false);
    addDropShadow = function() {
      var header;
      header = $('.navbar');
      if (window.pageYOffset > 0) {
        return header.addClass('nav-drop-shadow');
      } else {
        return header.removeClass('nav-drop-shadow');
      }
    };
    $select = $('select#timezone');
    if ($select.data("zone") !== null) {
      $select.val($select.data("zone"));
    }
    $('input#name').keyup(function() {
      if ($(this).val().length > 1) {
        if (!$(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      } else {
        if ($(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      }
    });
    $('input#email').keyup(function() {
      var filter;
      filter = /(.+)@(.+){2,}\.(.+){2,}/;
      if (filter.test($(this).val())) {
        if (!$(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      } else {
        if ($(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      }
    });
    $('input#password').keyup(function() {
      if ($(this).val().length >= 8) {
        if (!$(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      } else {
        if ($(this).parents('.control-group').hasClass('success')) {
          return $(this).parents('.control-group').toggleClass("success");
        }
      }
    });
    if ($('div.btn-group[data-toggle-name=*]').length) {
      $('div.btn-group[data-toggle-name=*]').each(function() {
        var form, group, hidden, name;
        group = $(this);
        form = group.parents('form').eq(0);
        name = group.attr('data-toggle-name');
        hidden = $('input[name="' + name + '"]', form);
        return $('button', group).each(function() {
          var button;
          button = $(this);
          button.live('click', function() {
            return hidden.val($(this).val());
          });
          if (button.val() === hidden.val()) {
            return button.addClass('active');
          }
        });
      });
    }
    $('select[name="timezone"]').change(function(event) {
      var $button;
      $button = $('button.geolocate');
      if ($button.length) {
        return $button.css('color', '#333333');
      }
    });
    if (navigator.geolocation) {
      $('select[name="timezone"]').parent().append('<button class="btn geolocate" type="button"><i class="icon-map-marker"></i></button>');
      $button = $('button.geolocate');
      $('button.geolocate').click(function() {
        return navigator.geolocation.getCurrentPosition(function() {
          var lat, long, url, urlbase, username;
          lat = position.coords.latitude;
          long = position.coords.longitude;
          urlbase = "http://api.geonames.org/timezoneJSON?";
          username = "interstateone";
          url = urlbase + "lat=" + lat + "&" + "lng=" + long + "&" + "username=" + username;
          return $.get(url, function(data) {
            $button.css('color', 'green');
            return $('select[name="timezone"]').val(data.timezoneId);
          }).error(function() {
            return $button.css('color', 'red');
          });
        }, function(error) {
          switch (error.code) {
            case error.TIMEOUT:
              return alert('Timeout');
            case error.POSITION_UNAVAILABLE:
              return alert('Position unavailable');
            case error.PERMISSION_DENIED:
              return alert('Permission denied');
            case error.UNKNOWN_ERROR:
              return alert('Unknown error');
          }
        });
      });
    }
    jQuery.fn.reset = function() {
      return $(this).each(function() {
        return this.reset();
      });
    };
    $('a.add').click(function(e) {
      if (!$(this).children("i").hasClass("cancel")) {
        $("input#title").focus();
        $(this).children("i").animate({
          transform: 'rotate(45deg)'
        }, 'fast').toggleClass("cancel");
        $(this).css('color', "red");
        return $(this).siblings('#newtask').animate({
          opacity: 1
        }, 'fast').css("visibility", "visible");
      } else {
        $(this).children("i").animate({
          transform: ''
        }, 'fast').toggleClass("cancel");
        $(this).css('color', "#CCC");
        return $(this).siblings('#newtask').animate({
          opacity: 0
        }, 'fast', function() {
          $(this).css("visibility", "hidden");
          return $(this).reset();
        });
      }
    });
    $('#newtask > input#purpose').keypress(function(e) {
      if (e.which === 13) {
        e.preventDefault();
        $('#newtask').submit();
        return _gaq.push(['_trackEvent', 'task', 'create']);
      }
    });
    colorArray = function(numberOfRows, lightness) {
      var alpha, color, colors, hue, i, saturation, _i;
      colors = [];
      for (i = _i = 0; 0 <= numberOfRows ? _i <= numberOfRows : _i >= numberOfRows; i = 0 <= numberOfRows ? ++_i : --_i) {
        hue = i * 340 / (numberOfRows + 2);
        saturation = 0.8;
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
    renderColors();
    renderHeight = function() {
      var rows;
      rows = $('tbody').children();
      return $(rows).each(function(i) {
        var $bar, count, data, total;
        $bar = $(this).children('td.title').children('.ministat').children('.minibar');
        data = $bar.data();
        count = data.count;
        total = data.total;
        return $bar.css("height", Math.min(50 * count / total, 50));
      });
    };
    if ($('td.title').length) {
      renderHeight();
    }
    incrementHeight = function(target) {
      var $bar, data;
      $bar = $(target).parents('tr').children('td.title').children('.ministat').children('.minibar');
      data = $bar.data();
      data.count += 1;
      return renderHeight();
    };
    decrementHeight = function(target) {
      var $bar, data;
      $bar = $(target).parents('tr').children('td.title').children('.ministat').children('.minibar');
      data = $bar.data();
      data.count -= 1;
      return renderHeight();
    };
    $('#newtask').submit(function(e) {
      e.preventDefault();
      return $.post("/new", $(this).serialize(), function(data) {
        $('tbody').append(data);
        $('.hero-unit').hide();
        renderColors();
        $('a.add').children('i').animate({
          transform: ''
        }, 'fast').toggleClass("cancel");
        return $('a.add').css('color', "#CCC").siblings('#newtask').animate({
          opacity: 0
        }, 'fast', function() {
          return $(this).reset();
        });
      }, "text");
    });
    $(document).on("click", 'a.delete', function(e) {
      return $(this).siblings(".deleteModal").modal();
    });
    $(document).on("click", 'a.delete-confirm', function(e) {
      var clicked;
      clicked = this;
      e.preventDefault();
      return $.post(clicked.href, {
        _method: 'delete'
      }, function(data) {
        $(this).parents(".deleteModal").modal('hide');
        return window.location.pathname = "/";
      }, "script");
    });
    $(document).on("click", ".delete-confirm", function() {
      return $('.delete-confirm').button('loading');
    });
    $(document).on("click", 'a.target', function(e) {
      var clicked;
      clicked = this;
      e.preventDefault();
      $(clicked).children('img').toggleClass("complete");
      if ($(clicked).children('img').hasClass("complete")) {
        incrementHeight(clicked);
        _gaq.push(['_trackEvent', 'check', 'complete']);
      } else {
        decrementHeight(clicked);
        _gaq.push(['_trackEvent', 'check', 'uncomplete']);
      }
      return $.post(clicked.href, null, function(data) {
        if (data !== '') {
          $(clicked).children('img').toggleClass("complete");
          if ($(clicked).children('img').hasClass("complete")) {
            return incrementHeight(clicked);
          } else {
            return decrementHeight(clicked);
          }
        }
      }).error(function() {
        return $(clicked).children('img').toggleClass("complete");
      });
    });
    $('button.forgot').click(function(e) {
      e.preventDefault();
      $(this).parents('form').attr("action", '/forgot');
      return $(this).parents('form').submit();
    });
    timezone = jstz.determine();
    name = timezone.name();
    return $('input#timezone').val(name);
  });

}).call(this);
