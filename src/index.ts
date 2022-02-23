import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';

import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import './db/db-init';

import usersRouter from './routes/users';
import bitcoinRouter from './routes/bitcoin';
import operationsRouter from './routes/operations';

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(logger());
app.use(bodyParser());

app.use(usersRouter.routes());
app.use(bitcoinRouter.routes());
app.use(operationsRouter.routes());

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));