import { JSX } from "react";
import { FolderOpen } from "lucide-react";

interface ProjectListEmptyProps {
	hasProjects: boolean;
}

export function ProjectListEmpty({ hasProjects }: ProjectListEmptyProps): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-center px-4 py-8 text-center">
			<FolderOpen className="text-muted-foreground mb-2 h-12 w-12" />
			<p className="text-muted-foreground text-sm">
				{!hasProjects ? "No projects yet. Create your first project to get started!" : "No archived projects"}
			</p>
		</div>
	);
}
