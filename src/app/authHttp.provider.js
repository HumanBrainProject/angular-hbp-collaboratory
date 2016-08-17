angular.module('clb-app')
.provider('clbAuthHttp', clbAuthHttpProvider);

/**
 * Provide clbAuthHttp service.
 * @return {object}   provider description
 */
function clbAuthHttpProvider() {
  var provider = {
    handleSessionExpiration: true,
    automaticLogin: false,
    $get: clbAuthHttp
  };
  return provider;

  /* ----------------- */

  /**
   * Proxy $http to add the HBP bearer token.
   * Also handle 401 Authentication Required errors.
   * See $http service
   *
   * @param  {object} $http   DI
   * @param  {object} $log   DI
   * @param  {object} $q   DI
   * @param  {object} clbAuth DI
   * @return {function}       the service
   */
  function clbAuthHttp($http, $log, $q, clbAuth) {
    var proxyHttp = function(config) {
      var auth = clbAuth.getAuthInfo();
      if (!auth) {
        if (provider.automaticLogin) {
          return clbAuth.login().then(function() {
            // login and relaunch
            proxyHttp(config);
          });
        }
        return $http(config);
      }
      var authToken = auth.tokenType + ' ' + auth.accessToken;
      if (!config.headers) {
        config.headers = {
          Authorization: authToken
        };
      }
      config.headers.Authorization = authToken;
      return $http(config).catch(function(err) {
        if (err.status === 401 && provider.handleSessionExpiration) {
          $log.debug('handle 401 error', err);
          return clbAuth.logout().then(function() {
            return clbAuth.login();
          });
        }
        return $q.reject(err);
      });
    };

    proxyHttp.get = _wrapper('GET');
    proxyHttp.head = _wrapper('HEAD');
    proxyHttp.delete = _wrapper('DELETE');
    proxyHttp.post = _wrapperData('POST');
    proxyHttp.put = _wrapperData('PUT');
    proxyHttp.patch = _wrapperData('PATCH');
    proxyHttp.configure = function(options) {
      if (!options) {
        return;
      }
      if (angular.isDefined(options.handleSessionExpiration)) {
        provider.handleSessionExpiration = options.handleSessionExpiration;
      }
      if (angular.isDefined(options.automaticLogin)) {
        provider.automaticLogin = options.automaticLogin;
      }
    };
    return proxyHttp;

    /**
     * Handle $http helper call for GET, DELETE, HEAD requests.
     *
     * @param  {string} verb the HTTP verb
     * @return {function}    The function to attach
     */
    function _wrapper(verb) {
      return function(url, config) {
        config = config || {};
        config.method = verb.toUpperCase();
        config.url = url;
        return proxyHttp(config);
      };
    }

    /**
     * Handle $http helper call for PUT, PATCH, POST requests.
     *
     * @param  {string} verb the HTTP verb
     * @return {function}    The function to attach
     */
    function _wrapperData(verb) {
      return function(url, data, config) {
        config = config || {};
        config.method = verb.toUpperCase();
        config.url = url;
        config.data = data;
        return proxyHttp(config);
      };
    }
  }
}
