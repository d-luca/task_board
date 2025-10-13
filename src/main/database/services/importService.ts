import { Project } from "../models/Project";
import { Task } from "../models/Task";
import fs from "fs/promises";
import { Types } from "mongoose";

export interface ImportOptions {
	filePath: string;
	mode: "merge" | "replace";
	validateOnly?: boolean;
}

export interface ImportResult {
	success: boolean;
	imported?: {
		projects: number;
		tasks: number;
	};
	errors?: string[];
	warnings?: string[];
}

interface ImportData {
	version?: string;
	projects: any[];
	tasks: any[];
	type?: string;
	backupDate?: string;
	exportDate?: string;
}

/**
 * Import data from JSON file
 */
export async function importFromJSON(options: ImportOptions): Promise<ImportResult> {
	try {
		// Read file
		const fileContent = await fs.readFile(options.filePath, "utf-8");
		const data: ImportData = JSON.parse(fileContent);

		// Validate data structure
		const validation = validateImportData(data);
		if (!validation.valid) {
			return {
				success: false,
				errors: validation.errors,
			};
		}

		// If validation only, return success
		if (options.validateOnly) {
			return {
				success: true,
				imported: {
					projects: data.projects.length,
					tasks: data.tasks.length,
				},
				warnings: validation.warnings,
			};
		}

		// Perform import based on mode
		if (options.mode === "replace") {
			// Clear existing data
			await Project.deleteMany({});
			await Task.deleteMany({});
		}

		// Import projects
		const projectIdMap = new Map<string, string>(); // old ID -> new ID
		const importedProjects: any[] = [];

		for (const projectData of data.projects) {
			const oldId = projectData._id.toString();

			// Create new project (without _id to let MongoDB generate new one)
			const { _id, ...projectFields } = projectData;
			const newProject = await Project.create({
				...projectFields,
				createdAt: projectData.createdAt ? new Date(projectData.createdAt) : new Date(),
				updatedAt: projectData.updatedAt ? new Date(projectData.updatedAt) : new Date(),
			});

			projectIdMap.set(oldId, newProject._id.toString());
			importedProjects.push(newProject);
		}

		// Import tasks
		const importedTasks: any[] = [];

		for (const taskData of data.tasks) {
			// Map old project ID to new project ID
			const oldProjectId = taskData.projectId.toString();
			const newProjectId = projectIdMap.get(oldProjectId);

			if (!newProjectId) {
				// Skip tasks with invalid project references
				continue;
			}

			// Create new task
			const { _id, ...taskFields } = taskData;
			const newTask = await Task.create({
				...taskFields,
				projectId: newProjectId,
				createdAt: taskData.createdAt ? new Date(taskData.createdAt) : new Date(),
				updatedAt: taskData.updatedAt ? new Date(taskData.updatedAt) : new Date(),
				dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
			});

			importedTasks.push(newTask);
		}

		return {
			success: true,
			imported: {
				projects: importedProjects.length,
				tasks: importedTasks.length,
			},
			warnings: validation.warnings,
		};
	} catch (error) {
		return {
			success: false,
			errors: [error instanceof Error ? error.message : "Unknown error during import"],
		};
	}
}

/**
 * Restore from backup file
 */
export async function restoreFromBackup(backupPath: string): Promise<ImportResult> {
	try {
		// Read backup file
		const fileContent = await fs.readFile(backupPath, "utf-8");
		const data: ImportData = JSON.parse(fileContent);

		// Validate backup data
		if (data.type !== "full-backup") {
			return {
				success: false,
				errors: ["Invalid backup file format"],
			};
		}

		// Clear existing data
		await Project.deleteMany({});
		await Task.deleteMany({});

		// Restore projects (keep original IDs for backup restoration)
		const importedProjects: any[] = [];
		for (const projectData of data.projects) {
			const project = await Project.create({
				_id: new Types.ObjectId(projectData._id),
				...projectData,
				createdAt: new Date(projectData.createdAt),
				updatedAt: new Date(projectData.updatedAt),
			});
			importedProjects.push(project);
		}

		// Restore tasks
		const importedTasks: any[] = [];
		for (const taskData of data.tasks) {
			const task = await Task.create({
				_id: new Types.ObjectId(taskData._id),
				...taskData,
				projectId: taskData.projectId,
				createdAt: new Date(taskData.createdAt),
				updatedAt: new Date(taskData.updatedAt),
				dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
			});
			importedTasks.push(task);
		}

		return {
			success: true,
			imported: {
				projects: importedProjects.length,
				tasks: importedTasks.length,
			},
		};
	} catch (error) {
		return {
			success: false,
			errors: [error instanceof Error ? error.message : "Unknown error during restore"],
		};
	}
}

/**
 * Validate import data structure
 */
function validateImportData(data: any): {
	valid: boolean;
	errors?: string[];
	warnings?: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check if data exists
	if (!data) {
		errors.push("No data found in file");
		return { valid: false, errors };
	}

	// Check for required fields
	if (!Array.isArray(data.projects)) {
		errors.push("Missing or invalid 'projects' array");
	}

	if (!Array.isArray(data.tasks)) {
		errors.push("Missing or invalid 'tasks' array");
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Validate projects
	data.projects.forEach((project: any, index: number) => {
		if (!project.name) {
			errors.push(`Project at index ${index} is missing 'name' field`);
		}
		if (!project._id) {
			errors.push(`Project at index ${index} is missing '_id' field`);
		}
	});

	// Validate tasks
	const projectIds = new Set(data.projects.map((p: any) => p._id.toString()));
	data.tasks.forEach((task: any, index: number) => {
		if (!task.title) {
			errors.push(`Task at index ${index} is missing 'title' field`);
		}
		if (!task._id) {
			errors.push(`Task at index ${index} is missing '_id' field`);
		}
		if (!task.projectId) {
			errors.push(`Task at index ${index} is missing 'projectId' field`);
		} else if (!projectIds.has(task.projectId.toString())) {
			warnings.push(`Task "${task.title}" references non-existent project (will be skipped)`);
		}
		if (!["todo", "in-progress", "done"].includes(task.status)) {
			warnings.push(`Task "${task.title}" has invalid status: ${task.status} (will be set to 'todo')`);
		}
	});

	return {
		valid: errors.length === 0,
		errors: errors.length > 0 ? errors : undefined,
		warnings: warnings.length > 0 ? warnings : undefined,
	};
}
