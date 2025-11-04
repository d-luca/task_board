import { useState, useEffect, useCallback, JSX } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectList } from "./components/project-list";
import { ProjectDialog } from "./components/project";
import { TaskDialog } from "./components/task";
import { ExportDialog } from "./components/export";
import { ImportDialog } from "./components/import";
import { EmptyState } from "./components/EmptyState";
import { ProjectView } from "./components/ProjectView";
import { LoadingScreen } from "./components/LoadingScreen";
import { useStore } from "./store/useStore";
import type { Task } from "./types/task";
import { TaskStatus, TaskPriority } from "./types/task";
import type { DatabaseStatus } from "../../preload/types/api";

function App(): JSX.Element {
	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [editingProject, setEditingProject] = useState(false);
	const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
		isConnected: false,
		isInitializing: true,
		message: "Initializing...",
	});
	const {
		projects,
		currentProjectId,
		createProject,
		createTask,
		updateTask,
		updateProject,
		getCurrentProject,
	} = useStore();

	const currentProject = getCurrentProject();

	// Listen for database status updates
	useEffect(() => {
		// Get initial status
		window.api.getDatabaseStatus().then(setDbStatus);

		// Listen for status updates
		const unsubscribe = window.api.onDatabaseStatus((status: DatabaseStatus) => {
			setDbStatus(status);
		});

		return unsubscribe;
	}, []);

	// Listen for menu/tray triggered events
	useEffect(() => {
		const unsubscribeTask = window.api.onOpenTaskDialog(() => {
			setEditingTask(null);
			setTaskDialogOpen(true);
		});

		const unsubscribeProject = window.api.onOpenProjectDialog(() => {
			setEditingProject(false);
			setProjectDialogOpen(true);
		});

		const unsubscribeExport = window.api.onOpenExportDialog(() => {
			setExportDialogOpen(true);
		});

		const unsubscribeImport = window.api.onOpenImportDialog(() => {
			setImportDialogOpen(true);
		});

		return () => {
			unsubscribeTask();
			unsubscribeProject();
			unsubscribeExport();
			unsubscribeImport();
		};
	}, []);

	const handleCreateProject = useCallback(
		async (data: { name: string; description?: string; color?: string; icon?: string }): Promise<void> => {
			if (editingProject && currentProject) {
				await updateProject(currentProject._id, data);
				setEditingProject(false);
			} else {
				await createProject(data);
			}
		},
		[editingProject, currentProject, updateProject, createProject],
	);

	const handleCreateTask = useCallback(
		async (data: {
			title: string;
			description?: string;
			status: TaskStatus;
			priority: TaskPriority;
			labels?: string;
			dueDate?: string;
		}): Promise<void> => {
			if (!currentProjectId) return;

			// Parse labels from comma-separated string
			const labels = data.labels
				? data.labels
						.split(",")
						.map((l) => l.trim())
						.filter((l) => l.length > 0)
				: [];

			if (editingTask) {
				await updateTask(editingTask._id, {
					title: data.title,
					description: data.description,
					status: data.status,
					priority: data.priority,
					labels,
					dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
				});
				setEditingTask(null);
			} else {
				await createTask({
					projectId: currentProjectId,
					title: data.title,
					description: data.description,
					status: data.status,
					priority: data.priority,
					labels,
					dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
				});
			}
		},
		[currentProjectId, editingTask, updateTask, createTask],
	);

	const handleEditTask = useCallback((task: Task): void => {
		setEditingTask(task);
		setTaskDialogOpen(true);
	}, []);

	const handleOnCreateTask = useCallback((): void => {
		setEditingTask(null);
		setTaskDialogOpen(true);
	}, []);

	const handleOpenEditProjectDialog = useCallback((): void => {
		setEditingProject(true);
		setProjectDialogOpen(true);
	}, []);

	// Show loading screen while database is initializing
	if (dbStatus.isInitializing) {
		return <LoadingScreen message={dbStatus.message} />;
	}

	// Show error if database failed but still render the app
	if (dbStatus.error) {
		console.error("Database error:", dbStatus.error);
	}

	return (
		<>
			<AppLayout
				sidebar={
					<Sidebar>
						<ProjectList onCreateProject={() => setProjectDialogOpen(true)} />
					</Sidebar>
				}
			>
				{projects.length === 0 ? (
					<EmptyState type="no-projects" onCreateProject={() => setProjectDialogOpen(true)} />
				) : !currentProjectId ? (
					<EmptyState type="no-project-selected" />
				) : currentProject ? (
					<ProjectView
						currentProject={currentProject}
						onOpenEditProjectDialog={handleOpenEditProjectDialog}
						onCreateTask={handleOnCreateTask}
						onEditTask={handleEditTask}
					/>
				) : null}
			</AppLayout>

			<ProjectDialog
				open={projectDialogOpen}
				onOpenChange={(open) => {
					setProjectDialogOpen(open);
					if (!open) setEditingProject(false);
				}}
				project={editingProject ? currentProject : undefined}
				onSubmit={handleCreateProject}
			/>

			{currentProjectId && (
				<TaskDialog
					open={taskDialogOpen}
					onOpenChange={(open) => {
						setTaskDialogOpen(open);
						if (!open) setEditingTask(null);
					}}
					task={editingTask || undefined}
					projectId={currentProjectId}
					onSubmit={handleCreateTask}
				/>
			)}

			<ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
			<ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
		</>
	);
}

export default App;
