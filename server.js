var http = require("http");
var express = require("express");
var app = express();
var controllers = require("./controllers");
var updater = require("./updater");
var bodyParser = require('body-parser');
var flash = require("connect-flash");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var auth = require('./auth');

//var ejsEngine = require("ejs-locals");
// var server = http.createServer(function (req, res) {
// 	console.log(req.url);
// 	res.write("<html><body><h1>" + req.url + "</h1></body></html>");
// 	res.end();
// });
// 

//app.set("view engine", "jade");
// app.engine("ejs", ejsEngine); //support master pages
// app.set("view engine", "ejs"); //set view engine
app.set("view engine", "vash");

//Opt into Services
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "ikulyk" }));
app.use(flash());

//set public folder
app.use(express.static(__dirname + "/public"));

// app.get("/", function (req, res) {
// 	res.send("<html><body><h1>Express</h1></body></html>");
// 	res.render("jade/index", { title: "Express + Jade" });
// 	res.render("ejs/index", { title: "Express + EJS" });
// 	res.render("index", { title: "Express + Vash" });
// });

//set auth
auth.init(app);

//set controllers
controllers.init(app);

app.get("/api/users", function (req, res) {
	res.set("Content-Type", "application/json");
	res.send({ name: "Evgeniy", isValid: true, group: "Dev" });
});

app.get("/api/sql", function (req, res) {
	var sql = require("msnodesql");
	var connection = "Driver={SQL Server Native Client 11.0};Server=.\\sqlexpress12;Database=''";

	sql.query(connection, "SELECT * FROM Devs", function (err, result) {
		res.sende(result);
	})
});

var server = http.createServer(app);
server.listen(8083);

updater.init(server);