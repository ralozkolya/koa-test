import User from '../db/models/users';

export default async ctx => {
    if (ctx.params.id) {
        ctx.assert(ctx.params.id.match(/^[0-9a-fA-F]{24}$/), 404);
        const user = await User.findById(ctx.params.id);
        ctx.assert(user, 404);
        ctx.state.user = user;
    }
}