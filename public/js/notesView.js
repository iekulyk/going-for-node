//notesView.js
(function (angular) {

	var notesView = angular.module("notesView", ["ui.bootstrap"]);

	notesView.controller("notesViewController",
		["$scope", "$http", "$window",
			function ($scope, $http, $window) {
				$scope.notes = [];
				$scope.newNote = createBlankNote();

				var urlParts = $window.location.pathname.split("/")
				var categoryName = urlParts[urlParts.length - 1]

				var notesUrl = "/api/notes/" + categoryName;
				$http.get(notesUrl).
					then(function (result) {
						$scope.notes = result.data;
					}, function (err) {
						alert(err);
					});

				$scope.save = function () {

					$http.post(notesUrl, $scope.newNote)
						.then(function (result) {
							$scope.notes.push(result.data);
							$scope.newNote = createBlankNote();
						}, function (err) {
							alert(err);
						});

				};

			}]);

	var createBlankNote = function () {
		return {
			note: "",
			color: "yellow"
		};
	};

})(window.angular);
