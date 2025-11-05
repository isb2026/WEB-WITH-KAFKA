// ESG 단위 변환 라이브러리 타입 정의

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

export interface ESGDataConversion {
	[field: string]: ConversionResult;
}

export interface UnitMapping {
	[field: string]: {
		value: number;
		unit: string;
		targetUnit: string;
	};
}

export type FuelType = 'gasoline' | 'diesel' | 'naturalGas' | 'coal' | 'lpg';
export type Region = 'korea' | 'usa' | 'eu' | 'japan';
export type UnitCategory =
	| 'energy'
	| 'volume'
	| 'mass'
	| 'power'
	| 'area'
	| 'emissions';

// 함수 타입 정의
export declare function convertToTJ(
	value: number,
	fromUnit: string
): number | null;
export declare function convertToLiters(
	value: number,
	fromUnit: string
): number | null;
export declare function convertToKg(
	value: number,
	fromUnit: string
): number | null;
export declare function convertToMW(
	value: number,
	fromUnit: string
): number | null;

export declare function convertEnergyToEmissions(
	energyValue: number,
	fuelType: FuelType
): number | null;
export declare function convertElectricityToEmissions(
	powerValue: number,
	region?: Region
): number;

export declare function convertUnit(
	value: number,
	fromUnit: string,
	toUnit: string
): number | null;
export declare function convertESGData(
	data: any,
	unitMap: UnitMapping
): ESGDataConversion;

export declare function formatWithUnit(
	value: number,
	unit: string,
	decimals?: number
): string;
export declare function isValidUnit(unit: string): boolean;
export declare function getSupportedUnits(category: UnitCategory): string[];

export interface ESGConverters {
	toTJ: (value: number, unit: string) => number | null;
	toTCO2eq: (energyTJ: number, fuelType: FuelType) => number | null;
	electricityToEmissions: (mwh: number) => number;
	toLiters: (value: number, unit: string) => number | null;
	toKg: (value: number, unit: string) => number | null;
	toMW: (value: number, unit: string) => number | null;
}

export declare const ESG_STANDARD_UNITS: ESGStandardUnits;
export declare const EMISSION_FACTORS: EmissionFactors;
export declare const esgConverters: ESGConverters;
export declare const convertToEaFromProgress: (
	value: number,
	fromUnit: string,
	progressInfo: any,
	decimalConfig?: any
) => number | null;
export declare const convertFromEaToProgress: (
	value: number,
	toUnit: string,
	progressInfo: any,
	decimalConfig?: any
) => number | null;
export declare const processDecimal: (
	value: number,
	config?: any
) => number | null;
export declare const DECIMAL_OPTIONS: any;
export declare const DEFAULT_DECIMAL_CONFIG: any;

declare const unitConverter: {
	convertUnit: typeof convertUnit;
	convertESGData: typeof convertESGData;
	formatWithUnit: typeof formatWithUnit;
	isValidUnit: typeof isValidUnit;
	getSupportedUnits: typeof getSupportedUnits;
	esgConverters: ESGConverters;
	ESG_STANDARD_UNITS: ESGStandardUnits;
	EMISSION_FACTORS: EmissionFactors;
	convertToEaFromProgress: typeof convertToEaFromProgress;
	convertFromEaToProgress: typeof convertFromEaToProgress;
	processDecimal: typeof processDecimal;
	DECIMAL_OPTIONS: any;
	DEFAULT_DECIMAL_CONFIG: any;
};

export default unitConverter;
