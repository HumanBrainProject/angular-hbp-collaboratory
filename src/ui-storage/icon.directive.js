angular.module('clb-ui-storage')
.directive('clbIcon', clbIcon);

/**
 * This directive represents the icon corresponding to an entity type.
 * It's possible to provide the type as a string (attribute: `type`)
 * or an entity object (attribute: `entity`) having a property named `_entityType`.
 *
 * Attributes
 * ----------
 *
 * =============  ===========================================
 * Name           Description
 * =============  ===========================================
 * [clb-entity]   EntityDescriptor to display icon for
 * [clb-type]     Type to display icon for
 * =============  ===========================================
 *
 * admitted values for type/_entityType:
 *
 * - root
 * - project
 * - folder
 * - file
 * - release
 * - link:folder
 * - link:file
 * - link:project
 * - link:release
 *
 * @example
 * <div ng-controller="iconController">
 * this is the icon for a {{entity._entityType}}: <clb-icon clb-entity="entity"></clb-icon><br/>
 * this is the icon for a: {{type}} <clb-icon clb-type="type"></clb-icon>
 * @return {object} Directive Descriptor
 */
function clbIcon() {
  return {
    templateUrl: 'icon.directive.html',
    restrict: 'E',
    scope: {
      entity: '=?',
      type: '=?'
    },
    link: function(scope) {
      if (!scope.type && scope.entity) {
        scope.type = scope.entity._entityType;
      }
    }
  };
}
