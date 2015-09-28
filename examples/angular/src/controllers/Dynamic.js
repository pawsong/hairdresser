export function DynamicCtrl(hairdresser, $scope) {
  $scope.title = 'Default title';
  $scope.body = 'Default body';

  const override = hairdresser.override()
    .title(() => $scope.title, {
      addListener: listener => $scope.$watch('title', listener),
      removeListener: (listener, remove) => remove(),
    })
    .meta({ name: 'body' }, () => ({ content: $scope.body }), {
      addListener: listener => $scope.$watch('body', listener),
      removeListener: (listener, remove) => remove(),
    });

  $scope.$on('$destroy', () => {
    override.restore();
  });
}
