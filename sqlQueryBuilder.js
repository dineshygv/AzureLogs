function buildTimeQuery(start, end){
	var startStatement = "precisetimestamp > '" + start + "'";
	var endStatement = "precisetimestamp < '" + end + "'";
	return startStatement + " AND " + endStatement;
}

function buildConditionsQuery(conditions){
	if(!conditions || !conditions.length){
		return "";
	}
	
	var conditionStatements = [];
	for(var index in conditions){
		var condition = conditions[index];
		var conditionStatement = condition.Field + " " + condition.Operator + " '" + condition.Value + "'";
		if(condition.Connector){
			conditionStatement += " " + condition.Connector;
		}
		conditionStatements.push(conditionStatement);
		if(!condition.Connector){
			break;
		}
	}
	
	return conditionStatements.join(" ");
}

function buildTableQueries(roles, time, condition){
	if(!roles || !roles.length){
		return "";
	}
	
	var tableQueries = [];
	
	for(var index in roles){
		var role = roles[index];
		var tableName = "dbo.dbo." + role;
		var tableStatement = "SELECT * FROM " + tableName + " where " + time + " AND " + condition;
		tableQueries.push(tableStatement);
	}
	
	return tableQueries;
}

function buildFullQuery(queries){
	if(!queries || !queries.length){
		return "";
	}	
	
	return queries.join(" UNION ");
}

function buildQuery(request) {	
	var timeQuery = buildTimeQuery(request.StartDate, request.EndDate);
	var conditionsQuery = buildConditionsQuery(request.Query);
	var tableQueries = buildTableQueries(request.Roles, timeQuery, conditionsQuery);
	var fullQuery = buildFullQuery(tableQueries);
	return fullQuery;
}

module.exports = buildQuery;