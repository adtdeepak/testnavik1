angular.module('AnalyticsApp')

.service('NetworkService', ['$http','UtilitiesService','$q','$location',function($http, UtilitiesService, $q,$location) {
	
	function getOptions() {
		var options = {
	            headers: {},
	        };
			if(localStorage.getItem('token')){
				options = {
			           headers: {"AuthToken":localStorage.getItem('token')},
			        };
			}
		return options;
	}
	
	function success(response, deferred) {
		// The return value gets picked up by the then in the controller.
		if(response.status == 200) {
			if(response.headers('AuthToken')) {
				localStorage.setItem('token', response.headers('AuthToken'));
			}
			deferred.resolve(response.data);
		} else {
			console.info('DATA FETCH IS NOT SUCCESS!!!', response);
			deferred.resolve(response);
		}
	}
	
	function failure(response, deferred) {
		//code for 401
		if(response.status == 401) {
			UtilitiesService.unauthorisedRedirect(location);
		}
        deferred.reject(response);
	}
	
	this.get = function(url, scope){
		// $http returns a promise, which has a then function, which also returns a promise
        var options = getOptions();
		var deferred = $q.defer();
		// The then function here is an opportunity to modify the response
		var promise = $http.get(url, options).then(function (response) {
			success(response, deferred);
		}, function(response){
			failure(response, deferred);
        }).catch(function(e){
            UtilitiesService.throwError(undefined, {message: "Network Error?! [NTWRK-SRVC]", type: "internal"});
        });
      
		// Return the promise to the data service
		return deferred.promise;
	};
	
	this.post = function(url, data, scope) {
		// $http returns a promise, which has a then function, which also returns a promise
        var options = getOptions();
        var deferred = $q.defer();
		// The then function here is an opportunity to modify the response
		var promise = $http.post(url, data, options).then(function (response) {
			// The return value gets picked up by the then in the controller.
			success(response, deferred);
		}, function(response){
			failure(response, deferred);
        }).catch(function(e){
            UtilitiesService.throwError(undefined, {message: "Network Error?! [NTWRK-SRVC]", type: "internal"});
        });
		// Return the promise to the data service
		return deferred.promise;
	};
	
	this.delete = function(url, data, scope) {
		// $http returns a promise, which has a then function, which also returns a promise
        var options = getOptions();
        var deferred = $q.defer();
		// The then function here is an opportunity to modify the response
		var promise = $http.delete(url, data, options).then(function (response) {
			success(response, deferred);
		}, function(response){
			failure(response, deferred);
        }).catch(function(e){
            UtilitiesService.throwError(undefined, {message: "Network Error?! [NTWRK-SRVC]", type: "internal"});
        });
		// Return the promise to the data service
		return deferred.promise;
	};
	

	
}])
