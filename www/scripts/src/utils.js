queryBuilderModule.factory('utils', function(){
	var utils = {};
	
	utils.arrToDropdownOptions = function(arr){
		if(!arr.length){
			return [];
		}
		
		return arr.map(function(item){
			return {
				text: item
			};
		});
	};
	
	utils.getRolesFromSchema = function(schema, selectedTable){
		 return schema[selectedTable].tables.map(function(table){
			 return {
				 text: table.split(selectedTable)[1],
				 selected: true
			 };
		 });
	};
	
	var columnTypes = {
		"nvarchar" : 0,
		"int" : 1
	};
	
	utils.getFieldsFromSchema = function(schema, selectedTable){
		 return schema[selectedTable].columns.map(function(column){
			 return {
				 text: column.columnName,
				 type: columnTypes[column.dataType]
			 };
		 });
	};
	
	return utils;
});