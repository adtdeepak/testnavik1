angular.module('DecisionWorkbench')

.controller( "overviewController", function($scope, DataService, CustomService, ChartOptionsService, $rootScope, UtilitiesService, $location) {

	$scope.userGroupDropdownText = 'Creative Agencies';
	$scope.featureDropdownText = '3rd Party integration API';
	$scope.rowClicked = function(attribute){
		console.log("clicked controller:", attribute);
		window.location = "#/overview-details?selectedGroup="+attribute;
	}

	$scope.wishlistSelected = function(attribute, isSelected){
		console.log("attribute",attribute);
		var selectedId = attribute.split('=')[1];
		selectedId = selectedId.split('&')[0];
		$.each($scope.fullResponse.data.bestCampaignOptions, function(key, value){
			if(key == "All Users"){
				$.each(value, function(index, eachRow){
					if(eachRow.id == selectedId){
						eachRow.wishlist = isSelected;
						selectedGroup = eachRow.userGroup;
					}
				})
			}
		})
		console.log("selectedGroup:", selectedGroup);
		$.each($scope.fullResponse.data.bestCampaignOptions, function(key, value){
			if(key == selectedGroup){
				$.each(value, function(index, eachRow){
					if(eachRow.id == selectedId){
						eachRow.wishlist = isSelected;
						selectedGroup = eachRow.userGroup;
					}
				})
			}
		})
		localStorage.setItem('OverviewDetails', JSON.stringify($scope.fullResponse));
	}
	
	$scope.executeSelected = function(attribute, isSelected){
		console.log("attribute executeSelected",attribute, isSelected);
		var selectedId = attribute.split('=')[1];
		selectedId = selectedId.split('&')[0];
		$.each($scope.fullResponse.data.bestCampaignOptions, function(key, value){
			if(key == "All Users"){
				$.each(value, function(index, eachRow){
					if(eachRow.id == selectedId){
						eachRow.selected = isSelected;
						selectedGroup = eachRow.userGroup;
					}
				})
			}
		});
		
		$.each($scope.fullResponse.data.bestCampaignOptions, function(key, value){
			if(key == selectedGroup){
				$.each(value, function(index, eachRow){
					if(eachRow.id == selectedId){
						eachRow.selected = isSelected;
						selectedGroup = eachRow.userGroup;
					}
				})
			}
		})
		localStorage.setItem('OverviewDetails', JSON.stringify($scope.fullResponse));
	}
	
	
	$scope.overallDataSuccess = function(response){
		$scope.overallResponse = response.data;
		$scope.addData(response.data['All Users']);
		$scope.clickUserGroup($scope.userGroupDropdownText);
		$scope.clickFeature($scope.featureDropdownText);
		$scope.addUserGroupsTableData(response.data.jobHoppers);
		$scope.addFeaturesTableData(response.data.photographers);
	};
	
	$scope.innerPageDataSuccess = function(response){
		$scope.fullResponse = response;
	};
	
	$scope.options = UtilitiesService.getDataTableOptions();
	$scope.userTableOptions = UtilitiesService.getDataTableOptions();
	$scope.featuresOptions = UtilitiesService.getDataTableOptions();
	var columOptions = {
			"aoColumns" : [ {
				"sClass" : "each-row-details"
			}, {
				"sClass" : "each-row-details"
			}, {
				"sClass" : "each-row-details"
			}, {
				"sClass" : "each-row-details"
			},null, null],
			'fnCreatedRow': function (nRow, aData, iDataIndex) {
				  $.each($('td', nRow), function (colIndex) {
					  if(aData){
						  $(this).attr('attr', 'All Users&selectedId='+aData[0]+'&type='+aData[6]);
					  }
			            // For example, adding data-* attributes to the cell
			           /* $(this).attr('attr', "Enterprise users");*/
			        });
		    },
		    "bPaginate":false,
			"fnRowCallback" : function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				if(iDisplayIndex%2 != 0){
					className = "oddRowColor";
				}else{
					className = "evenRowColor";
				}
				$(nRow).addClass(className);
			}
		};
		$.extend(true, $scope.options, columOptions);
		var columOptionsAttr = {
				"aoColumns" : [ {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				},null, null],
				'fnCreatedRow': function (nRow, aData, iDataIndex) {
					  $.each($('td', nRow), function (colIndex) {
						  if(aData[1]){
							  $(this).attr('attr', aData[1].split('<br>ES')[0]+'&selectedId='+aData[0]+'&type='+aData[6]);
						  }
				            // For example, adding data-* attributes to the cell
				           /* $(this).attr('attr', "Enterprise users");*/
				        });
			    },
			    "bPaginate":false,
				"fnRowCallback" : function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
					if(iDisplayIndex%2 != 0){
						className = "oddRowColor";
					}else{
						className = "evenRowColor";
					}
					$(nRow).addClass(className);
				}
			};
		$.extend(true, $scope.userTableOptions, columOptionsAttr);
		var columOptionsFeatures = {
				"aoColumns" : [ {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				}, {
					"sClass" : "each-row-details"
				},null, null],
				'fnCreatedRow': function (nRow, aData, iDataIndex) {
					  $.each($('td', nRow), function (colIndex) {
						  if(aData[6]){
							  $(this).attr('attr', aData[7]+'&selectedId='+aData[0]+'&type='+aData[6]);
						  }
				            // For example, adding data-* attributes to the cell
				           /* $(this).attr('attr', "Enterprise users");*/
				        });
			    },
			    "bPaginate":false,
				"fnRowCallback" : function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
					if(iDisplayIndex%2 != 0){
						className = "oddRowColor";
					}else{
						className = "evenRowColor";
					}
					$(nRow).addClass(className);
				}
			};
		$.extend(true, $scope.featuresOptions, columOptionsFeatures);

	
	$scope.addData = function(data) {
	    $rootScope.builddoLoad = true;
		$scope.dataLoaded = true;
		if (!data)
			throw "noDataError";
		try {
			$scope.error = false;
			$scope.options.aaData = [];
			$.each(data, function(key, obj) {
				var executeSection = "<a href='resources/selected_campaign_info.xlsx' download><div class='execute-unselected'></div></a>";
					$scope.options.aaData.push([obj.id, obj.userGroup,  obj.description, obj.impact,
					                           "<div class='wishlist-unselected'></div>" , executeSection, obj.campaignType]);
				})
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	$scope.clickUserGroup = function(selectedUserGroup){
		console.log("selectedUserGroup:", selectedUserGroup);
		$scope.addUserGroupsTableData($scope.overallResponse[selectedUserGroup]);
	}
	
	$scope.addUserGroupsTableData = function(data) {
	    $rootScope.builddoLoad = true;
		$scope.dataLoaded = true;
		if (!data)
			throw "noDataError";
		try {
			$scope.error = false;
			$scope.userTableOptions.aaData = [];
			$.each(data, function(key, obj) {
					$scope.userTableOptions.aaData.push([obj.id, obj.userGroup,  obj.description, obj.impact,
					                           "<div class='wishlist-unselected'></div>" ,"<div class='execute-unselected'></div>", obj.campaignType ]);
				})
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	

	$scope.clickFeature = function(selectedFeature){
		$scope.addFeaturesTableData($scope.overallResponse[selectedFeature], selectedFeature);
	}
	$scope.addFeaturesTableData = function(data, selectedFeature) {
	    $rootScope.builddoLoad = true;
		$scope.dataLoaded = true;
		if (!data)
			throw "noDataError";
		try {
			$scope.error = false;
			$scope.featuresOptions.aaData = [];
			$.each(data, function(key, obj) {
					$scope.featuresOptions.aaData.push([obj.id, obj.userGroup,  obj.description, obj.impact,
					                           "<div class='wishlist-unselected'></div>" ,"<div class='execute-unselected'></div>", obj.campaignType, selectedFeature]);
				})
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	
	function getAllUserTableData() {
		var requestData = {};
		var func = $scope.overallDataSuccess; 
    	if (arguments[1]) { 
    		if (arguments[1].key == cacheKey) { 
    			func = null; 
    		} else { 
    			return false; 
    		} 
    	} 
    	DataService.getAllUserData(requestData, func, $scope.fail); 
	
	} 
	
	function getInnerPageData() {
		var requestData = {};
		var func = $scope.innerPageDataSuccess; 
    	if (arguments[1]) { 
    		if (arguments[1].key == cacheKey) { 
    			func = null; 
    		} else { 
    			return false; 
    		} 
    	} 
    	DataService.getOverviewDetailsData(requestData, func, $scope.fail); 
	
	} 
	getInnerPageData();
	getAllUserTableData();
	
})


	