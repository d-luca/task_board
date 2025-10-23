import { createContext, JSX, useContext, useEffect, useState } from "react";
import { ThemeEnum } from "./constants";

interface ThemeProviderProps {
	children: JSX.Element | JSX.Element[];
	defaultTheme?: ThemeEnum;
	storageKey?: string;
}

interface ThemeProviderState {
	theme: ThemeEnum;
	setTheme: (theme: ThemeEnum) => void;
}

const initialState: ThemeProviderState = {
	theme: ThemeEnum.SYSTEM,
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = ThemeEnum.SYSTEM,
	storageKey = "task-board-theme",
	...props
}: ThemeProviderProps): JSX.Element {
	const [theme, setTheme] = useState<ThemeEnum>(
		() => (localStorage.getItem(storageKey) as ThemeEnum) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: ThemeEnum) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeProviderState => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
