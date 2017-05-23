
(function () {
    'use strict';

    angular.module('processApp')
    .component('uploader', {
  		templateUrl: 'uploader.html',
  		controller: ['$scope', '$http', '$sce', '$timeout', UploadController],
	});

	function UploadController ($scope, $http, $sce, $timeout) {
		
		var $ctrl = this;

		// Add Wistia api_password here
		$ctrl.api_password = 'your api password here';

		// Function calls Wistia API to retrieve media after upload completes.
		$ctrl.getMedia = function() {

			// The following URL is defined at Wistia: https://wistia.com/doc/data-api#making_requests
			let url = 'https://api.wistia.com/v1/medias/' + $ctrl.hashId + '.json?api_password=' + $ctrl.api_password;
			
			$http.get(url)
			.then((response) => {
				let status = response.data.status;
				
				// If response status of media is not ready, wait 2 seconds and repeat call
				if (status !== 'ready') {
					$timeout(function(){
						$ctrl.step += '.';
						$ctrl.getMedia();
					}, 2000);
				// If response status is ready, load Wistia video URL to player iframe
				} else if (status == 'ready') {
					let mostRecent = response.data.assets.length - 1;
					$scope.url = $sce.trustAsResourceUrl('https://fast.wistia.net/embed/iframe/' + $ctrl.hashId + '?videoFoam=true&autoPlay=true');
				}
			})
			.catch((error) => {
				console.log(error);
			});
		}

		// Blueimp Jquery fileupload plugin
		$('#fileupload').fileupload({
	        dataType: 'json',
	        formData: {
	     	   api_password: $ctrl.api_password
	        },
	        add: function (e, data) {
	        	// This hash ID will be used to uniquely identify the project within the Wistia system
	            $ctrl.hashId   = ''; 
	            // Progress for progress bar in html view
	            $ctrl.progress = 0;
	            // Step for "Please wait" message
	            $ctrl.step = '.';
	            // Status message
	            $scope.status   = 'Uploading';
	            // Initialize url to '', hiding iframe
	            $scope.url      = '';

	            // Submit file to upload with defined formData
	            data.submit();
	        },
        	done: function (e, data) {
            	if (data.result.hashed_id != '') {
            		// Save Wistia project hash ID
              		$ctrl.hashId = data.result.hashed_id;
              		$scope.status   = 'Processing, please wait.';
              		// Call to Wisita API to retrieve uploaded file
              		$ctrl.getMedia();
            	}
          	},
	        progressall: function (e, data) {
	        	// Function to control progress bar
	            $ctrl.progress = parseInt(data.loaded / data.total * 100, 10);
	            $('#progress .progress-bar').css(
	                'width',
	                $ctrl.progress + '%'
	            );
	        }
	    });
	}

}());
