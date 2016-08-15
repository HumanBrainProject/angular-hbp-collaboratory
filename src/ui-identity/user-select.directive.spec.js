'use strict';

describe('Directive: clbUsercardPopover', function() {
  var $compile;
  var $q;
  var service;

  var element;
  var scope;

  beforeEach(module('clb-ui-identity'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    $rootScope,
    _$compile_,
    _$q_,
    clbUser,
    $templateCache
  ) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
    service = clbUser;

    scope.me = {
      id: '123123',
      displayName: 'John Doe',
      emails: [
        {value: 'john@doe.com'},
        {value: 'john.doe@epfl.ch', primary: true}
      ],
      phones: [
        {value: '1-2223-444'},
        {value: '1-2223-666', primary: true},
        {value: '1-2223-555'}
      ],
      ims: [{value: 'skype://johndoe', primary: true}],
      username: 'jdoe'
    };

    spyOn(service, 'get')
      .and.returnValue($q.when($rootScope.me));

    jasmine.cacheTemplate($templateCache,
      'user-select.directive.html',
      'src/ui-identity/');
  }));

  describe('basic usage', function() {
    beforeEach(function() {
      element = angular.element(
        '<clb-user-select ng-model="selected"></clb-user-select>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('use typeahead directive', function() {
      expect(element.find('input').attr('uib-typeahead')).toBeDefined();
    });
  });
});
