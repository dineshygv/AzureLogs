var fs = require('fs');
var tedious = require('./tdsQuery');
var async = require('async');

function getMasterTables(tableFileName, callback){
	fs.readFile(tableFileName, function(err, data){
		if(!err){
			var masterTables = JSON.parse(data);
			callback(null, masterTables);
		}else{
			console.log(err);
			callback(null);
		}
	});
}

function getTableList(masterTableName, callback){	
	var queryTail = " where table_name LIKE '" + masterTableName + "%'";
	var query = "select table_name from dbo.information_schema.tables"  + queryTail;
	tedious(query, function(result){
		var valueList = [];
		if(result && result.length){
			result.forEach(function(columns){
				if(columns && columns.length){
					columns.forEach(function(cell){
						valueList.push(cell.value);
					});
				}
			});
		}
		callback(valueList);
	});
}

function getColumnsList(childTableName, callback){
	var tablesList = [];
	var queryTail = " where table_name = '" + childTableName + "'";
	var query = "select column_name,data_type from dbo.information_schema.columns"  + queryTail;
	tedious(query, function(result){	
		var valueList = [];
		if(result && result.length){
			result.forEach(function(columns){
				if(columns && columns.length){					
					var column = {
						columnName : columns[0].value,
						dataType: columns[1].value
					};
					
					valueList.push(column);
				}
			});
		}
		callback(valueList);
	});
}

function getChildTables(masterTables, getChildTablesCallback){
	var schema = {};
	
	var queryChildTablesIterator = function(masterTableName, callback){
		getTableList(masterTableName, function(tableList){
			if(tableList && tableList.length){
				callback(null, tableList);
			}else{
				callback(null, []);
			}
		});
	};
	
	async.map(masterTables, queryChildTablesIterator, function(err, childTablesArray){
		masterTables.forEach(function(masterTable, masterTableIndex){
			schema[masterTable] = {};
			schema[masterTable].tables = childTablesArray[masterTableIndex];
		});	
		getChildTablesCallback(schema);
	});
}

function getColumns(schema, getColumnsCallback){
	
	var queryColumnsIterator = function(childTableObject, callback){
		getColumnsList(childTableObject.childTableName, function(columnsList){
			if(columnsList && columnsList.length){
				callback(null, columnsList);
			}else{
				callback([]);
			}
		});
	};
	
	var childTableList = [];
	for(var masterTable in schema){
		if(schema.hasOwnProperty(masterTable)){
			childTableList.push({
				childTableName:schema[masterTable].tables[0],
				masterTableName: masterTable
			});
		}		
	}
	
	async.map(childTableList, queryColumnsIterator, function(err, columnsArray){
		childTableList.forEach(function(childTableObject, index){
			schema[childTableObject.masterTableName].columns = columnsArray[index];
		});
		
		getColumnsCallback(schema);
	});
}

function buildSchemaAsync(callback){
	getMasterTables("./tables.json", function(err, masterTableNameList){
		if(!err && masterTableNameList && masterTableNameList.length){
			getChildTables(masterTableNameList, function(schema){
				getColumns(schema, function(){
					callback(schema);
				});
			});
		}
	});
}

module.exports = buildSchemaAsync;
