
(function () {
    'use strict';

	function UploadController ($scope, $http, $sce) {
		var ctrl = this;

		ctrl.getMedia = function() {
			// return new Promise((resolve, reject) => {
			// 	$http.get(url, )
			// });
			console.log("getMedia");
		}

		$('#fileupload').fileupload({
	        dataType: 'json',
	        formData: {
	     	   api_password: '080fcacb911fc78b96a1fa33ea1a6cd94640b0b36d90c6c00576b8c162125c78'
	        },
	        add: function (e, data) {
	            $scope.hashId   = '';
	            $scope.progress = 0;
	            $scope.status   = 'uploading';
	            $scope.url      = '';

	            data.submit();
	        },
        	done: function (e, data) {
            	if (data.result.hashed_id != '') {
              		$scope.hashId = data.result.hashed_id;
              		console.log($scope.hashId);
              		console.log(data);
              		ctrl.getMedia();
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
  		controller: ['$scope', '$http', '$sce', UploadController],
	});

}());

console.log("uploader.js");