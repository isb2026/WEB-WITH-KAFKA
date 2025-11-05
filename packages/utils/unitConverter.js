import Qty from 'js-quantities';

/**
 * ESG 특화 단위 변환 라이브러리
 * 에너지, 배출량, 부피, 질량 등의 단위를 표준 단위로 변환
 */

// ESG 표준 단위 정의
export const ESG_STANDARD_UNITS = {
	ENERGY: 'TJ', // 테라줄 (Terajoule)
	EMISSIONS: 'tCO2eq', // 톤 CO2 환산량
	VOLUME: 'L', // 리터
	MASS: 'kg', // 킬로그램
	POWER: 'MW', // 메가와트
	AREA: 'm2', // 제곱미터
};

// CO2 환산 계수 (예시 - 실제 값은 정확한 배출계수 사용 필요)
export const EMISSION_FACTORS = {
	// 연료별 CO2 배출계수 (tCO2/TJ)
	gasoline: 69.3, // 휘발유
	diesel: 74.1, // 경유
	naturalGas: 56.1, // 천연가스
	coal: 94.6, // 석탄
	lpg: 63.1, // LPG

	// 전력 배출계수 (tCO2/MWh) - 국가별로 다름
	electricity: 0.4781, // 한국 전력 배출계수 (2021년 기준)
};

/**
 * 에너지 단위를 TJ로 변환
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @returns {number} TJ로 변환된 값
 */
export const convertToTJ = (value, fromUnit) => {
	try {
		const qty = new Qty(value, fromUnit);
		return qty.to('TJ').scalar;
	} catch (error) {
		console.error(
			`에너지 단위 변환 오류: ${value} ${fromUnit} -> TJ`,
			error
		);
		return null;
	}
};

/**
 * 부피 단위를 리터로 변환
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @returns {number} L로 변환된 값
 */
export const convertToLiters = (value, fromUnit) => {
	try {
		const qty = new Qty(value, fromUnit);
		return qty.to('L').scalar;
	} catch (error) {
		console.error(`부피 단위 변환 오류: ${value} ${fromUnit} -> L`, error);
		return null;
	}
};

/**
 * 질량 단위를 킬로그램으로 변환
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @returns {number} kg으로 변환된 값
 */
export const convertToKg = (value, fromUnit) => {
	try {
		const qty = new Qty(value, fromUnit);
		return qty.to('kg').scalar;
	} catch (error) {
		console.error(`질량 단위 변환 오류: ${value} ${fromUnit} -> kg`, error);
		return null;
	}
};

/**
 * 전력 단위를 메가와트로 변환
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @returns {number} MW로 변환된 값
 */
export const convertToMW = (value, fromUnit) => {
	try {
		const qty = new Qty(value, fromUnit);
		return qty.to('MW').scalar;
	} catch (error) {
		console.error(`전력 단위 변환 오류: ${value} ${fromUnit} -> MW`, error);
		return null;
	}
};

/**
 * 연료 사용량을 CO2 배출량으로 변환
 * @param {number} energyValue - 에너지 값 (TJ)
 * @param {string} fuelType - 연료 타입
 * @returns {number} tCO2eq로 변환된 값
 */
export const convertEnergyToEmissions = (energyValue, fuelType) => {
	const emissionFactor = EMISSION_FACTORS[fuelType];
	if (!emissionFactor) {
		console.error(`지원하지 않는 연료 타입: ${fuelType}`);
		return null;
	}

	return energyValue * emissionFactor;
};

/**
 * 전력 사용량을 CO2 배출량으로 변환
 * @param {number} powerValue - 전력 값 (MWh)
 * @param {string} region - 지역 (배출계수가 다름)
 * @returns {number} tCO2eq로 변환된 값
 */
export const convertElectricityToEmissions = (powerValue, region = 'korea') => {
	const emissionFactor = EMISSION_FACTORS.electricity;
	return powerValue * emissionFactor;
};

/**
 * 범용 단위 변환기
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @param {string} toUnit - 목표 단위
 * @returns {number} 변환된 값
 */
export const convertUnit = (value, fromUnit, toUnit) => {
	try {
		const qty = new Qty(value, fromUnit);
		return qty.to(toUnit).scalar;
	} catch (error) {
		console.error(
			`단위 변환 오류: ${value} ${fromUnit} -> ${toUnit}`,
			error
		);
		return null;
	}
};

