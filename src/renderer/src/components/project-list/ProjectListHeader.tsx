import { JSX } from "react";
import { Plus, Archive } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectListHeaderProps {
	showArchivedProjects: boolean;
	onCreateProject: () => void;
	onToggleArchived: () => void;
}

export function ProjectListHeader({
	showArchivedProjects,
	onCreateProject,
	onToggleArchived,
}: ProjectListHeaderProps): JSX.Element {
	return (
		<div className="border-b p-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Projects</h2>
				<Button size="sm" onClick={onCreateProject}>
					<Plus className="mr-1 h-4 w-4" />
					New
				</Button>
			</div>

			{/* Archive Toggle */}
			<Button
				variant={showArchivedProjects ? "secondary" : "ghost"}
				size="sm"
				className="w-full justify-start"
				onClick={onToggleArchived}
			>
				<Archive className="mr-2 h-4 w-4" />
				{showArchivedProjects ? "Hide" : "Show"} Archived
			</Button>
		</div>
	);
}
