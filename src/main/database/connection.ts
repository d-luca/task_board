import mongoose from "mongoose";
import { app } from "electron";

const isDev = !app.isPackaged;
const MONGODB_URI = isDev ? "mongodb://localhost:27018/taskboard_dev" : "mongodb://localhost:27018/taskboard";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
	if (isConnected) {
		console.log("MongoDB already connected");
		return;
	}

	try {
		await mongoose.connect(MONGODB_URI);
		isConnected = true;
		console.log("MongoDB connected successfully to:", MONGODB_URI);

		mongoose.connection.on("error", (error) => {
			console.error("MongoDB connection error:", error);
			isConnected = false;
		});

		mongoose.connection.on("disconnected", () => {
			console.log("MongoDB disconnected");
			isConnected = false;
		});
	} catch (error) {
		console.error("MongoDB connection error:", error);
		throw error;
	}
}

export async function disconnectDatabase(): Promise<void> {
	if (!isConnected) {
		return;
	}

	try {
		await mongoose.disconnect();
		isConnected = false;
		console.log("MongoDB disconnected successfully");
	} catch (error) {
		console.error("MongoDB disconnect error:", error);
		throw error;
	}
}

export function getDatabaseStatus(): boolean {
	return isConnected;
}
