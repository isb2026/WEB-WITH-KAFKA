import { useTranslation, Trans } from 'react-i18next';
import { useCallback } from 'react';

// 1) 외부로 노출할 API 재-export
export { initI18n } from './i18nCore';
export { useTranslation, Trans };

// 2) 간단 t 훅
export const useT = (ns: string | string[] = 'common') => {
	const { t } = useTranslation(ns);
	return t;
};

// 3) 언어 상태 훅
export function useLocale(): [string, (lng: string) => Promise<void>] {
	const { i18n } = useTranslation();

	// useCallback으로 메모이즈 → 불필요한 리렌더 방지
	const setLang = useCallback(
		async (lng: string) => {
			if (i18n.language !== lng) await i18n.changeLanguage(lng);
		},
		[i18n]
	);

	return [i18n.language, setLang];
}
