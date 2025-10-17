import { JSX } from "react";
import { Skeleton } from "../ui/skeleton";

export function ProjectListSkeleton(): JSX.Element {
	return (
		<div className="flex flex-col gap-2 p-4">
			<div className="mb-2 flex items-center justify-between">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-8 w-8" />
			</div>
			{[1, 2, 3].map((i) => (
				<Skeleton key={i} className="h-12 w-full" />
			))}
		</div>
	);
}
