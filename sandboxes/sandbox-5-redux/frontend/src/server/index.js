import 'babel-polyfill';
import express from 'express';

import createConfig from './config';
import configureEndpoints from './endpoints';
import configureMiddlewares from './middlewares';

const app = express();
const config = createConfig(process.env);

configureMiddlewares(app, config);
configureEndpoints(app, config);


// eslint-disable-next-line no-console
app.listen(8080, () => console.log('Server running on 8080'));
