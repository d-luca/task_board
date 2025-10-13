import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectList } from "./components/ProjectList";
import { ProjectDialog } from "./components/ProjectDialog";
import { EmptyState } from "./components/EmptyState";
import { useStore } from "./store/useStore";

function App(): React.JSX.Element {
	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const { projects, currentProjectId, createProject, getCurrentProject } = useStore();

	const currentProject = getCurrentProject();

	const handleCreateProject = async (data: {
		name: string;
		description?: string;
		color?: string;
		icon?: string;
	}) => {
		await createProject(data);
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
					<div className="container mx-auto p-8">
						<div className="mb-6">
							<h1 className="flex items-center gap-3 text-3xl font-bold">
								<span>{currentProject?.icon || "📋"}</span>
								<span>{currentProject?.name}</span>
							</h1>
							{currentProject?.description && (
								<p className="text-muted-foreground mt-2">{currentProject.description}</p>
							)}
						</div>

						{/* TODO: Kanban board will go here in Phase 4 */}
						<div className="rounded-lg border-2 border-dashed p-12 text-center">
							<p className="text-muted-foreground">Kanban board coming in Phase 4...</p>
						</div>
					</div>
				)}
			</AppLayout>

			<ProjectDialog
				open={projectDialogOpen}
				onOpenChange={setProjectDialogOpen}
				onSubmit={handleCreateProject}
			/>
		</>
	);
}

export default App;
