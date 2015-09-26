export function ParentCtrl($scope, hairdresser) {
  const override = hairdresser.override()
    .title('Title from Parent')
    .meta({ name: 'overridden' }, { content: 'by parent' })
    .meta({ name: 'parent' }, { content: 'parent content' });

  $scope.$on('$destroy', () => {
    override.restore();
  });
}

export function ChildCtrl($scope, hairdresser) {
  const override = hairdresser.override()
    .title('Title from Child')
    .meta({ name: 'overridden' }, { content: 'by child' })
    .meta({ name: 'child' }, { content: 'child content' });

  $scope.$on('$destroy', () => {
    override.restore();
  });
}

export function GrandchildCtrl($scope, hairdresser) {
  const override = hairdresser.override()
    .title('Title from Grandchild')
    .meta({ name: 'overridden' }, { content: 'by grandchild' })
    .meta({ name: 'grandchild' }, { content: 'grandchild content' });

  $scope.$on('$destroy', () => {
    override.restore();
  });
}
