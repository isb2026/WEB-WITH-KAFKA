import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files

const detector = new LanguageDetector(null, {
	order: ['querystring', 'localStorage', 'navigator'],
	lookupQuerystring: 'lng',
	lookupLocalStorage: 'i18nextLng',
	caches: ['localStorage'],
});

export interface InitI18nParams {
	fallbackLng?: string;
	resources?: Resource;
	defaultNS?: string;
	ns?: string[];
}

const defaultResources: Resource = {
	en: {},
	ko: {},
};

export function initI18n({
	fallbackLng = 'en',
	resources = defaultResources,
	defaultNS = 'common',
	ns = ['common', 'vendor', 'menu'],
}: InitI18nParams = {}) {
	if (i18n.isInitialized) return i18n;

	// resources의 각 언어별 네임스페이스 키 추출
	const allNS = Object.values(resources).reduce<string[]>((acc, dict) => {
		return acc.concat(Object.keys(dict));
	}, []);
	// 중복 제거
	const nsList = Array.from(new Set([...allNS, ...ns]));

	i18n.use(detector)
		.use(initReactI18next)
		.init({
			resources,
			fallbackLng,
			ns: nsList,
			defaultNS,
			react: { useSuspense: true },
			interpolation: {
				escapeValue: false, // React already safes from xss
			},
			detection: {
				order: ['querystring', 'localStorage', 'navigator'],
				caches: ['localStorage'],
			},
		});

	return i18n;
}
