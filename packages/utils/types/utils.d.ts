declare module '@repo/utils' {
	export const getItemFromStore: (
		key: string,
		defaultValue: any,
		store?: Storage
	) => any;

	export const setItemToStore: (
		key: string,
		payload: any,
		store?: Storage
	) => void;

	export const getStoreSpace: (store?: Storage) => number;

	export const getCookieValue: (name: string) => string | null;

	export const createCookie: (
		name: string,
		value: string,
		cookieExpireTime: number
	) => void;

	export const numberFormatter: (number: number, fixed?: number) => string;

	export const hexToRgb: (
		hexValue: string
	) => [number, number, number] | null;

	export const rgbColor: (color?: string) => string;

	export const rgbaColor: (color?: string, alpha?: number) => string;

	export const colors: string[];

	export const themeColors: {
		primary: string;
		secondary: string;
		success: string;
		info: string;
		warning: string;
		danger: string;
		light: string;
		dark: string;
	};

	export const grays: { [key: string]: string };
	export const darkGrays: { [key: string]: string };
	export const getGrays: (isDark: boolean) => { [key: string]: string };

	export const breakpoints: {
		[key: string]: number;
	};

	export const capitalize: (str: string) => string;

	export const isIterableArray: (arr: any) => boolean;

	export const getColor: (name: string) => string;

	export const flatRoutes: (routes: any[]) => any[];

	export const camelize: (str: string) => string;

	export const getFormattedDate: (type: string) => string;

	export const commaNumber: (number: number) => string;
	export const uncommaNumber: (str: string) => number;

	// Unit Converter 타입 정의
	export interface ESGStandardUnits {
		ENERGY: 'TJ';
		EMISSIONS: 'tCO2eq';
		VOLUME: 'L';
		MASS: 'kg';
		POWER: 'MW';
		AREA: 'm2';
	}

	export interface EmissionFactors {
		gasoline: number;
		diesel: number;
		naturalGas: number;
		coal: number;
		lpg: number;
		electricity: number;
	}

	export interface ConversionResult {
		value: number;
		unit: string;
		originalValue: number;
		originalUnit: string;
	}

	export type FuelType = 'gasoline' | 'diesel' | 'naturalGas' | 'coal' | 'lpg';
	export type Region = 'korea' | 'usa' | 'eu' | 'japan';

	export interface ESGConverters {
		toTJ: (value: number, unit: string) => number | null;
		toTCO2eq: (energyTJ: number, fuelType: FuelType) => number | null;
		electricityToEmissions: (mwh: number) => number;
		toLiters: (value: number, unit: string) => number | null;
		toKg: (value: number, unit: string) => number | null;
		toMW: (value: number, unit: string) => number | null;
	}

	export const ESG_STANDARD_UNITS: ESGStandardUnits;
	export const EMISSION_FACTORS: EmissionFactors;
	export const esgConverters: ESGConverters;

	export const convertUnit: (value: number, fromUnit: string, toUnit: string) => number | null;
	export const formatWithUnit: (value: number, unit: string, decimals?: number) => string;
}
