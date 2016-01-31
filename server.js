(function() {
	var express = require('express');
	var bodyParser = require('body-parser');
	var projectHandler = require('./data/projectHandler');
	var fileHandler = require('./data/fileHandler');
	var paths = require('./communication/paths');
	var api = express();

	api.use(bodyParser.json());
	api.use(express.static('simulator'));
	api.use(express.static('editor/resources'));
	api.use(express.static('editor/sources'));
	api.use(express.static('communication'));

	api.get('/', function(request, response) {
		response.send('default');
	});

	api.get(paths.list.simulator, function(request, response) {
		response.sendFile(__dirname + "/simulator/index.html");
	});

	api.get(paths.list.editor, function(request, response) {
		response.sendFile(__dirname + "/editor/editor.html");
	});

	api.get(paths.list.projects, function(request, response) {
		projectHandler.getProjects(function(err, projects) {
			if (err) {
				response.send(err);
				return;
			}
			response.end(JSON.stringify(projects));
		});
	});

	api.post(paths.list.projects, function(request, response) {
		var type = request.body.type;
		var project = request.body.project;
		projectHandler[type + "Project"](project, function(result) {
			response.send(JSON.stringify({result: result}));
		});
	});

	api.get(paths.list.files, function(request, response) {
		fileHandler.getFiles(function(filesMap) {
			response.end(JSON.stringify(filesMap));
		});
	});

	api.listen(1337, function() {
		console.log("server started");
	});
})();
