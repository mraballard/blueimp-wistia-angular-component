
(function () {
    'use strict';

	function UploadController ($scope, $http, $sce, $timeout) {
		var $ctrl = this;

		$ctrl.api_password = '080fcacb911fc78b96a1fa33ea1a6cd94640b0b36d90c6c00576b8c162125c78';

		$ctrl.getMedia = function() {
			return new Promise((resolve, reject) => {
				let url = 'https://api.wistia.com/v1/medias/' + $ctrl.hashId + '.json?api_password=' + $ctrl.api_password;
				$http.get(url)
				.then((response) => {
					let status = response.data.status;
					if (status == 'failed') {
						reject();			
					} else if (status !== 'ready') {
						$timeout(function(){
							$ctrl.getMedia();
						}, 3000);
					} else if (status == 'ready') {
						console.log(response);
						let mostRecent = response.data.assets.length - 1;
						console.log("Most recent", response.data.assets[mostRecent].url);
						$scope.url = $sce.trustAsResourceUrl(response.data.assets[mostRecent].url);
						resolve();
					}
				})
				.catch((error) => {
					console.log(error);
				});
			});
		}

		$('#fileupload').fileupload({
	        dataType: 'json',
	        formData: {
	     	   api_password: $ctrl.api_password
	        },
	        add: function (e, data) {
	            $ctrl.hashId   = '';
	            $scope.progress = 0;
	            $scope.status   = 'uploading';
	            $scope.url      = '';

	            data.submit();
	        },
        	done: function (e, data) {
            	if (data.result.hashed_id != '') {
              		$ctrl.hashId = data.result.hashed_id;
              		$scope.status   = 'Done!';
              		console.log($scope.hashId);
              		console.log(data);
              		$ctrl.getMedia();
            	}
          	},
	        progressall: function (e, data) {
	        	if (data.total > 0) {
		            $scope.$apply(function() {
		            	$scope.progress = parseInt(data.loaded / data.total * 100, 10);
		            });
	            };
	        }
	    });
	}

 angular.module('processApp')
    .component('uploader', {
  		templateUrl: 'uploader.html',
  		controller: ['$scope', '$http', '$sce', '$timeout', UploadController],
	});

}());

console.log("uploader.js");