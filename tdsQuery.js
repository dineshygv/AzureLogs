var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var establishedConnection;
var isConnectionActive = false;

var config = {
		userName: 'testclient',
		password: 'testclient',
		server: 'baxdev-server',
		options: {
			encrypt: true
		}
};

function getConnection(callback){
	if(isConnectionActive){
		callback(establishedConnection);
		return;
	}

	establishedConnection = new Connection(config);

	establishedConnection.on('connect', function(err) {
		if(!err){
			isConnectionActive = true;
			callback(establishedConnection);
		}else{
			callback(null);
			console.log(err);
		}
	});

	establishedConnection.on('end', function() {
		isConnectionActive = false;
	});
}


function executeStatement(sqlStatement, callback) {

	var connection = getConnection(function(obtainedConnection){
		if(obtainedConnection){
			var obtainedRows = [];
			
			var request = new Request(sqlStatement, function(err, rowCount) {
				if (err) {
					console.log(err);
					callback(null);
				}else{
					callback(obtainedRows);
				}
			});			

			request.on('row', function(rowData) {
				obtainedRows.push(rowData);
			});
			
			obtainedConnection.execSql(request);
		}else{
			callback(null);
		}
	});

}

module.exports = executeStatement;



