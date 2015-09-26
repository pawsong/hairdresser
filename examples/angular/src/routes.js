import {HeadMonitorCtrl}from './controllers/HeadMonitor';

import {
  ParentCtrl,
  ChildCtrl,
  GrandchildCtrl,
} from './controllers/Override';

import {
  AsyncCtrl,
  AsyncPerElementCtrl,
} from './controllers/Async';

import {DynamicCtrl} from './controllers/Dynamic';

export default app => {
  app.config(($stateProvider, $urlRouterProvider) => {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
    .state('root', {
      abstract: true,
      url: '',
      views: {
        '': {
          templateUrl: 'views/root.html',
        },
        headmonitor: {
          templateUrl: 'views/headmonitor.html',
          controller: HeadMonitorCtrl,
        },
      },
    })

    .state('root.home', {
      url: '/',
      templateUrl: 'views/home.html',
    })

    .state('root.override', {
      url: '/override',
      templateUrl: 'views/override.html',
      controller: ParentCtrl,
    })

    .state('root.override.child', {
      url: '/child',
      templateUrl: 'views/override.child.html',
      controller: ChildCtrl,
    })

    .state('root.override.child.grandchild', {
      url: '/grandchild',
      templateUrl: 'views/override.child.grandchild.html',
      controller: GrandchildCtrl,
    })

    .state('root.async', {
      url: '/async',
      templateUrl: 'views/async.html',
      controller: AsyncCtrl,
    })

    .state('root.asyncPerElement', {
      url: '/async-per-element',
      templateUrl: 'views/asyncPerElement.html',
      controller: AsyncPerElementCtrl,
    })

    .state('root.dynamic', {
      url: '/dynamic',
      templateUrl: 'views/dynamic.html',
      controller: DynamicCtrl,
    })
    ;
  });
};
