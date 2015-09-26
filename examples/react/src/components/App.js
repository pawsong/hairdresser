import React from 'react';
import {
  Link,
  RouteHandler,
} from 'react-router';

const ROUTES = [
  '/',
  '/override',
  '/override/child',
  '/override/child/grandchild',
  '/async',
  '/async-per-element',
  '/dynamic',
];

class App extends React.Component {
  render() {
    const routeLinks = ROUTES.map(path => {
      return <Link className="list-group-item" key={path} to={path}>{path}</Link>;
    });

    return (
      <div className="row">
        {/* Routes column */}
        <div className="col-xs-4">
          <div className="page-header">
            <h2>Routes</h2>
          </div>
          <div className="list-group">
            {routeLinks}
          </div>
        </div>

        {/* Contents column */}
        <div className="col-xs-8">
          <div className="page-header">
            <h2>Contents</h2>
          </div>
          <div className="well well-lg">
            <RouteHandler/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
