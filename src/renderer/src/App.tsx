import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectList } from "./components/ProjectList";
import { ProjectDialog } from "./components/ProjectDialog";
import { TaskDialog } from "./components/TaskDialog";
import { EmptyState } from "./components/EmptyState";
import { KanbanBoard } from "./components/KanbanBoard";
import { useStore } from "./store/useStore";

function App(): React.JSX.Element {
	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);
	const { projects, currentProjectId, createProject, createTask, getCurrentProject } = useStore();

	const currentProject = getCurrentProject();

	const handleCreateProject = async (data: {
		name: string;
		description?: string;
		color?: string;
		icon?: string;
	}) => {
		await createProject(data);
	};

	const handleCreateTask = async (data: {
		title: string;
		description?: string;
		status: "todo" | "in-progress" | "done";
		priority: "low" | "medium" | "high";
		labels?: string;
		dueDate?: string;
	}) => {
		if (!currentProjectId) return;

		// Parse labels from comma-separated string
		const labels = data.labels
			? data.labels
					.split(",")
					.map((l) => l.trim())
					.filter((l) => l.length > 0)
			: [];

		await createTask({
			projectId: currentProjectId,
			title: data.title,
			description: data.description,
			status: data.status,
			priority: data.priority,
			labels,
			dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
		});
	};

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
				) : (
					<div className="container mx-auto flex h-full flex-col p-8">
						<div className="mb-6">
							<h1 className="flex items-center gap-3 text-3xl font-bold">
								<span>{currentProject?.icon || "📋"}</span>
								<span>{currentProject?.name}</span>
							</h1>
							{currentProject?.description && (
								<p className="text-muted-foreground mt-2">{currentProject.description}</p>
							)}
						</div>

						<KanbanBoard onCreateTask={() => setTaskDialogOpen(true)} />
					</div>
				)}
			</AppLayout>

			<ProjectDialog
				open={projectDialogOpen}
				onOpenChange={setProjectDialogOpen}
				onSubmit={handleCreateProject}
			/>

			{currentProjectId && (
				<TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} onSubmit={handleCreateTask} />
			)}
		</>
	);
}

export default App;
