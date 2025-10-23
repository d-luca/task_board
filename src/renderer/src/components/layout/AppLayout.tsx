import { JSX } from "react";

interface AppLayoutProps {
	children: JSX.Element | JSX.Element[] | null;
	sidebar?: JSX.Element;
}

export function AppLayout({ children, sidebar }: AppLayoutProps): JSX.Element {
	return (
		<div className="bg-background flex h-screen w-screen overflow-hidden">
			{sidebar && <aside className="border-border bg-card w-64 border-r">{sidebar}</aside>}
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	);
}
