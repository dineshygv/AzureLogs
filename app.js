//node
var express = require("express");
var fs = require("fs");
var bodyParser = require('body-parser');

//user
var buildSchema = require("./buildSchema");
var sqlQueryBuilder = require("./sqlQueryBuilder");
var tedious = require('./tdsQuery');

//json
var tables = require('./tables');
var schema = require('./schema');
var operators = require('./operators');

var app = express();

app.set('view engine', 'ejs');

function sendFile(path, res){
	var filePath = __dirname + path;
	fs.exists(filePath, function(exists){
		if(exists){
			res.sendFile(filePath);
		}else{
			res.sendStatus(404);
		}
		
	});
}

app.get("/www/*", function(req, res){
	sendFile(req.path, res);
});

function parseSqlQueryResult(result){
	if(!result || !result.length){
		return [];
	}
	
	var rows = [];
	for(var rowIndex in result){		
		var row = result[rowIndex];
		if(!row.length){
			continue;
		}
		
		var columnData = {};
		for(var colIndex in row){
			var column = row[colIndex];
			
			if(!column.metadata){
				continue;
			}
			
			var colName = column.metadata.colName;
			var value = column.value;
			
			columnData[colName] = value;
		}
		
		rows.push(columnData);
	}
	
	return rows;
}

app.get("/", function(req, res){
	res.render(__dirname + '/www/views/home', {
		tables: JSON.stringify(tables),
		schema: JSON.stringify(schema),
		operators: JSON.stringify(operators)
	});
});

app.use(bodyParser.json());

app.post("/runQuery", function(req, res){	
	var sqlQuery = sqlQueryBuilder(req.body);
	tedious(sqlQuery, function(result){
		var parsedData = parseSqlQueryResult(result);
		res.json(parsedData);
	});
});


app.get("/rebuildschema", function(req, res){
	buildSchema(function(schema){
		var stringifiedSchema = JSON.stringify(schema, null, " ");
		
		fs.writeFile("schema.json", stringifiedSchema, function(err){
			if(!err){
				res.send(stringifiedSchema);
			}else{
				res.send(JSON.stringify(err, null, " "));
			}
		});
	});
});

var portNo = 3000;
app.listen(portNo);
console.log("server started on port " + portNo);
