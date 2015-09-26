export function DynamicCtrl(hairdresser, $scope) {
  $scope.title = 'Default title';
  $scope.body = 'Default body';

  const override = hairdresser.override()
    .title(() => $scope.title, {
      addListener: callback => $scope.$watch('title', callback),
      removeListener: remove => remove(),
    })
    .meta({ name: 'body' }, () => ({ content: $scope.body }), {
      addListener: callback => $scope.$watch('body', callback),
      removeListener: remove => remove(),
    });

  $scope.$on('$destroy', () => {
    override.restore();
  });
}
