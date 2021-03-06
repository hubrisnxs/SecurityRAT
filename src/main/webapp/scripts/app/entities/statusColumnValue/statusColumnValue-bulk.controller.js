'use strict';

angular.module('sdlctoolApp')
    .controller('StatusColumnValueBulkController',function($scope, $stateParams, $uibModalInstance, $filter, entity, StatusColumnValue, StatusColumn, sharedProperties) {
    	$scope.statusColumnValues = [];
    	$scope.statusColumns = [];
    	$scope.state = {
    			active: true
    	}
    	$scope.selectedStatusColumn = {
    			value: null
    	};
    	$scope.getIndeterminateForActiveButton = function() {
        	var count = 0;
        	$scope.state.active = $scope.statusColumnValues[0].active;
        	angular.forEach($scope.statusColumnValues, function(value) {
    			if(value.active === $scope.state.active) {
    				count++
    			}
        	});
        	
        	if(count !== $scope.statusColumnValues.length) {
        		delete $scope.state.active;
        	}
        }
    	$scope.toggleShowHide = function() {
        	$scope.show = !$scope.show;
        	if($scope.show) {
        		$scope.showTypes = 'Show selected values';
        		$scope.glyphicon = "glyphicon glyphicon-plus";
        	} else {
        		$scope.showTypes = 'Hide selected values';
        		$scope.glyphicon = "glyphicon glyphicon-minus";
        	}
        }
        $scope.loadAll = function() {
        	$scope.showTypes = 'Show selected values';
    		$scope.glyphicon = "glyphicon glyphicon-plus";
    		$scope.show = true;
        	$scope.statusColumnValues = sharedProperties.getProperty();
        	$scope.getIndeterminateForActiveButton();
        	StatusColumn.query(function(result) {
        		$scope.statusColumns = result;
            });
        };
        $scope.loadAll();
      	  	
        var onSaveFinished = function (result) {
            $scope.$emit('sdlctoolApp:statusColumnValueUpdate', result);
            $uibModalInstance.close(result);
        };

        $scope.save = function () {
    		angular.forEach($scope.statusColumnValues, function(value) {
    			if(angular.isDefined($scope.state.active))
    				value.active = $scope.state.active;
    			if($scope.selectedStatusColumn.value !== null) {
    				angular.forEach($scope.statusColumns, function(statColumn) {
    	        		if($scope.selectedStatusColumn.value === statColumn.id) {
    	        			value.statusColumn = statColumn;
    	        		}
    	        	});
    			}
    			StatusColumnValue.update(value, onSaveFinished);
    		});
        };
        
        $scope.clear = function() {
        	$uibModalInstance.dismiss('cancel');
        };
    });