/**
 * ESG 데이터를 표준 단위로 일괄 변환
 * @param {Object} data - 변환할 데이터 객체
 * @param {Object} unitMap - 단위 매핑 정보
 * @returns {Object} 표준 단위로 변환된 데이터
 */
export const convertESGData = (data, unitMap) => {
	const convertedData = { ...data };

	Object.entries(unitMap).forEach(([field, { value, unit, targetUnit }]) => {
		const convertedValue = convertUnit(value, unit, targetUnit);
		if (convertedValue !== null) {
			convertedData[field] = {
				value: convertedValue,
				unit: targetUnit,
				originalValue: value,
				originalUnit: unit,
			};
		}
	});

	return convertedData;
};

/**
 * 단위 변환 결과를 포맷팅
 * @param {number} value - 값
 * @param {string} unit - 단위
 * @param {number} decimals - 소수점 자릿수
 * @returns {string} 포맷된 문자열
 */
export const formatWithUnit = (value, unit, decimals = 2) => {
	if (value === null || value === undefined) return 'N/A';

	const formattedValue =
		typeof value === 'number' ? value.toFixed(decimals) : value;

	return `${formattedValue} ${unit}`;
};

/**
 * 단위 변환 검증
 * @param {string} unit - 검증할 단위
 * @returns {boolean} 유효한 단위인지 여부
 */
