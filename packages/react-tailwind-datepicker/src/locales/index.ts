import { koLocale } from './ko';
import { enLocale } from './en';
import { thLocale } from './th';

export type SupportedLocale = 'ko' | 'en' | 'th';

export const locales = {
	ko: koLocale,
	en: enLocale,
	th: thLocale,
};

export const supportedLocales: SupportedLocale[] = ['ko', 'en', 'th'];

export { koLocale, enLocale, thLocale };
