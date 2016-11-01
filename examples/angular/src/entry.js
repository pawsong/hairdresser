import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';

import routes from './routes';
import hairdresser from './services/hairdresser';
import init from './init';

const app = angular.module('hairdresserExample', [
  'ngSanitize',
  'ui.router',
]);

routes(app);
hairdresser(app);
init(app);
