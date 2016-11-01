import React from 'react';
import Router from 'react-router';
import createHairdresser from './hairdresser';
import Context from './components/Context';
import HeadMonitor from './components/HeadMonitor';
import routes from './routes';

require('highlight.js/styles/sunburst.css');

const hairdresser = createHairdresser();
hairdresser.render();

Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(
    <Context hairdresser={hairdresser}>
      {() => <Handler/>}
    </Context>,
    document.getElementById('content')
  );

  React.render(
    <Context hairdresser={hairdresser}>
      {() => <HeadMonitor/>}
    </Context>,
    document.getElementById('headmonitor')
  );
});
