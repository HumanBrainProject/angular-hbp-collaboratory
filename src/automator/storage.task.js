angular.module('clb-automator')
.run(function createStorage(
  $log,
  $q,
  clbError,
  clbAutomator,
  clbStorage
) {
  clbAutomator.registerHandler('storage', storage);

  /**
   * Copy files and folders to the destination collab storage.
   *
   * @memberof module:clb-automator.Tasks
   * @param {object} descriptor the task configuration
   * @param {object} descriptor.storage a object where keys are the file path in the
   *                                new collab and value are the UUID of the
   *                                entity to copy at this path.
   * @param {object} [descriptor.collab] id of the collab
   * @param {object} context the current task context
   * @param {object} [context.collab] the collab in which entities will be copied
   * @return {object} created entities where keys are the same as provided in
   *                  config.storage
   */
  function storage(descriptor, context) {
    return clbAutomator.ensureParameters(
      descriptor, 'entities'
    ).then(function() {
      return clbStorage
        .getEntity({collab: descriptor.collab || context.collab.id})
        .then(function(projectEntity) {
          var promises = {};
          angular.forEach(descriptor.entities, function(value, name) {
            if (angular.isString(value)) {
              $log.debug("Copy entity with UUID", value);
              promises[name] = (
                clbStorage.copy(value, projectEntity.uuid));
            } else {
              $log.warn('Invalid configuration for storage task', descriptor);
            }
          });
          return $q.all(promises);
        });
    });
  }
});
