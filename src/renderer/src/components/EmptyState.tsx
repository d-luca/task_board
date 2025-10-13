import { FolderPlus, Inbox } from "lucide-react";
import { Button } from "./ui/button";
import { JSX } from "react";

interface EmptyStateProps {
	type: "no-projects" | "no-project-selected";
	onCreateProject?: () => void;
}

export function EmptyState({ type, onCreateProject }: EmptyStateProps): JSX.Element {
	if (type === "no-projects") {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<FolderPlus className="text-muted-foreground mb-4 h-20 w-20" />
				<h2 className="mb-2 text-2xl font-semibold">No Projects Yet</h2>
				<p className="text-muted-foreground mb-6 max-w-md">
					Get started by creating your first project. Organize your tasks, track progress, and achieve your
					goals.
				</p>
				{onCreateProject && (
					<Button onClick={onCreateProject} size="lg">
						<FolderPlus className="mr-2 h-5 w-5" />
						Create Your First Project
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col items-center justify-center p-8 text-center">
			<Inbox className="text-muted-foreground mb-4 h-20 w-20" />
			<h2 className="mb-2 text-2xl font-semibold">No Project Selected</h2>
			<p className="text-muted-foreground max-w-md">
				Select a project from the sidebar to view and manage its tasks.
			</p>
		</div>
	);
}
