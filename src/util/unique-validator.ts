import mongoose from 'mongoose';
import nodeInputValidator from 'node-input-validator';

nodeInputValidator.extend('unique', async ({ value, args }) => {

    const [ key, model, id ] = args;

    const condition = {
        [key]: value,
    };

    if (id) {
        condition['_id'] = { $ne: mongoose.Types.ObjectId(id) };
    }

    const existing = await mongoose.model(model).findOne(condition);
    return !existing;
});

export default nodeInputValidator;
export const Validator = nodeInputValidator.Validator;