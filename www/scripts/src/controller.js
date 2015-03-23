queryBuilderModule.controller("buildQueryCtrl", function($scope, schemaSvc, utils){
	$scope.tables = utils.arrToDropdownOptions(schemaSvc.tables);	
	$scope.selectedTable = 0;
	
	$scope.startDate = new Date();
	$scope.endDate = new Date();

	var selectedTable = schemaSvc.tables[$scope.selectedTable];
	$scope.roles = utils.getRolesFromSchema(schemaSvc.schema, selectedTable);
	$scope.tableSchema = utils.getFieldsFromSchema(schemaSvc.schema, selectedTable);

	$scope.operatorSet = schemaSvc.operators;		
	$scope.connectors = schemaSvc.connectors;
	
	$scope.queryData = [];
});