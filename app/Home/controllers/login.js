angular.module('Home')

.controller( "loginInit",['$scope','CustomService', function($scope, CustomService) {
	//Clearing the local storage
	localStorage.clear();
	setTimeout(function(){CustomService.appInit();},1);
	
}])

.controller('loginController',[ '$scope','DataService','UtilitiesService','RequestConstantsFactory','$location','$window',
                                function($scope, DataService, UtilitiesService, RequestConstantsFactory, $location, $window) {
	//Constants needed for requests
	var requestConstants = RequestConstantsFactory['LOGIN'];
	//Constants needed for response
	var responseConstants = RequestConstantsFactory['RESPONSE'];
	//Request Initialization
	var requestData ={};
	
	//For unauthorised user
	$scope.unauthorisedUser = false;
	var urlIndex = $location.search();

	$scope.loadingLoginResult = false;
	//Success function to be executed after response from the server
	$scope.success = function(data){
		$scope.loadingLoginResult = false;
		if(data.user){
			//Set token in local storage
			localStorage.setItem('token',data.token);
			UtilitiesService.createCookie("NavikConverter",data.token);
			//Set permission List in local storage
			localStorage.setItem('permissionList',data.permissionList);
			$window.location="home.htm";
		}else{
			$scope.loginError = true;
		}
	}
	
	if(urlIndex && urlIndex.unauthorised == "true"){
		//Unauthorised user
		$scope.unauthorisedUser = true;
	}
	
	//Failure function for login
	$scope.fail = function(){
		$scope.loadingLoginResult = false;
		$scope.showNetworkError = true;
	}

	//function executed when 'login' is clicked
	$scope.signIn = function(){
		$scope.unauthorisedUser = false;
		$scope.loginError = false;
		$scope.showNetworkError = false;
		$scope.loadingLoginResult = true;
		//Setting username in local storage
		localStorage.setItem('userName', $scope.userName);
		//request
		requestData[requestConstants.USER_NAME] = $scope.userName;
		requestData[requestConstants.PASSWORD] = $scope.password;
		//DataService call
		DataService.getLoginDetails(requestData, $scope.success, $scope.fail);
	}
}])

