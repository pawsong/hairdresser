import _ from 'lodash';
import fs from 'fs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config';
import Router from 'react-router';
import React from 'react';
import Context from './components/Context';
import createHairdresser from './hairdresser';
import routes from './routes';

const PORT = 8080;

webpackConfig.output.path = '/';
const server = new WebpackDevServer(webpack(webpackConfig), {
  stats: { colors: true },
  contentBase: false,
});

// Render!
const template = fs.readFileSync('./index.template').toString();
const compiled = _.template(template);

server.app.get('*', async (req, res, next) => {
  try {
    const hairdresser = createHairdresser();
    const routePath = req.path === '/index.html' ? '/' : req.path;

    const Handler = await new Promise((resolve) => {
      Router.run(routes, routePath, resolve);
    });

    const body = React.renderToString(
      <Context hairdresser={hairdresser}>
        {() => <Handler/>}
      </Context>
    );

    const head = hairdresser.renderToString();

    // Render
    const result = compiled({
      head,
      body,
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
});

// Listen!
server.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.info(`Server listening at localhost:${PORT}`);
});
