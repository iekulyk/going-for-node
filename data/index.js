(function (data) {

	var seedData = require("./seedData");
	var database = require("./database");

	data.getNoteCategories = function (next) {
		database.getDb(function (err, db) {
			if (err) {
				next(err);
			} else {
				db.notes.find().sort({ name: 1 }).toArray(function (err, results) {
					if (err) {
						next(err);
					} else {
						next(null, results);
					}
				});
			}
		});
	};

	data.addNote = function (categoryName, newNote, next) {
		database.getDb(function (err, db) {
			if (err) {
				next(err);
			} else {
				db.notes.update({ name: categoryName }, { $push: { notes: newNote } }, next);
			}
		})
	}

	data.getNotes = function (categoryName, next) {
		database.getDb(function (err, db) {
			if (err) {
				next(err);
			} else {
				db.notes.findOne({ name: categoryName }, next);
			}
		})
	}

	data.createNewCategory = function (categoryName, next) {
		database.getDb(function (err, db) {
			if (err) {
				next(err);
			} else {
				db.notes.find({ name: categoryName }).count(function (err, count) {
					if (err) {
						next(err);
					} else {
						if (count != 0) {
							next("Already exists")
						} else {
							var cat = {
								name: categoryName,
								notes: []
							};
							db.notes.insert(cat, function (err) {
								if (err) {
									next(err);
								} else {
									next(null);
								}
							});
						}
					}
				});
			}
		})
	};

	data.addUser = function (user, next) {
		database.getDb(function (err, db) {
			if (err) {
				console.log("Failed : " + err)
			} else {
				db.users.insert(user, next);
			}
		})
	}

	data.getUser = function (username, next) {
		database.getDb(function (err, db) {
			if (err) {
				console.log("Failed : " + err)
			} else {
				db.users.findOne({ username: username }, next)
			}
		})
	}

	function seedDatabase() {
		database.getDb(function (err, db) {
			if (err) {
				console.log("Failed : " + err)
			} else {
				db.notes.count(function (err, count) {
					if (err) {
						console.log("Failed : " + err)
					} else {
						if (count == 0) {
							console.log("Seeding the Database");
							seedData.initialNotes.forEach(function (item) {
								db.notes.insert(item, function (err) {
									if (err) console.log("Failed : " + err);
								})
							});
						} else {
							console.log("Database already seeded");
						}
					}
				});
			}
		})
	};
	seedDatabase();

})(module.exports)