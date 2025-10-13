import "@testing-library/jest-dom";

// Extend Window interface for tests
declare global {
	interface Window {
		api: {
			projects: {
				getAll: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
				delete: jest.Mock;
				archive: jest.Mock;
				unarchive: jest.Mock;
			};
			tasks: {
				getByProject: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
				delete: jest.Mock;
				archive: jest.Mock;
				unarchive: jest.Mock;
			};
			export: {
				toJSON: jest.Mock;
				toCSV: jest.Mock;
				createBackup: jest.Mock;
				listBackups: jest.Mock;
			};
			import: {
				fromJSON: jest.Mock;
				restoreBackup: jest.Mock;
				selectFile: jest.Mock;
			};
			onOpenExportDialog: jest.Mock;
			onOpenImportDialog: jest.Mock;
		};
	}
}

// Mock window.api for all tests
global.window = {
	...global.window,
	api: {
		projects: {
			getAll: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			archive: jest.fn(),
			unarchive: jest.fn(),
		},
		tasks: {
			getByProject: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			archive: jest.fn(),
			unarchive: jest.fn(),
		},
		export: {
			toJSON: jest.fn(),
			toCSV: jest.fn(),
			createBackup: jest.fn(),
			listBackups: jest.fn(),
		},
		import: {
			fromJSON: jest.fn(),
			restoreBackup: jest.fn(),
			selectFile: jest.fn(),
		},
		onOpenExportDialog: jest.fn(),
		onOpenImportDialog: jest.fn(),
	},
} as any;

// Mock Electron IPC renderer
jest.mock("electron", () => ({
	ipcRenderer: {
		invoke: jest.fn(),
		on: jest.fn(),
		removeListener: jest.fn(),
	},
}));
