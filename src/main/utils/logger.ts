import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

const logDir = path.join(app.getPath("userData"), "logs");
const logFile = path.join(logDir, `app-${new Date().toISOString().split("T")[0]}.log`);

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

function formatLogMessage(level: string, ...args: unknown[]): string {
	const timestamp = new Date().toISOString();
	const message = args
		.map((arg) => {
			if (arg instanceof Error) {
				return `${arg.message}\n${arg.stack}`;
			}
			if (typeof arg === "object") {
				try {
					return JSON.stringify(arg, null, 2);
				} catch {
					return String(arg);
				}
			}
			return String(arg);
		})
		.join(" ");
	return `[${timestamp}] [${level}] ${message}\n`;
}

function writeToFile(message: string): void {
	try {
		fs.appendFileSync(logFile, message, "utf8");
	} catch (error) {
		// Fallback to console if file write fails
		console.error("Failed to write to log file:", error);
	}
}

export const logger = {
	info: (...args: unknown[]) => {
		const message = formatLogMessage("INFO", ...args);
		console.log(...args);
		writeToFile(message);
	},

	error: (...args: unknown[]) => {
		const message = formatLogMessage("ERROR", ...args);
		console.error(...args);
		writeToFile(message);
	},

	warn: (...args: unknown[]) => {
		const message = formatLogMessage("WARN", ...args);
		console.warn(...args);
		writeToFile(message);
	},

	debug: (...args: unknown[]) => {
		const message = formatLogMessage("DEBUG", ...args);
		console.debug(...args);
		writeToFile(message);
	},

	getLogPath: () => logFile,
};
