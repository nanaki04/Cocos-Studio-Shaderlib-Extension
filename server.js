(function() {
	var express = require('express');
	var bodyParser = require('body-parser');
	var projectHandler = require('./data/projectHandler');
	var fileHandler = require('./data/fileHandler');
	var nodeHandler = require('./data/nodeHandler');
	var paths = require('./communication/paths');
	var progressHandler = require('./utility/progressHandler');
	var actionHandler = require('./actions/actionHandler');
	var selectionHandler = require('./data/selectionHandler');
  var shaderHandler = require('./data/shaderHandler');
  var materialHandler = require('./data/materialHandler');
	var api = express();

	api.use(bodyParser.json());
	api.use(express.static('simulator'));
	api.use(express.static('editor/resources'));
	api.use(express.static('editor/sources'));
	api.use(express.static('communication'));
	api.use(express.static('utility'));
	api.use(express.static('data'));
	api.use(express.static('projects'));
	api.use(express.static('config'));

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
		fileHandler.getJSONs(function(filesMap) {
			response.end(JSON.stringify(filesMap));
		});
	});

	api.post(paths.list.files, function(request, response) {
		var path = request.body.path;
		var currentSelection;
		progressHandler.createTracker(path)
			.add(fileHandler.updateCurrentlyLoadedFile)
			.add(fileHandler.generateResourceFile)
			.add(function(_path, done) {
				selectionHandler.getCurrentSelection(function(_currentSelection) {
					currentSelection = _currentSelection;
					done();
				});
			})
			.onEnd(function() {
				response.send(JSON.stringify({currentSelection: currentSelection}));
			});
	});

	api.get(paths.list.nodes, function(request, response) {
		nodeHandler.getNodeList(function(nodeList) {
			response.send(JSON.stringify(nodeList));
		});
	});

  api.post(paths.list.selection, function(request, response) {
    var type = request.body.type;
    var identifier = request.body.identifier || "currentSelection";

    if (type === "get") {
      selectionHandler.getSelection(identifier, function(selection) {
        response.send(JSON.stringify({selection: selection}));
      });
      return;
    }

    var selection = request.body.selection;
    selectionHandler.saveSelection(selection, identifier, function() {
      response.send(JSON.stringify({result: true}));
    });
  });

	api.post(paths.list.action, function(request, response) {
		actionHandler.handleAction(request.body.action, request.body.actionParameters, function(result) {
			response.send(JSON.stringify({result: result || true}));
		});
	});

	api.get(paths.list.shaders, function(request, response) {
    shaderHandler.getShaderList(function(shaderList) {
      response.send(JSON.stringify(shaderList));
    })
  });

	api.get(paths.list.materials, function(request, response) {
    materialHandler.getMaterialDataFile(function(fileData) {
      console.log(fileData);
      response.send(JSON.stringify(fileData));
    });
	});

	api.listen(1337, function() {
		console.log("server started");
	});
})();
