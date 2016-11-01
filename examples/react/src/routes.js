import React from 'react';

import {
  Route,
  DefaultRoute,
} from 'react-router';

import App from './components/App';
import Home from './components/Home';
import {
  Parent,
  Child,
  Grandchild,
} from './components/Override';
import {
  Async,
  AsyncPerElement,
} from './components/Async';
import Dynamic from './components/Dynamic';

const routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="override" path="override" handler={Parent}>
      <Route name="child" path="child" handler={Child}>
        <Route name="grandchild" path="grandchild" handler={Grandchild}>
        </Route>
      </Route>
    </Route>
    <Route name="async" path="async" handler={Async}/>
    <Route name="asyncPerElement" path="async-per-element" handler={AsyncPerElement}/>
    <Route name="dynamic" path="dynamic" handler={Dynamic}/>
  </Route>
);

export default routes;
