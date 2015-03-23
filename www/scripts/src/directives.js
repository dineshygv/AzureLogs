queryBuilderModule.directive('dropdown',function(){
	return {
		scope: {
			options: "=",
			selected: "="
		},
		template: angular.element("#dropdown-template").html(),
		link: {
			post: function(scope, element, attrs){
				element.on('click', 'li', function(){
					var self = this;
					scope.$apply(function(){
						var selectedElement = angular.element(self);
						var selectedValue = selectedElement.attr("data-value");
						scope.selected = selectedValue;
					});					
				});
			}			
		}
	};
});

queryBuilderModule.directive('datepicker',function(){
	return {
		scope: {
			selectedDate: "="
		},
		template: angular.element("#datepicker-template").html(),
		link: {
			post: function(scope, element, attrs){
				var $element = $(element.find(".date"));
				$element.datetimepicker({
					format: "YYYY/MM/DD HH:mm:ss",
					defaultDate: scope.selectedDate
				});
				
				var dataHandle = $element.data("DateTimePicker");
				$element.on("dp.change", function(e){
					scope.$apply(function(){
						scope.date = e.date.toDate();
					});					
				});
			}			
		}
	};
});

queryBuilderModule.directive('multiselect',function($timeout){
	return {
		scope: {
			options: "="
		},
		template: angular.element("#multiselect-template").html(),
		link: {
			post: function(scope, element, attrs){
				$timeout(function(){
					var $element = $(element.find("select"));
					$element.multiselect({
						includeSelectAllOption: true,
						allSelectedText: "All roles selected",
						selectAllText: 'All roles',
						maxHeight: 200,
						onChange: function(ele, newVal){
							if(ele){
								var elementIndex = angular.element(ele).attr("data-value");
								scope.$apply(function(){
									scope.options[elementIndex].selected = newVal;
								});
							}else{
								scope.$apply(function(){
									scope.options.forEach(function(option){
										option.selected = newVal;
									});
								});								
							}
						}
					});
				});
				
			}			
		}
	};
});

queryBuilderModule.directive('querymaker',function(){
	return {
		scope: {
			schema: "=",
			data: "=",
			operatorset: "=",
			connectors: "="
		},
		template: angular.element("#querymaker-template").html(),
		link: {
			post: function(scope, element, attrs){
				scope.onRemove = function(index){					
					scope.data.splice(index, 1);					
				};
				
				var newQueryButton = element.find(".new-query");
				newQueryButton.on('click', function(){
					scope.$apply(function(){
						var newItem = {
								"Field": 0,
								"Operator": 0,
								"Value": ""
							};
						
						if(scope.data.length){
							newItem.Connector = 0;
						}
						scope.data.push(newItem);						
					});										
				});				
			}			
		}
	};
});