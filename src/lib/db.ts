import mongoose from "mongoose";

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? {
	conn: null,
	promise: null
};

globalThis.mongooseCache = cached;

export default async function connectToDatabase(): Promise<typeof mongoose> {
	const uri = process.env.MONGODB_URI;

	if (!uri) {
		throw new Error("MONGODB_URI is not configured. Add it to the .env file.");
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(uri).catch((error: unknown) => {
			cached.promise = null;

			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`MongoDB connection failed: ${message}`, {
				cause: error
			});
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
