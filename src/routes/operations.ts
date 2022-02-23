import Router from 'koa-router';

import { Validator } from '../util/unique-validator';
import idMiddleware from '../util/id-middleware';

const router = new Router({
    prefix: '/users'
});

router.post('/:id/usd', async (ctx, next) => {

    await next();

    const validator = new Validator(ctx.request.body, {
        action: 'required|in:withdraw,deposit',
        amount: 'required|numeric|min:.01'
    });

    if (await validator.fails()) {
        ctx.status = 422;
        return ctx.body = validator.errors;
    }

    const { action, amount } = ctx.request.body;

    try {
        ctx.body = await ctx.state.user.updateUSD(action, amount);
    } catch (e) {
        ctx.throw(422, e);
    }
});

router.post('/:id/bitcoins', async (ctx, next) => {

    await next();

    const validator = new Validator(ctx.request.body, {
        action: 'required|in:buy,sell',
        amount: 'required|numeric|min:.0000000001'
    });

    if (await validator.fails()) {
        ctx.status = 422;
        return ctx.body = validator.errors;
    }

    const { action, amount } = ctx.request.body;

    try {
        ctx.body = await ctx.state.user.updateBTC(action, amount);
    } catch (e) {
        ctx.throw(422, e);
    }
});

router.get('/:id/balance', async (ctx, next) => {

    await next();
    ctx.body = {
        balance: await ctx.state.user.balance()
    };
});

router.use(idMiddleware);

export default router;