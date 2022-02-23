import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let uri: string;

async function init(): Promise<void> {

    if (process.env.DB_PROVIDER === 'mongo') {

        const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
        uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
    
    } else {
    
        const mongod = new MongoMemoryServer();
        uri = await mongod.getUri();
    }
    
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

}

init().catch(e => {
    console.error(e.message);
    console.error('Exiting...');
    process.exit(1);
});
