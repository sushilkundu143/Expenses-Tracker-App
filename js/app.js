var app = angular.module('expensesApp', ['ngRoute']);

//helper
var myHelpers = {
    //from http://stackoverflow.com/questions/2280104/convert-javascript-to-date-object-to-mysql-date-format-yyyy-mm-dd
    dateObjToString: function(dateObj) {
      var year, month, day;
      year = String(dateObj.getFullYear());
      month = String(dateObj.getMonth() + 1);
      if (month.length == 1) {
          month = "0" + month;
      }
      day = String(dateObj.getDate());
      if (day.length == 1) {
          day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    },
    stringToDateObj: function(string) {
      return new Date(string.substring(0,4), string.substring(5,7) - 1, string.substring(8,10));
    }
  };

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/expenses.html",
            controller: "ExpensesViewCtrl"
        })
        .when("/expenses", {
            templateUrl: "views/expenses.html",
            controller: "ExpensesViewCtrl"
        })
        .when("/newForm", {
            templateUrl: "views/newForm.html",
            controller: "FormViewCtrl"
        })
        .when("/edit/:id", {
            templateUrl: "views/newForm.html",
            controller: "FormViewCtrl"
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('HomeViewCtrl', function ($scope) {
    $scope.titleheading = 'Simple Expenses Tracker';
});

app.factory('Expenses', function () {
    var service = {};
    service.entries = [{
            id: 1,
            description: 'food',
            amount: 10,
            date: '2014-10-01'
        },
        {
            id: 2,
            description: 'tickets',
            amount: 11,
            date: '2014-10-02'
        },
        {
            id: 3,
            description: 'food',
            amount: 12,
            date: '2014-10-03'
        },
        {
            id: 4,
            description: 'phone credit',
            amount: 13,
            date: '2014-10-04'
        },
        {
            id: 5,
            description: 'bills',
            amount: 14,
            date: '2014-10-05'
        },
        {
            id: 6,
            description: 'food',
            amount: 15,
            date: '2014-10-06'
        },
    ];
    service.save = function (entry) {
        service.entries.push(entry);
    }
    return service;
})

app.controller('ExpensesViewCtrl', function ($scope, Expenses) {
    $scope.expenses = Expenses.entries;
});


app.controller('FormViewCtrl', function ($scope, $routeParams, $location, Expenses) {
    $scope.titleheading = 'hello';
    $scope.id = $routeParams.id;
    if (!$routeParams.id) {
        $scope.entries = {
            id: 7,
            description: 'new food',
            amount: 10,
            date: new Date()
        }
    }
    $scope.save = function () {
        Expenses.save($scope.entries);
        $location.path('/');
    }
});