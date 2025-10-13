import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Project } from "../../main/database/models/Project";
import { Task } from "../../main/database/models/Task";
import { exportToJSON, exportToCSV, createBackup } from "../../main/database/services/exportService";
import * as fs from "fs/promises";

// Mock electron app
jest.mock("electron", () => ({
	app: {
		getPath: jest.fn((name: string) => {
			if (name === "downloads") return "/mock/downloads";
			if (name === "userData") return "/mock/userData";
			return "/mock";
		}),
	},
}));

// Mock fs/promises
jest.mock("fs/promises", () => ({
	writeFile: jest.fn(),
	mkdir: jest.fn(),
	readdir: jest.fn(),
	stat: jest.fn(),
}));

describe("Export Service", () => {
	let mongoServer: MongoMemoryServer;

	beforeAll(async () => {
		// Start in-memory MongoDB server
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		await mongoose.connect(mongoUri);
	});

	afterAll(async () => {
		// Cleanup
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	beforeEach(async () => {
		// Clear database before each test
		await Project.deleteMany({});
		await Task.deleteMany({});
		jest.clearAllMocks();
	});

	describe("exportToJSON", () => {
		it("should export all projects and tasks to JSON", async () => {
			// Create test data
			const project = await Project.create({
				name: "Test Project",
				description: "Test Description",
				color: "#FF0000",
			});

			await Task.create({
				title: "Test Task",
				description: "Task Description",
				status: "todo",
				priority: "medium",
				projectId: project._id,
			});

			// Mock writeFile to capture the data
			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await exportToJSON({
				format: "json",
				scope: "all",
				includeArchived: false,
			});

			expect(result.success).toBe(true);
			expect(result.filePath).toMatch(/taskboard-export-.*\.json/);
			expect(mockWriteFile).toHaveBeenCalledTimes(1);

			// Check the data that was written
			const [, data] = mockWriteFile.mock.calls[0];
			const exportedData = JSON.parse(data);

			expect(exportedData.version).toBe("1.0");
			expect(exportedData.projects).toHaveLength(1);
			expect(exportedData.tasks).toHaveLength(1);
			expect(exportedData.projects[0].name).toBe("Test Project");
			expect(exportedData.tasks[0].title).toBe("Test Task");
		});

		it("should export only selected project", async () => {
			// Create test data
			const project1 = await Project.create({
				name: "Project 1",
				description: "Description 1",
				color: "#FF0000",
			});

			const project2 = await Project.create({
				name: "Project 2",
				description: "Description 2",
				color: "#00FF00",
			});

			await Task.create({
				title: "Task 1",
				status: "todo",
				priority: "medium",
				projectId: project1._id,
			});

			await Task.create({
				title: "Task 2",
				status: "done",
				priority: "high",
				projectId: project2._id,
			});

			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await exportToJSON({
				format: "json",
				scope: "single-project",
				projectId: project1._id.toString(),
				includeArchived: false,
			});

			expect(result.success).toBe(true);

			const [, data] = mockWriteFile.mock.calls[0];
			const exportedData = JSON.parse(data);

			expect(exportedData.projects).toHaveLength(1);
			expect(exportedData.projects[0].name).toBe("Project 1");
			expect(exportedData.tasks).toHaveLength(1);
			expect(exportedData.tasks[0].title).toBe("Task 1");
		});

		it("should exclude archived items by default", async () => {
			const project = await Project.create({
				name: "Test Project",
				archived: true,
			});

			await Task.create({
				title: "Active Task",
				status: "todo",
				priority: "medium",
				projectId: project._id,
				archived: false,
			});

			await Task.create({
				title: "Archived Task",
				status: "done",
				priority: "low",
				projectId: project._id,
				archived: true,
			});

			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await exportToJSON({
				format: "json",
				scope: "all",
				includeArchived: false,
			});

			expect(result.success).toBe(true);

			const [, data] = mockWriteFile.mock.calls[0];
			const exportedData = JSON.parse(data);

			expect(exportedData.projects).toHaveLength(0);
			expect(exportedData.tasks).toHaveLength(1);
			expect(exportedData.tasks[0].title).toBe("Active Task");
		});
	});
	describe("exportToCSV", () => {
		it("should export tasks to CSV format", async () => {
			const project = await Project.create({
				name: "CSV Project",
				description: "For CSV testing",
			});

			await Task.create({
				title: "CSV Task",
				description: "Task for CSV",
				status: "in-progress",
				priority: "high",
				projectId: project._id,
			});

			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await exportToCSV({
				format: "csv",
				scope: "all",
				includeArchived: false,
			});

			expect(result.success).toBe(true);
			expect(result.filePath).toMatch(/taskboard-export-.*\.csv/);
			expect(mockWriteFile).toHaveBeenCalledTimes(1);

			const [, csvData] = mockWriteFile.mock.calls[0];
			expect(csvData).toContain("ID,Title,Description,Status,Priority,Project");
			expect(csvData).toContain("CSV Task");
			expect(csvData).toContain("in-progress");
			expect(csvData).toContain("high");
			expect(csvData).toContain("CSV Project");
		});

		it("should handle special characters in CSV", async () => {
			const project = await Project.create({
				name: 'Project with "quotes"',
			});

			await Task.create({
				title: "Task with, comma",
				description: "Description with\nNewline",
				status: "todo",
				priority: "medium",
				projectId: project._id,
			});

			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await exportToCSV({
				format: "csv",
				scope: "all",
				includeArchived: false,
			});

			expect(result.success).toBe(true);

			const [, csvData] = mockWriteFile.mock.calls[0];
			// Check that special characters are escaped
			expect(csvData).toContain('"Task with, comma"');
			expect(csvData).toContain('"Description with\nNewline"');
			expect(csvData).toContain('"Project with ""quotes"""');
		});
	});

	describe("createBackup", () => {
		it("should create a full database backup", async () => {
			await Project.create({
				name: "Backup Project",
				description: "For backup testing",
			});

			const mockMkdir = fs.mkdir as jest.Mock;
			mockMkdir.mockResolvedValue(undefined);

			const mockWriteFile = fs.writeFile as jest.Mock;
			mockWriteFile.mockResolvedValue(undefined);

			const result = await createBackup();

			expect(result.success).toBe(true);
			expect(result.filePath).toMatch(/taskboard-backup-.*\.json/);
			expect(mockMkdir).toHaveBeenCalledWith(expect.stringContaining("backups"), {
				recursive: true,
			});
			expect(mockWriteFile).toHaveBeenCalledTimes(1);

			const [, data] = mockWriteFile.mock.calls[0];
			const backupData = JSON.parse(data);

			expect(backupData.type).toBe("full-backup");
			expect(backupData.version).toBe("1.0");
			expect(backupData.projects).toHaveLength(1);
		});
	});
});
