var queryBuilderModule = angular.module("queryBuilder",[]);


queryBuilderModule.controller('dropdowntest', function($scope){
	$scope.fruits = [
	                 	{
	                 		text: "apple",
	                 		value: 0
	                 	},
	                 	{
	                 		text: "orange",
	                 		value: 1
	                 	},
	                 	{
	                 		text: "mango",
	                 		value: 2
	                 	},
	                 	{
	                 		text: "banana",
	                 		value: 3
	                 	}
	                 ];
	
	
	$scope.king = 2;
});

queryBuilderModule.directive('dropdown', function(){
	return function(scope, ele, attrs){
		var containerEle = angular.element('<div class="dropdown"></div>');
		var primaryButton = angular.element('<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dinesh</button>');
		containerEle.append(primaryButton);	
		ele.empty();
		ele.append(containerEle);
		console.log(attrs.selected);
		setTimeout(function(){
			ele.attr("selectedOption",ele.attr("selectedOption") + 'd');			
		}, 1000);		
	}
});