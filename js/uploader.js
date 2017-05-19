
(function () {
    'use strict';

	function UploadController ($scope, $http) {
		var $ctrl = this;

		$('#fileupload').fileupload({
	        dataType: 'json',
	        formData: {
	     	   access_token: '557deab0c0daafd795940ed2c0b22049df04d3e2da943225dc4c45fce313e3e4'
	        },
	        add: function (e, data) {
	            $scope.hashId   = '';
	            $scope.progress = 0;
	            $scope.status   = 'uploading';
	            $scope.url      = 'https://upload.wistia.com';

	            data.submit();
	        },
        	done: function (e, data) {
            	if (data.result.hashed_id != '') {
              		$scope.hashId = data.result.hashed_id;
              		// $ctrl.checkStatus();
            	}
          	},
	        progressall: function (e, data) {
	        	if (data.total > 0) {
	            	console.log($scope.progress);
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
  		controller: ['$scope', '$http', UploadController],
	});

}());

console.log("uploader.js");