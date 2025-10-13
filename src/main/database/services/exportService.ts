import { Project } from "../models/Project";
import { Task } from "../models/Task";
import fs from "fs/promises";
import path from "path";
import { app } from "electron";

export interface ExportOptions {
	format: "json" | "csv";
	scope: "all" | "single-project" | "selected-tasks";
	projectId?: string;
	taskIds?: string[];
	includeArchived?: boolean;
}

export interface ExportResult {
	success: boolean;
	filePath?: string;
	error?: string;
}

/**
 * Export projects and tasks to JSON format
 */
export async function exportToJSON(options: ExportOptions): Promise<ExportResult> {
	try {
		let projects;
		let tasks;

		// Determine what to export based on scope
		if (options.scope === "all") {
			const query = options.includeArchived ? {} : { archived: { $ne: true } };
			projects = await Project.find(query).lean();
			tasks = await Task.find(query).lean();
		} else if (options.scope === "single-project" && options.projectId) {
			projects = await Project.findById(options.projectId).lean();
			const query = { projectId: options.projectId };
			if (!options.includeArchived) {
				Object.assign(query, { archived: { $ne: true } });
			}
			tasks = await Task.find(query).lean();
			projects = projects ? [projects] : [];
		} else if (options.scope === "selected-tasks" && options.taskIds) {
			tasks = await Task.find({ _id: { $in: options.taskIds } }).lean();
			// Get unique project IDs from selected tasks
			const projectIds = [...new Set(tasks.map((t) => t.projectId))];
			projects = await Project.find({ _id: { $in: projectIds } }).lean();
		} else {
			throw new Error("Invalid export scope or missing required parameters");
		}

		// Create export data structure
		const exportData = {
			version: "1.0",
			exportDate: new Date().toISOString(),
			projects: projects,
			tasks: tasks,
			metadata: {
				totalProjects: projects.length,
				totalTasks: tasks.length,
				scope: options.scope,
			},
		};

		// Generate filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `taskboard-export-${timestamp}.json`;
		const downloadsPath = app.getPath("downloads");
		const filePath = path.join(downloadsPath, fileName);

		// Write to file
		await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), "utf-8");

		return {
			success: true,
			filePath,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error during JSON export",
		};
	}
}

/**
 * Export tasks to CSV format
 */
export async function exportToCSV(options: ExportOptions): Promise<ExportResult> {
	try {
		let tasks;

		// Determine what to export based on scope
		if (options.scope === "all") {
			const query = options.includeArchived ? {} : { archived: { $ne: true } };
			tasks = await Task.find(query).lean();
		} else if (options.scope === "single-project" && options.projectId) {
			const query = { projectId: options.projectId };
			if (!options.includeArchived) {
				Object.assign(query, { archived: { $ne: true } });
			}
			tasks = await Task.find(query).lean();
		} else if (options.scope === "selected-tasks" && options.taskIds) {
			tasks = await Task.find({ _id: { $in: options.taskIds } }).lean();
		} else {
			throw new Error("Invalid export scope or missing required parameters");
		}

		// Get project names for tasks
		const projectIds = [...new Set(tasks.map((t) => t.projectId))];
		const projects = await Project.find({ _id: { $in: projectIds } }).lean();
		const projectMap = new Map(projects.map((p) => [p._id.toString(), p.name]));

		// Create CSV header
		const headers = [
			"ID",
			"Title",
			"Description",
			"Status",
			"Priority",
			"Project",
			"Due Date",
			"Created At",
			"Updated At",
			"Archived",
		];

		// Create CSV rows
		const rows = tasks.map((task) => {
			return [
				task._id.toString(),
				escapeCsvValue(task.title),
				escapeCsvValue(task.description || ""),
				task.status,
				task.priority || "",
				projectMap.get(task.projectId.toString()) || "Unknown",
				task.dueDate ? new Date(task.dueDate).toISOString() : "",
				new Date(task.createdAt).toISOString(),
				new Date(task.updatedAt).toISOString(),
				task.archived ? "Yes" : "No",
			];
		});

		// Combine header and rows
		const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

		// Generate filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `taskboard-export-${timestamp}.csv`;
		const downloadsPath = app.getPath("downloads");
		const filePath = path.join(downloadsPath, fileName);

		// Write to file
		await fs.writeFile(filePath, csvContent, "utf-8");

		return {
			success: true,
			filePath,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error during CSV export",
		};
	}
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCsvValue(value: string): string {
	if (!value) return "";

	// If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}

	return value;
}

/**
 * Create a full database backup
 */
export async function createBackup(): Promise<ExportResult> {
	try {
		const projects = await Project.find({}).lean();
		const tasks = await Task.find({}).lean();

		const backupData = {
			version: "1.0",
			backupDate: new Date().toISOString(),
			type: "full-backup",
			projects,
			tasks,
		};

		// Generate filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `taskboard-backup-${timestamp}.json`;
		const userDataPath = app.getPath("userData");
		const backupsDir = path.join(userDataPath, "backups");

		// Ensure backups directory exists
		await fs.mkdir(backupsDir, { recursive: true });

		const filePath = path.join(backupsDir, fileName);

		// Write to file
		await fs.writeFile(filePath, JSON.stringify(backupData, null, 2), "utf-8");

		return {
			success: true,
			filePath,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error during backup",
		};
	}
}

/**
 * List all available backups
 */
export async function listBackups(): Promise<string[]> {
	try {
		const userDataPath = app.getPath("userData");
		const backupsDir = path.join(userDataPath, "backups");

		// Ensure backups directory exists
		await fs.mkdir(backupsDir, { recursive: true });

		const files = await fs.readdir(backupsDir);
		const backupFiles = files
			.filter((file) => file.startsWith("taskboard-backup-") && file.endsWith(".json"))
			.sort()
			.reverse(); // Most recent first

		return backupFiles.map((file) => path.join(backupsDir, file));
	} catch (error) {
		return [];
	}
}
