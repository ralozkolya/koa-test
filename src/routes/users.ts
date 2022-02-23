import Router from 'koa-router';

import { Validator } from '../util/unique-validator';
import User from '../db/models/users';
import idMiddleware from '../util/id-middleware';

const router = new Router({
    prefix: '/users'
});

router.post('/', async ctx => {

    const validator = new Validator(ctx.request.body, {
        name: 'required|string',
        username: 'required|string|unique:username,User',
        email: 'required|email|unique:email,User'
    });

    if (await validator.fails()) {
        ctx.status = 422;
        return ctx.body = validator.errors;
    }

    const user = new User();

    const { name, username, email } = ctx.request.body;
    Object.assign(user, { name, username, email });

    await user.save();

    ctx.body = user;
});

router.get('/:id', async (ctx, next) => {
    await next();
    ctx.body = ctx.state.user;
});

router.put('/:id', async (ctx, next) => {

    await next();

    const validator = new Validator(ctx.request.body, {
        name: 'string',
        email: `email|unique:email,User,${ctx.params.id}`
    });

    if (await validator.fails()) {
        ctx.status = 422;
        return ctx.body = validator.errors;
    }
    
    const { name, email } = ctx.request.body;
    Object.assign(ctx.state.user, { name, email });
    
    await ctx.state.user.save();

    ctx.body = ctx.state.user;
});

router.use(idMiddleware);

export default router;