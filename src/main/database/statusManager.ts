import { BrowserWindow } from "electron";

export interface DatabaseStatus {
	isConnected: boolean;
	isInitializing: boolean;
	error?: string;
	message?: string;
}

let currentStatus: DatabaseStatus = {
	isConnected: false,
	isInitializing: false,
};

export function getDatabaseStatus(): DatabaseStatus {
	return { ...currentStatus };
}

export function updateDatabaseStatus(status: Partial<DatabaseStatus>): void {
	currentStatus = {
		...currentStatus,
		...status,
	};

	// Broadcast to all windows
	BrowserWindow.getAllWindows().forEach((window) => {
		window.webContents.send("database-status", currentStatus);
	});
}

export function setInitializing(message: string): void {
	updateDatabaseStatus({
		isInitializing: true,
		isConnected: false,
		message,
		error: undefined,
	});
}

export function setConnected(): void {
	updateDatabaseStatus({
		isInitializing: false,
		isConnected: true,
		message: "Database connected successfully",
		error: undefined,
	});
}

export function setError(error: string): void {
	updateDatabaseStatus({
		isInitializing: false,
		isConnected: false,
		error,
		message: undefined,
	});
}
