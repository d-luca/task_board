import mongoose from "mongoose";
import { initializeMongoServer } from "./mongoServer";
import { logger } from "../utils/logger";
import * as statusManager from "./statusManager";

let isConnected = false;
let mongoUri: string | null = null;

export async function connectDatabase(): Promise<void> {
	if (isConnected) {
		logger.info("MongoDB already connected");
		return;
	}

	try {
		logger.info("Initializing MongoDB...");
		statusManager.setInitializing("Initializing database...");

		// Start MongoDB server first with extended timeout for binary download
		// 5 minutes should be enough for downloading MongoDB binaries on slow connections
		const TIMEOUT_MS = 300000; // 5 minutes
		const timeout = new Promise<never>((_, reject) => {
			setTimeout(() => {
				logger.error(`MongoDB initialization timeout reached (${TIMEOUT_MS / 1000} seconds)`);
				logger.error("This usually happens when downloading MongoDB binaries takes too long.");
				logger.error("Please check your internet connection and try again.");
				reject(new Error(`MongoDB initialization timeout after ${TIMEOUT_MS / 1000} seconds`));
			}, TIMEOUT_MS);
		});

		logger.info(`Starting MongoDB server initialization (with ${TIMEOUT_MS / 1000}s timeout)...`);
		statusManager.setInitializing("Starting MongoDB server (this may take a few minutes on first run)...");

		try {
			mongoUri = await Promise.race([initializeMongoServer(), timeout]);
			logger.info("MongoDB server initialized, URI:", mongoUri);
		} catch (initError) {
			logger.error("MongoDB server initialization failed:", initError);
			throw initError;
		}

		logger.info("Connecting to MongoDB at:", mongoUri);
		statusManager.setInitializing("Connecting to database...");

		// Ensure we're connecting to the taskboard database
		const dbUri = mongoUri.endsWith("/") ? mongoUri + "taskboard" : mongoUri + "/taskboard";
		logger.info("Full database URI:", dbUri);

		// Then connect to it
		await mongoose.connect(dbUri, {
			serverSelectionTimeoutMS: 10000,
		});

		isConnected = true;
		logger.info("✓ MongoDB connected successfully!");
		logger.info("Connected to database:", mongoose.connection.db?.databaseName);
		statusManager.setConnected();

		mongoose.connection.on("error", (error) => {
			logger.error("MongoDB connection error:", error);
			isConnected = false;
			statusManager.setError("Database connection error");
		});

		mongoose.connection.on("disconnected", () => {
			logger.info("MongoDB disconnected");
			isConnected = false;
			statusManager.updateDatabaseStatus({ isConnected: false });
		});

		return; // Success - exit function
	} catch (error) {
		logger.error("✗ MongoDB connection FAILED:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown database error";
		statusManager.setError(errorMessage);

		logger.error("The app will continue without database functionality.");
		if (error instanceof Error) {
			logger.error("Error name:", error.name);
			logger.error("Error message:", error.message);
			logger.error("Error stack:", error.stack);
		}

		// Ensure we're marked as not connected
		isConnected = false;
		// Don't throw - let the app continue
	}
}
export async function disconnectDatabase(): Promise<void> {
	if (!isConnected) {
		return;
	}

	try {
		await mongoose.disconnect();
		isConnected = false;
		logger.info("MongoDB disconnected successfully");

		// Stop MongoDB server
		const { stopMongoServer } = await import("./mongoServer");
		await stopMongoServer();
	} catch (error) {
		logger.error("MongoDB disconnect error:", error);
		throw error;
	}
}

export function getDatabaseStatus(): boolean {
	return isConnected;
}
