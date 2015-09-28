export function AsyncCtrl($scope, $timeout, hairdresser) {
  $scope.data = {
    title: 'Will be loaded in 1 sec',
    body: 'Will be loaded in 1 sec',
  };

  const timer = $timeout(() => {
    $scope.data = {
      title: 'Title is ready',
      body: 'Body is ready',
    };
  }, 1000);

  const override = hairdresser.override({
    addListener: listener => $scope.$watch('data', listener),
    removeListener: (listener, remove) => remove(),
  })
    .title(() => $scope.data.title)
    .meta({ name: 'body' }, () => ({ content: $scope.data.body }));

  $scope.$on('$destroy', () => {
    override.restore();
    $timeout.cancel(timer);
  });
}

export function AsyncPerElementCtrl($scope, $timeout, hairdresser) {
  $scope.title = 'Will be loaded in 1 sec';
  const timer1 = $timeout(() => {
    $scope.title = 'Title is ready';
  }, 1000);

  $scope.body = 'Will be loaded in 2 sec';
  const timer2 = $timeout(() => {
    $scope.body = 'Body is ready';
  }, 2000);

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
    $timeout.cancel(timer1);
    $timeout.cancel(timer2);
  });
}
