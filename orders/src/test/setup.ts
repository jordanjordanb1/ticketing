import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.JWT_KEY = 'secret';
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  // Build a JSON webtoken payload { id, email }
  const payload = {
    id: mongoose.Types.ObjectId(),
    email: 'test@test.com',
  };

  // Create the JSON webtoken
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn session into JSON webtoken
  const sessionJSON = JSON.stringify(session);

  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string with the encoded webtoken
  return [`express:sess=${base64}`];
};
