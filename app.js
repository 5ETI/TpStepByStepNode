"use strict";

console.log("It works !");

var  path  =  require("path");
var fs = require("fs");
var  express  =  require("express");
var SlideModel = require("./app/models/slid.model.js");
var bodyParser = require('body-parser');
var  http  =  require("http");
var  CONFIG  =  require("./config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
var util = require("./utils.js");
var  defaultRoute  =  require("./app/routes/default.route.js");

var  app  =  express();

// init server
var  server  =  http.createServer(app);
server.listen(CONFIG.port);

app.use(defaultRoute);
app.use("/admin",express.static(path.join(__dirname, "/public/admin")));
app.use("/login",express.static(path.join(__dirname, "/public/login")));

app.get("/loadPres",  function (request, response) {

	var jsonData = {};

	fs.readdir(CONFIG.contentDirectory, function (err, files) {
		if (err) {
			console.err(response.statut(500).end);
			return response.statut(500).end;
		}
		var filteredFiles;
		files.filter(function (file) {
			filteredFiles = files.filter(extension);
		});

		var compteur = 0;
		filteredFiles.forEach(function (file) {

			fs.readFile(CONFIG.contentDirectory + '/' + file, 'utf8', function(err,data) {  
				if (err) throw err;
				var obj = JSON.parse(data);
				var Id = obj["id"];

				jsonData[Id] = obj;
				compteur ++;
				if (compteur == filteredFiles.length) returnJson();
			});
		});
	});

	function returnJson(){

		response.send(jsonData);

	}

});


function extension(element) {
	var extName = path.extname(element);
	return extName === '.json'; 
};


app.use(bodyParser.json());

app.post("/savePres",  function (request, response) {

	request.accepts('application/json');
	var presJson = request.body;

	console.log(presJson);
	var Id = presJson["id"];
	console.log(Id);

	fs.writeFile(path.join(CONFIG.presentationDirectory, Id + ".meta.json"), JSON.stringify(presJson), (err) => {
		if (err) {
			console.err(response.statut(500).end);
			return response.statut(500).end;
		}

		response.end('SAVED: ' + Id);
	});


});










