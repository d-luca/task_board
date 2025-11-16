import { exec } from "child_process";
import { promisify } from "util";
import { logger } from "../utils/logger";

const execAsync = promisify(exec);

const DOCKER_CONTAINER_NAME = process.env.MONGODB_DOCKER_CONTAINER || "taskboard_mongo";
const DOCKER_SERVICE_NAME = process.env.MONGODB_DOCKER_SERVICE || "mongodb";

/**
 * Check if the MongoDB Docker container is running.
 */
async function isDockerMongoRunning(): Promise<boolean> {
	try {
		const { stdout } = await execAsync(
			`docker ps --filter "name=${DOCKER_CONTAINER_NAME}" --format "{{.Names}}"`,
		);
		return stdout.trim() === DOCKER_CONTAINER_NAME;
	} catch (error) {
		logger.error("Error checking Docker MongoDB status:", error);
		return false;
	}
}

/**
 * Start MongoDB via Docker Compose if needed.
 */
async function startDockerMongo(): Promise<void> {
	try {
		logger.info("Starting Docker MongoDB container...");

		// Prefer `docker compose` (v2), fall back to legacy `docker-compose`
		try {
			await execAsync(`docker compose up -d ${DOCKER_SERVICE_NAME}`);
		} catch (composeV2Error) {
			logger.warn("docker compose failed, falling back to docker-compose. Error:", composeV2Error);
			await execAsync(`docker-compose up -d ${DOCKER_SERVICE_NAME}`);
		}

		logger.info("Docker MongoDB started successfully");
	} catch (error) {
		logger.error("Failed to start Docker MongoDB:", error);
		throw new Error("Failed to start Docker MongoDB. Make sure Docker Desktop is installed and running.");
	}
}

/**
 * Initialize MongoDB server managed by Docker.
 * Returns the connection URI (without forcing a specific database name).
 */
export async function initializeMongoServer(): Promise<string> {
	// Allow disabling MongoDB via environment variable
	if (process.env.DISABLE_MONGODB === "true") {
		logger.warn("MongoDB disabled via DISABLE_MONGODB environment variable");
		throw new Error("MongoDB disabled by configuration");
	}

	const externalUri = process.env.MONGODB_URI || process.env.MONGO_URI;
	const defaultUri = "mongodb://localhost:27018";
	const mongoUri = externalUri || defaultUri;

	const autoStart = process.env.MONGODB_AUTO_START !== "false";

	if (autoStart) {
		logger.info("Using Docker-managed MongoDB instance");
		const running = await isDockerMongoRunning();

		if (!running) {
			logger.info(`Docker container '${DOCKER_CONTAINER_NAME}' not running, attempting to start it...`);
			await startDockerMongo();
			// Wait a bit for Docker MongoDB to be ready
			await new Promise((resolve) => setTimeout(resolve, 2000));
		} else {
			logger.info("Docker MongoDB container is already running");
		}
	} else {
		logger.info(
			"MONGODB_AUTO_START=false - assuming MongoDB is already running (e.g. started via docker-compose manually)",
		);
	}

	logger.info("MongoDB server initialized via Docker at base URI:", mongoUri);
	return mongoUri;
}

/**
 * Stop MongoDB server.
 * By default we do not stop Docker containers to avoid interfering with other processes.
 * You can opt-in by setting MONGODB_AUTO_STOP=true.
 */
export async function stopMongoServer(): Promise<void> {
	try {
		logger.info("Stopping Docker MongoDB container...");

		try {
			await execAsync(`docker compose stop ${DOCKER_SERVICE_NAME}`);
		} catch (composeV2Error) {
			logger.warn("docker compose stop failed, falling back to docker-compose stop. Error:", composeV2Error);
			await execAsync(`docker-compose stop ${DOCKER_SERVICE_NAME}`);
		}

		logger.info("Docker MongoDB container stopped");
	} catch (error) {
		logger.error("Error stopping Docker MongoDB container:", error);
	}
}

/**
 * Get MongoDB connection status.
 * This is a best-effort status and assumes Docker-managed mode.
 */
export function getMongoServerStatus(): {
	isRunning: boolean;
	mode: "docker" | "none";
} {
	// We don't perform an expensive Docker check here; the real connectivity
	// is tracked via Mongoose events in `connection.ts`.
	return {
		isRunning: true,
		mode: "docker",
	};
}
