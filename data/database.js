(function (database) {

	var mongodb = require("mongodb");
	var mongoUrl = "mongodb://localhost:27017/dotNetCommunity";
	var thedb = null;

	database.getDb = function (next) {
		if (!thedb) {
			mongodb.MongoClient.connect(mongoUrl, function (err, db) {
				if (err) {
					next(err, null)
				} else {
					thedb = {
						db: db,
						notes: db.collection("notes"),
						users: db.collection("users")
					};
					next(null, thedb);
				}
			})
		} else {
			next(null, thedb);
		}
	}

})(module.exports)