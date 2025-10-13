import { JSX } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ThemeToggle } from "../ThemeToggle";

interface SidebarProps {
	children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps): JSX.Element {
	return (
		<div className="flex h-full flex-col">
			<div className="border-border flex items-center justify-between border-b p-4">
				<h1 className="text-xl font-bold">Task Board</h1>
				<ThemeToggle />
			</div>
			<ScrollArea className="flex-1">
				<div className="p-4">{children}</div>
			</ScrollArea>
		</div>
	);
}