export const isValidUnit = (unit) => {
	try {
		new Qty(1, unit);
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * 지원하는 단위 목록 조회
 * @param {string} category - 카테고리 (energy, volume, mass, power)
 * @returns {Array} 지원하는 단위 목록
 */
export const getSupportedUnits = (category) => {
	const units = {
		energy: [
			'J',
			'kJ',
			'MJ',
			'GJ',
			'TJ',
			'Wh',
			'kWh',
			'MWh',
			'GWh',
			'TWh',
			'cal',
			'kcal',
			'BTU',
		],
		volume: ['L', 'mL', 'kL', 'm3', 'cm3', 'gal', 'ft3'],
		mass: ['g', 'kg', 't', 'lb', 'oz'],
		power: ['W', 'kW', 'MW', 'GW', 'TW', 'hp'],
		area: ['m2', 'km2', 'cm2', 'ft2', 'acre', 'ha'],
		emissions: ['tCO2eq', 'kgCO2eq', 'gCO2eq', 'MtCO2eq'],
	};

	return units[category] || [];
};

// ESG 특화 변환 함수들
export const esgConverters = {
	// 에너지를 TJ로 변환
	toTJ: (value, unit) => convertToTJ(value, unit),

	// 배출량을 tCO2eq로 변환
	toTCO2eq: (energyTJ, fuelType) =>
		convertEnergyToEmissions(energyTJ, fuelType),

	// 전력을 배출량으로 변환
	electricityToEmissions: (mwh) => convertElectricityToEmissions(mwh),

	// 부피를 리터로 변환
	toLiters: (value, unit) => convertToLiters(value, unit),

	// 질량을 kg으로 변환
	toKg: (value, unit) => convertToKg(value, unit),

	// 전력을 MW로 변환
	toMW: (value, unit) => convertToMW(value, unit),
};

/**
 * 소숫점 처리 옵션
 */
export const DECIMAL_OPTIONS = {
	ROUND: 'round',
	FLOOR: 'floor',
	CEIL: 'ceil',
	TRUNCATE: 'truncate',
};

/**
 * 기본 소숫점 처리 설정
 */
export const DEFAULT_DECIMAL_CONFIG = {
	method: DECIMAL_OPTIONS.ROUND,
	places: 2,
	minValue: 0.01,
	maxValue: 999999.99,
};

/**
 * 소숫점 처리 함수
 * @param {number} value - 처리할 값
 * @param {Object} config - 소숫점 처리 설정
 * @returns {number} 처리된 값
 */
export const processDecimal = (value, config = {}) => {
	const {
		method = DEFAULT_DECIMAL_CONFIG.method,
		places = DEFAULT_DECIMAL_CONFIG.places,
		minValue = DEFAULT_DECIMAL_CONFIG.minValue,
		maxValue = DEFAULT_DECIMAL_CONFIG.maxValue,
	} = config;

	if (value === null || value === undefined || isNaN(value)) {
		return null;
	}

	let processedValue = value;

	switch (method) {
		case DECIMAL_OPTIONS.ROUND:
			processedValue =
				Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
			break;
		case DECIMAL_OPTIONS.FLOOR:
			processedValue =
				Math.floor(value * Math.pow(10, places)) / Math.pow(10, places);
			break;
		case DECIMAL_OPTIONS.CEIL:
			processedValue =
				Math.ceil(value * Math.pow(10, places)) / Math.pow(10, places);
			break;
		case DECIMAL_OPTIONS.TRUNCATE:
			processedValue =
				Math.trunc(value * Math.pow(10, places)) / Math.pow(10, places);
			break;
		default:
			processedValue =
				Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
	}

	processedValue = Math.max(minValue, Math.min(maxValue, processedValue));

	return processedValue;
};

/**
 * ItemProgress용 단위 변환 함수들
 */

/**
 * ItemProgress에서 개수 변환
 * @param {number} value - 변환할 값
 * @param {string} fromUnit - 원본 단위
 * @param {Object} progressInfo - ItemProgress 정보
 * @param {Object} decimalConfig - 소숫점 처리 설정
 * @returns {number} 변환된 개수
 */
export const convertToEaFromProgress = (
	value,
	fromUnit,
	progressInfo,
	decimalConfig = {}
) => {
	try {
		if (fromUnit === 'ea') {
			return processDecimal(value, decimalConfig);
		}

		if (!progressInfo?.unitWeight || !progressInfo?.unitTypeName) {
			console.warn('ItemProgress에 단위 정보가 없습니다:', progressInfo);
			return null;
		}

		const weightValue = progressInfo.unitWeight;
		const weightUnit = progressInfo.unitTypeName;

		// 입력값을 단위 중량과 같은 단위로 변환
		const convertedValue = convertUnit(value, fromUnit, weightUnit);
		if (convertedValue === null) return null;

		// 변환된 값 / 단위 중량 = 개수
		const eaCount = convertedValue / weightValue;

		// 소숫점 처리 적용
		return processDecimal(eaCount, decimalConfig);
	} catch (error) {
		console.error(
			`ItemProgress 개수 변환 오류: ${value} ${fromUnit} -> ea`,
			error
		);
		return null;
	}
};

/**
 * ItemProgress에서 개수에서 다른 단위로 변환
 * @param {number} value - 변환할 개수
 * @param {string} toUnit - 목표 단위
 * @param {Object} progressInfo - ItemProgress 정보
 * @param {Object} decimalConfig - 소숫점 처리 설정
 * @returns {number} 변환된 값
 */
export const convertFromEaToProgress = (
	value,
	toUnit,
	progressInfo,
	decimalConfig = {}
) => {
	try {
		if (toUnit === 'ea') {
			return processDecimal(value, decimalConfig);
		}

		if (!progressInfo?.unitWeight || !progressInfo?.unitTypeName) {
			console.warn('ItemProgress에 단위 정보가 없습니다:', progressInfo);
			return null;
		}

		const weightValue = progressInfo.unitWeight;
		const weightUnit = progressInfo.unitTypeName;

		// 개수 * 단위 중량 = 총 중량
		const totalWeight = value * weightValue;

		// 목표 단위로 변환
		const convertedValue = convertUnit(totalWeight, weightUnit, toUnit);
		if (convertedValue === null) return null;

		// 소숫점 처리 적용
		return processDecimal(convertedValue, decimalConfig);
	} catch (error) {
		console.error(
			`ItemProgress 개수 변환 오류: ${value} ea -> ${toUnit}`,
			error
		);
		return null;
	}
};

export default {
	convertUnit,
	convertESGData,
	formatWithUnit,
	isValidUnit,
	getSupportedUnits,
	esgConverters,
	ESG_STANDARD_UNITS,
	EMISSION_FACTORS,
	// ItemProgress용 함수들 추가
	convertToEaFromProgress,
	convertFromEaToProgress,
	processDecimal,
	DECIMAL_OPTIONS,
	DEFAULT_DECIMAL_CONFIG,
};
