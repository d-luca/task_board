import { ExportAPI } from "./export";
import { ImportAPI } from "./import.";
import { ProjectAPI } from "./project";
import { TaskAPI } from "./task";

export interface API {
	project: ProjectAPI;
	task: TaskAPI;
	export: ExportAPI;
	import: ImportAPI;
	onOpenTaskDialog: (callback: () => void) => () => void;
	onOpenProjectDialog: (callback: () => void) => () => void;
	onOpenExportDialog: (callback: () => void) => () => void;
	onOpenImportDialog: (callback: () => void) => () => void;
}
