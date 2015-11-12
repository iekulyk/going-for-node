//notesView.js
(function (angular) {

	var notesView = angular.module("notesView", ["ui.bootstrap"]);

	notesView.controller("notesViewController",
		["$scope", "$http", "$window",
			function ($scope, $http, $window) {
				$scope.notes = [];
				$scope.newNote = {
					note: "",
					color: "yellow"					
				};

				var urlParts = $window.location.pathname.split("/")
				var categoryName = urlParts[urlParts.length - 1]

				var notesUrl = "/api/notes/" + categoryName;
				$http.get(notesUrl).
					then(function (result) {
						$scope.notes = result.data;
					}, function (err) {
						alert(err);
					});

			}]);

})(window.angular);
