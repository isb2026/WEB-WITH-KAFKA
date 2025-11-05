import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useLocale } from '@repo/i18n';

export type Language = 'ko' | 'en';

export interface LanguageContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

interface LanguageProviderProps {
	children: ReactNode;
	defaultLanguage?: Language;
	storageKey?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
	defaultLanguage = 'ko',
	storageKey = 'language',
}) => {
	const [currentLanguage, setI18nLanguage] = useLocale();
	const [language, setLanguageState] = useState<Language>(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(storageKey);
			const initialLanguage = (stored as Language) || defaultLanguage;
			return initialLanguage;
		}
		return defaultLanguage;
	});

	const setLanguage = async (newLanguage: Language) => {
		setLanguageState(newLanguage);
		await setI18nLanguage(newLanguage);
		localStorage.setItem(storageKey, newLanguage);
	};

	const toggleLanguage = () => {
		const newLanguage = language === 'ko' ? 'en' : 'ko';
		setLanguage(newLanguage);
	};

	// Sync with i18n language
	useEffect(() => {
		if (currentLanguage !== language) {
			setLanguageState(currentLanguage as Language);
		}
	}, [currentLanguage]);

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage, toggleLanguage }}
		>
			{children}
		</LanguageContext.Provider>
	);
};
