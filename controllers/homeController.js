(function (homeController) {
	var data = require("../data");
	var auth = require("../auth");
	homeController.init = function (app) {
		app.get("/",
			auth.ensureAuthenticated,
			function (req, res) {
				data.getNoteCategories(function (err, results) {
					res.render("index",
						{
							title: "Express + Vash + Grunt",
							error: err,
							categories: results,
							newCatError: req.flash("newCateName"),
							user: req.user
						});
				});
			});

		app.get("/notes/:categoryName", function (req, res) {
			var categoryName = req.params.categoryName;
			res.render("notes", { title: categoryName });
		});

		app.post("/newCategory", auth.ensureAuthenticated, function (req, res) {
			var categoryName = req.body.categoryName;
			data.createNewCategory(categoryName, function (err) {
				if (err) {
					console.log(err);
					req.flash("newCateName", err);
					res.redirect("/");
				} else {
					res.redirect("/notes/" + categoryName);
				}
			});
		});
	};

})(module.exports);
