angular.module('clb-ui-identity')
.directive('clbUserSelect', clbUserSelect);

/**
 * The clb-user-select directive can be used to select a user from a list.
 *
 * @namespace clbUserSelect
 * @memberof module:ui-identity
 * @param  {object} clbUser Angular DI
 * @return {object}        Directive descriptor
 */
function clbUserSelect(clbUser) {
  return {
    restrict: 'E',
    templateUrl: 'user-select.directive.html',
    scope: {
      loading: '=?clbUserSelectLoading',
      noResults: '=?clbUserSelectNoResults',
      placeholder: '=?clbUserSelectPlaceholder',
      ngModel: '='
    },
    link: function(scope) {
      scope.loading = scope.loading || 'Loading Users';
      scope.noResults = scope.noResults || 'No Users';
      scope.placeholder = scope.placeholder || 'Start typing a user name';
      scope.search = function(query) {
        return clbUser.search(query).then(function(rs) {
          return rs.results;
        });
      };
    }
  };
}
