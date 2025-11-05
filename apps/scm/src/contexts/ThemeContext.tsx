import React, { createContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
	children, 
	defaultTheme = 'light',
	storageKey = 'theme'
}) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(storageKey);
			const initialTheme = (stored as Theme) || defaultTheme;
			
			// Apply theme synchronously during initialization to prevent flicker
			const root = window.document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(initialTheme);
			root.setAttribute('data-theme', initialTheme);
			
			return initialTheme;
		}
		return defaultTheme;
	});

	const applyTheme = (newTheme: Theme) => {
		// Apply the theme to the document
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(newTheme);

		// Also set data attribute for compatibility
		root.setAttribute('data-theme', newTheme);
	};

	const setTheme = (newTheme: Theme) => {
		// Apply theme BEFORE setting state to prevent flicker
		applyTheme(newTheme);
		setThemeState(newTheme);
		localStorage.setItem(storageKey, newTheme);
	};

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	// Keep the useEffect for any edge cases, but theme should already be applied
	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}; 