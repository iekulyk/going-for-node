(function (auth) {
	var data = require("../data");
	var hasher = require("./hasher");

	var passport = require("passport");
	var localStrategy = require("passport-local").Strategy;

	function userVerify(username, password, next) {
		data.getUser(username, function (err, user) {
			if (!err && user) {
				var hash = hasher.computeHash(password, user.salt);
				if (hash === user.passwordHash) {
					next(null, user)
					return;
				}
			}
			next(null, false, { message: "Invalid Credentials" })
		});
	};
	
	auth.ensureAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect("/login?final=");
		}
	};
	
	auth.ensureApiAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.send(401, "Not authorized");
		}
	};
	
	auth.init = function (app) {

		passport.use(new localStrategy(userVerify));
		passport.serializeUser(function (user, next) {
			next(null, user.username);
		});
		passport.deserializeUser(function (key, next) {
			data.getUser(key, function (err, user) {
				if (err) {
					next(null, false, { message: "Failet to get user" })
				} else {
					next(null, user);
				}
			})
		});
		app.use(passport.initialize());
		app.use(passport.session());

		app.get("/register", function (req, res) {
			res.render("register", { title: "Register yourself here", message: req.flash("registrationError"),
						user: req.user })
		})

		app.post("/register", function (req, res) {

			var salt = hasher.createSalt();

			var user = {
				name: req.body.name,
				email: req.body.email,
				username: req.body.username,
				passwordHash: hasher.computeHash(req.body.password, salt),
				salt: salt
			};

			data.addUser(user, function (err) {
				if (err) {
					req.flash("registrationError", "Could not save user to database")
					res.redirect("/register");
				} else {
					res.redirect("/login");
				}
			});
		});

		app.get("/login", function (req, res) {
			res.render("login", { title: "Login yourself here", message: req.flash("loginError"),
						user: req.user })
		})

		app.post("/login", function (req, res, next) {
			var authFunc = passport.authenticate("local", function (err, user, info) {
				if (err) {
					next(err);
				} else {
					req.logIn(user, function (err) {
						if (err) {
							next(err);
						} else {
							res.redirect("/");
						}
					})
				}
			});

			authFunc(req, res, next)
		});
	};

})(module.exports);
