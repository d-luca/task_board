import { Skeleton } from "../ui/skeleton";

export function ProjectListSkeleton(): React.ReactElement {
	return (
		<div className="space-y-1 p-2">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex items-center gap-3 rounded-lg p-2">
					{/* Color indicator */}
					<Skeleton className="size-2 rounded-full" />

					{/* Icon */}
					<Skeleton className="size-4" />

					{/* Project name */}
					<Skeleton className="h-4 flex-1" />
				</div>
			))}
		</div>
	);
}
