import mongoose, { Document, Schema, Model } from 'mongoose';

interface IBitcoin extends Document {
    price: number;
    updatedAt: Date;
}

interface IBitcoinModel extends Model<IBitcoin> {
    getPrice: () => Promise<IBitcoin>;
    setPrice: (price: number) => Promise<IBitcoin>;
}

const BitcoinSchema = new Schema<IBitcoin>({
    price: {
        type: Number,
        required: true,
        default: 100,
        min: 0
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

BitcoinSchema.set('toJSON', {
    transform: (_, value: IBitcoin) => {
        delete value._id;
        delete value.__v;
        value.price = Number(Number(value.price).toFixed(2));
    }
});

BitcoinSchema.pre('save', function (next: () => void): void {
    this.updatedAt = new Date();
    next();
});

BitcoinSchema.statics.getPrice = async (): Promise<IBitcoin> => {

    let price = await Bitcoin.findOne();

    if (!price) {
        price = new Bitcoin();
        await price.save();
    }

    return price;
};

BitcoinSchema.statics.setPrice = async (price: number): Promise<IBitcoin> => {
    const record = await Bitcoin.getPrice();
    record.price = price;
    return record.save();
};

const Bitcoin = mongoose.model<IBitcoin, IBitcoinModel>('Bitcoin', BitcoinSchema);

export default Bitcoin;