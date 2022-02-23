import Router from 'koa-router';

import { Validator } from '../util/unique-validator';
import Bitcoin from '../db/models/bitcoin';

const router = new Router({
    prefix: '/bitcoin'
});

router.get('/', async ctx => {
    ctx.body = await Bitcoin.getPrice();
});

router.put('/', async ctx => {

    const validator = new Validator(ctx.request.body, {
        price: 'required|numeric|min:0'
    });

    if (await validator.fails()) {
        ctx.status = 422;
        return ctx.body = validator.errors;
    }

    ctx.body = await Bitcoin.setPrice(ctx.request.body.price);
});

export default router;