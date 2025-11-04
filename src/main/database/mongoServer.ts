import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "electron";
import { exec } from "child_process";
import { promisify } from "util";
import { logger } from "../utils/logger";

const execAsync = promisify(exec);

let mongoServer: MongoMemoryServer | null = null;
let dockerMongoRunning = false;

const isDev = !app.isPackaged;

/**
 * Check if Docker MongoDB is running (dev mode)
 */
async function isDockerMongoRunning(): Promise<boolean> {
	if (!isDev) return false;

	try {
		const { stdout } = await execAsync('docker ps --filter "name=dt_mongo" --format "{{.Names}}"');
		return stdout.trim() === "dt_mongo";
	} catch (error) {
		logger.error("Error checking Docker MongoDB status:", error);
		return false;
	}
}

/**
 * Start Docker MongoDB (dev mode)
 */
async function startDockerMongo(): Promise<void> {
	try {
		logger.info("Starting Docker MongoDB...");
		await execAsync("docker-compose up -d mongodb");
		dockerMongoRunning = true;
		logger.info("Docker MongoDB started successfully");
	} catch (error) {
		logger.error("Failed to start Docker MongoDB:", error);
		throw new Error("Failed to start Docker MongoDB. Make sure Docker is running.");
	}
}

/**
 * Start embedded MongoDB (production mode)
 */
async function startEmbeddedMongo(): Promise<string> {
	try {
		logger.info("Starting embedded MongoDB...");
		logger.info("This may take a few minutes on first run (downloading MongoDB binaries)...");
		logger.info("Binary size is approximately 50-100 MB depending on platform.");

		const downloadDir = app.getPath("userData") + "/mongodb-binaries";
		const dbPath = app.getPath("userData") + "/mongodb-data";
		logger.info("MongoDB binaries will be stored at:", downloadDir);
		logger.info("MongoDB data will be stored at:", dbPath);

		// Ensure the data directory exists
		const fs = await import("fs");
		if (!fs.existsSync(dbPath)) {
			logger.info("Creating data directory...");
			fs.mkdirSync(dbPath, { recursive: true });
		}

		logger.info("Creating MongoMemoryServer instance...");

		const startTime = Date.now();

		// Configure mongodb-memory-server with persistent storage
		mongoServer = await MongoMemoryServer.create({
			instance: {
				port: 27018,
				dbName: "taskboard",
				storageEngine: "wiredTiger",
				dbPath: dbPath, // Persistent storage path
			},
			binary: {
				version: "7.0.14",
				downloadDir: downloadDir,
				checkMD5: false, // Skip MD5 check to avoid network issues
			},
		});

		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		const uri = mongoServer.getUri();
		logger.info(`✓ Embedded MongoDB started successfully in ${duration}s`);
		logger.info(`   URI: ${uri}`);
		logger.info(`   Data persisted at: ${dbPath}`);
		return uri;
	} catch (error) {
		logger.error("✗ Failed to start embedded MongoDB");
		if (error instanceof Error) {
			logger.error("Error name:", error.name);
			logger.error("Error message:", error.message);
			logger.error("Error stack:", error.stack);
		} else {
			logger.error("Unknown error:", error);
		}

		// Provide helpful error messages for common issues
		const errorMsg = error instanceof Error ? error.message : String(error);
		if (errorMsg.includes("ENOTFOUND") || errorMsg.includes("getaddrinfo")) {
			logger.error("Network error detected. Please check your internet connection.");
			logger.error("If behind a proxy, you may need to configure proxy settings.");
		} else if (errorMsg.includes("EACCES") || errorMsg.includes("permission denied")) {
			logger.error("Permission error detected. Try running as administrator.");
		} else if (errorMsg.includes("ENOSPC")) {
			logger.error("Disk space error. Please free up some disk space.");
		} else if (errorMsg.includes("timeout") || errorMsg.includes("ETIMEDOUT")) {
			logger.error("Download timeout. Your internet connection may be too slow.");
			logger.error("Try again later or on a faster network.");
		}

		throw new Error(
			"Failed to start embedded MongoDB: " + (error instanceof Error ? error.message : String(error)),
		);
	}
}

/**
 * Initialize MongoDB server
 * Returns the connection URI
 */
export async function initializeMongoServer(): Promise<string> {
	// Allow disabling MongoDB via environment variable
	if (process.env.DISABLE_MONGODB === "true") {
		logger.warn("MongoDB disabled via DISABLE_MONGODB environment variable");
		throw new Error("MongoDB disabled by configuration");
	}

	if (isDev) {
		// Development mode: Use Docker
		logger.info("Running in DEVELOPMENT mode - attempting to use Docker MongoDB");
		const dockerRunning = await isDockerMongoRunning();

		if (!dockerRunning) {
			await startDockerMongo();
			// Wait a bit for Docker MongoDB to be ready
			await new Promise((resolve) => setTimeout(resolve, 2000));
		} else {
			logger.info("Docker MongoDB is already running");
			dockerMongoRunning = true;
		}

		return "mongodb://localhost:27018/taskboard_dev";
	} else {
		// Production mode: Use embedded MongoDB
		logger.info("Running in PRODUCTION mode - using embedded MongoDB");
		return await startEmbeddedMongo();
	}
}

/**
 * Stop MongoDB server
 */
export async function stopMongoServer(): Promise<void> {
	if (mongoServer) {
		try {
			logger.info("Stopping embedded MongoDB...");
			await mongoServer.stop();
			mongoServer = null;
			logger.info("Embedded MongoDB stopped");
		} catch (error) {
			logger.error("Error stopping embedded MongoDB:", error);
		}
	}

	// Note: We don't stop Docker in dev mode as it might be used by other processes
	// and the user can manage it manually
}

/**
 * Get MongoDB connection status
 */
export function getMongoServerStatus(): {
	isRunning: boolean;
	mode: "docker" | "embedded" | "none";
} {
	if (isDev && dockerMongoRunning) {
		return { isRunning: true, mode: "docker" };
	}
	if (mongoServer) {
		return { isRunning: true, mode: "embedded" };
	}
	return { isRunning: false, mode: "none" };
}
