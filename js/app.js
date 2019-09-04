var app = angular.module('expensesApp', ['ngRoute']);

//helper
var myHelpers = {
    //from http://stackoverflow.com/questions/2280104/convert-javascript-to-date-object-to-mysql-date-format-yyyy-mm-dd
    dateObjToString: function (dateObj) {
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
    stringToDateObj: function (string) {
        return new Date(string.substring(0, 4), string.substring(5, 7) - 1, string.substring(8, 10));
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

app.directive('susExpense', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/expense.html'
    }
})


app.factory('Expenses', function ($http) {
    var service = {};
    service.entries = [];

    $http.get('js/data.json').then(function successCallback(response) {
          console.log('response', response);
          service.entries = response.data;
          service.entries.forEach(function (element) {
            element.date = myHelpers.stringToDateObj(element.date);
         })
        }, function errorCallback(response) {
            console.log('response:', response);
            alert(response.statusText);
        });

    service.getById = function (id) {
        return service.entries.filter(x => x.id == id)[0];
    }

    service.getNewId = function () {
        if (service.newId) {
            service.newId++;
        } else {
            var max = Math.max(...service.entries.map(x => x.id));
            service.newId = max + 1;
        }
        return service.newId;
    }

    service.save = function (entry) {
        var toUpdate = service.getById(entry.id);
        console.log('service.entries:', service.entries);
        if (toUpdate) {
            console.log('entry:', entry);
            service.entries = service.entries.map(item =>{
                if(item.id == entry.id){
                    item = entry;
                }
                return item;
            });
        } else {
            entry.id = service.getNewId();
            service.entries.push(entry);
        }
    }

    service.remove = function (entry) {
        service.entries = service.entries.filter(el => el.id !== entry.id);
    }

    return service;
})

app.controller('HomeViewCtrl', function ($scope) {
    $scope.titleheading = 'Simple Expenses Tracker';
});

app.controller('ExpensesViewCtrl', function ($scope, Expenses) {
    $scope.expenses = Expenses.entries;
    $scope.remove = function (expense) {
        console.log('current entry:', expense);
        Expenses.remove(expense);
    }
    $scope.$watch(function () {
            return Expenses.entries
        },
        function (entries) {
            $scope.expenses = entries;
        });
});


app.controller('FormViewCtrl', function ($scope, $routeParams, $location, Expenses) {
    $scope.titleheading = 'hello';
    $scope.entries = {};
    if (!$routeParams.id) {
        $scope.entries.date = new Date();
    } else {
        angular.copy(Expenses.getById($routeParams.id), $scope.entries);
    }

    $scope.save = function () {
        Expenses.save($scope.entries);
        $location.path('/');
    }
});