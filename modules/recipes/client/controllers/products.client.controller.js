'use strict';

// Recipes controller
angular
    .module('recipes')
    .controller('ProductsController', ProductsController);
ProductsController.$inject = ['$scope', '$stateParams', '$location', '$window', '$timeout', 'Authentication', 'Products', 'Ingridients', 'Measures',  'FileUploader'];
function ProductsController($scope, $stateParams, $location, $window, $timeout, Authentication, Products, Ingridients, Measures, FileUploader) {

    $scope.authentication = Authentication;

    $scope.find = function () {
        $scope.products = Products.query();
    };

    $scope.findOne = function () {
        $scope.product = Products.get(
            {
                productId: $stateParams.productId
            }
        );
    };

    $scope.getMeasuresList = function () {
        return Measures.query().$promise;
    };

    $scope.create = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'productForm');
            return false;
        }

        // Create new Recipe object

        var product = new Products(
            {
                caption: this.caption,
                infoCard: this.infoCard,
                image: $scope.imageURL,
                measureId: $scope.measureId
            }
        );

        // Redirect after save
        product.$save(function (response) {
            $location.path('products/' + response.id);

        // Clear form fields
            $scope.caption = '';
            $scope.infoCard = '';
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.update = function (isValid) {
        $scope.error = null;
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'productForm');
            return false;
        }

        var product = $scope.product;
        product.image = $scope.imageURL;
        product.$update(function () {
            $location.path('products/' + product.id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.remove = function (ingridient) {
        if (ingridient) {
            ingridient.$remove();
            $location.path('ingridients');
        } else {
            $scope.ingridient.$remove(function () {
                $location.path('ingridient');
            });
        }
    };

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/pictures/products'
    });

    // FILTERS

    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

        // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($window.FileReader) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(fileItem._file);

            fileReader.onload = function (fileReaderEvent) {
                $timeout(function () {
                    $scope.imageURL = fileReaderEvent.target.result;
                }, 0);
            };
        }
    };
}