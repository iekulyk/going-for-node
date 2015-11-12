(function (notesController) {
	var data = require("../data");
	var auth = require("../auth");

	notesController.init = function (app) {

		app.get("/api/notes/:categoryName",
			auth.ensureApiAuthenticated,
			function (req, res) {
				var categoryName = req.params.categoryName;
				data.getNotes(categoryName, function (err, notes) {
					if (err) {
						res.send(400, err);
					} else {
						res.set("Content-Type", "application/json");
						res.send(notes.notes);
					}
				})
			});

		app.post("/api/notes/:categoryName", function (req, res) {
			var categoryName = req.params.categoryName;
			var newNote = {
				note: req.body.note,
				color: req.body.color,
				author: "ikulyk",
				tags: ["Node.js", ".NET"]
			};

			data.addNote(categoryName, newNote, function (err) {
				if (err) {
					res.send(400, err);
				} else {
					res.set("Content-Type", "application/json");
					res.send(201, newNote);
				}
			})
		});

	}

})(module.exports);
