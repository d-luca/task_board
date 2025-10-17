import { JSX } from "react";
import { Loader2 } from "lucide-react";

export function ProjectListLoading(): JSX.Element {
	return (
		<div className="bg-background/50 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
			<Loader2 className="text-primary h-8 w-8 animate-spin" />
		</div>
	);
}
