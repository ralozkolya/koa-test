import mongoose, { Document, Schema, Model } from 'mongoose';
import assert from 'assert';

import Bitcoin from './bitcoin';

type USDAction = 'withdraw' | 'deposit';
type BTCAction = 'buy' | 'sell';

interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    bitcoinAmount: number;
    usdBalance: number;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserModel extends Model<IUser> {
    updateUSD: (action: USDAction, price: number) => Promise<IUser>;
    updateBTC: (action: BTCAction, price: number) => Promise<IUser>;
    balance: () => Promise<number>;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    bitcoinAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    usdBalance: {
        type: Number,
        min: 0,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
});

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (_, value: IUser) => {
        delete value._id;
        delete value.__v;
        value.usdBalance = Number(Number(value.usdBalance).toFixed(2));
        value.bitcoinAmount = Number(Number(value.bitcoinAmount).toFixed(8));
    }
});

UserSchema.pre('save', function (next: () => void): void {
    this.updatedAt = new Date();
    next();
});

UserSchema.methods.updateUSD = function (action: USDAction, amount: number): Promise<IUser> {

    if (action === 'withdraw') {
        assert(this.usdBalance >= amount, 'Insufficient funds');
        amount *= -1;
    }

    this.usdBalance += amount;
    return this.save();
};

UserSchema.methods.updateBTC = async function (action: BTCAction, amount: number): Promise<IUser> {

    const { price } = await Bitcoin.getPrice();

    if (action === 'buy') {
        assert(this.usdBalance >= price * amount, 'Insufficient funds');
    } else {
        assert(this.bitcoinAmount >= amount, 'Insufficient funds');
        amount *= -1;
    }
    
    this.usdBalance -= price * amount;
    this.bitcoinAmount += amount;

    return this.save();
};

UserSchema.methods.balance = async function (): Promise<number> {

    const { price } = await Bitcoin.getPrice();
    return Number(Number(this.usdBalance + this.bitcoinAmount * price).toFixed(2));
};

export default mongoose.model<IUser, IUserModel>('User', UserSchema);