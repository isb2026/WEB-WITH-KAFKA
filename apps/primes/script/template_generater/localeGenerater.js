import fs from 'fs';
import path from 'path';
import { toCamelCase, toPascalCase } from '../utils/stringUtils.js';
import { safeGet } from '../utils/compatibilityUtils.js';

/**
 * 설정 파일에서 필요한 번역 키들을 추출하여 자동 생성하는 클래스
 */
class LocaleGenerator {
	constructor() {
		this.localesDir = path.join(process.cwd(), 'src/locales');
		this.generatedKeys = {
			ko: {},
			en: {},
		};
	}

	/**
	 * 솔루션 설정에서 번역 키를 추출합니다
	 * @param {Object} solutionConfig - 솔루션 설정 객체
	 * @param {string} solutionName - 솔루션명
	 */
	extractTranslationKeys(solutionConfig, solutionName) {
		const modules = safeGet(solutionConfig, 'modules', {});

		Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
			this.extractModuleKeys(moduleKey, moduleConfig, solutionName);
		});
	}

	/**
	 * 모듈 설정에서 번역 키를 추출합니다
	 * @param {string} moduleKey - 모듈 키
	 * @param {Object} moduleConfig - 모듈 설정
	 * @param {string} solutionName - 솔루션명
	 */
	extractModuleKeys(moduleKey, moduleConfig, solutionName) {
		const moduleNameCamel = toCamelCase(moduleKey);
		const moduleNamePascal = toPascalCase(moduleKey);
		const moduleName = safeGet(moduleConfig, 'name', '');
		const tabs = safeGet(moduleConfig, 'tabs', []);
		const actions = safeGet(moduleConfig, 'actions', []);
		const hasCustomSelect = safeGet(moduleConfig, 'customSelect', null);

		// 1. Tab Titles 추출
		this.addTabTitles(moduleNameCamel, moduleName, solutionName);

		// 2. Tab Labels 추출
		this.addTabLabels(tabs);

		// 3. Page Titles 추출
		this.addPageTitles(moduleNameCamel, moduleName, tabs, solutionName);

		// 4. Dialog Titles 추출
		this.addDialogTitles(moduleNameCamel, moduleName, actions);

		// 5. Custom Select Placeholders 추출
		if (hasCustomSelect) {
			this.addSelectPlaceholders(moduleNameCamel, moduleName);
		}

		// 6. 솔루션별 페이지 경로 추출
		this.addSolutionPageKeys(moduleNameCamel, moduleName, solutionName);
	}

	/**
	 * Tab Titles 번역 키 추가
	 */
	addTabTitles(moduleNameCamel, moduleName, solutionName) {
		const cleanModuleName = moduleName
			.replace(/\s관리$/, '')
			.replace(/\smanagement$/i, '');

		this.generatedKeys.ko[`tabs.titles.${moduleNameCamel}`] =
			cleanModuleName;
		this.generatedKeys.ko[`tabs.titles.${moduleNameCamel}Management`] =
			`${cleanModuleName} 관리`;

		this.generatedKeys.en[`tabs.titles.${moduleNameCamel}`] =
			this.translateToEnglish(cleanModuleName);
		this.generatedKeys.en[`tabs.titles.${moduleNameCamel}Management`] =
			`${this.translateToEnglish(cleanModuleName)} Management`;
	}

	/**
	 * Tab Labels 번역 키 추가
	 */
	addTabLabels(tabs) {
		tabs.forEach((tab) => {
			const tabId = safeGet(tab, 'id', '');
			const tabName = safeGet(tab, 'name', '');

			if (tabId && tabName) {
				this.generatedKeys.ko[`tabs.labels.${tabId}`] = tabName;
				this.generatedKeys.en[`tabs.labels.${tabId}`] =
					this.translateToEnglish(tabName);
			}
		});
	}

	/**
	 * Page Titles 번역 키 추가
	 */
	addPageTitles(moduleNameCamel, moduleName, tabs, solutionName) {
		const cleanModuleName = moduleName.replace(/\s관리$/, '');

		// 기본 페이지 타이틀
		this.generatedKeys.ko[`pages.titles.${moduleNameCamel}List`] =
			`${cleanModuleName} 목록`;
		this.generatedKeys.en[`pages.titles.${moduleNameCamel}List`] =
			`${this.translateToEnglish(cleanModuleName)} List`;

		// 탭별 페이지 타이틀
		tabs.forEach((tab) => {
			const tabId = safeGet(tab, 'id', '');
			const tabName = safeGet(tab, 'name', '');

			if (tabId === 'related-list') {
				this.generatedKeys.ko[`pages.titles.${moduleNameCamel}Detail`] =
					`${cleanModuleName} 상세 목록`;
				this.generatedKeys.en[`pages.titles.${moduleNameCamel}Detail`] =
					`${this.translateToEnglish(cleanModuleName)} Detail List`;
			}
		});
	}

	/**
	 * Dialog Titles 번역 키 추가
	 */
	addDialogTitles(moduleNameCamel, moduleName, actions) {
		const cleanModuleName = moduleName.replace(/\s관리$/, '');

		actions.forEach((action) => {
			const actionType = safeGet(action, 'type', '');

			if (actionType === 'create') {
				this.generatedKeys.ko[
					`tabs.dialogs.${moduleNameCamel}Register`
				] = `${cleanModuleName} 등록`;
				this.generatedKeys.en[
					`tabs.dialogs.${moduleNameCamel}Register`
				] = `${this.translateToEnglish(cleanModuleName)} Register`;
			} else if (actionType === 'edit') {
				this.generatedKeys.ko[`tabs.dialogs.${moduleNameCamel}Edit`] =
					`${cleanModuleName} 수정`;
				this.generatedKeys.en[`tabs.dialogs.${moduleNameCamel}Edit`] =
					`${this.translateToEnglish(cleanModuleName)} Edit`;
			}
		});
	}

	/**
	 * Custom Select Placeholders 번역 키 추가
	 */
	addSelectPlaceholders(moduleNameCamel, moduleName) {
		const cleanModuleName = moduleName.replace(/\s관리$/, '');

		this.generatedKeys.ko[`select.${moduleNameCamel}Placeholder`] =
			`${cleanModuleName}을 선택하세요`;
		this.generatedKeys.en[`select.${moduleNameCamel}Placeholder`] =
			`Select ${this.translateToEnglish(cleanModuleName)}`;
	}

	/**
	 * 솔루션별 페이지 키 추가
	 */
	addSolutionPageKeys(moduleNameCamel, moduleName, solutionName) {
		const cleanModuleName = moduleName.replace(/\s관리$/, '');

		this.generatedKeys.ko[`pages.${solutionName}.${moduleNameCamel}.list`] =
			`${cleanModuleName} 목록`;
		this.generatedKeys.ko[
			`pages.${solutionName}.${moduleNameCamel}.management`
		] = `${cleanModuleName} 관리`;
		this.generatedKeys.ko[
			`pages.${solutionName}.${moduleNameCamel}.register`
		] = `${cleanModuleName} 등록`;

		this.generatedKeys.en[`pages.${solutionName}.${moduleNameCamel}.list`] =
			`${this.translateToEnglish(cleanModuleName)} List`;
		this.generatedKeys.en[
			`pages.${solutionName}.${moduleNameCamel}.management`
		] = `${this.translateToEnglish(cleanModuleName)} Management`;
		this.generatedKeys.en[
			`pages.${solutionName}.${moduleNameCamel}.register`
		] = `${this.translateToEnglish(cleanModuleName)} Register`;
	}

	/**
	 * 간단한 한글-영어 번역 매핑
	 */
	translateToEnglish(koreanText) {
		const translations = {
			// 솔루션별
			거래처: 'Vendor',
			품목: 'Item',
			사용자: 'User',
			터미널: 'Terminal',
			코드: 'Code',
			주문: 'Order',
			견적: 'Estimate',
			배송: 'Delivery',
			출하: 'Shipment',
			'출하 요청': 'Shipping Request',
			명세서: 'Statement',
			세금계산서: 'Tax Invoice',
			구매: 'Purchase',
			생산계획: 'Production Plan',
			작업지시: 'Work Order',
			설비: 'Machine',
			금형: 'Mold',
			입출고: 'In/Out',
			수리: 'Repair',
			점검: 'Check',
			검사: 'Inspection',

			// 공통 용어
			'상세 목록': 'Detail List',
			'전체 현황': 'Overall Status',
			분석: 'Analysis',
			현황: 'Status',
			등록: 'Register',
			수정: 'Edit',
			삭제: 'Delete',
			관리: 'Management',
			목록: 'List',
		};

		return translations[koreanText] || koreanText;
	}

	/**
	 * 생성된 번역 키를 locale 파일에 병합합니다
	 */
	async mergeToLocaleFiles() {
		const languages = ['ko', 'en'];

		for (const lang of languages) {
			const commonFilePath = path.join(
				this.localesDir,
				lang,
				'common.json'
			);

			try {
				// 기존 파일 읽기
				let existingContent = {};
				if (fs.existsSync(commonFilePath)) {
					const fileContent = fs.readFileSync(commonFilePath, 'utf8');
					existingContent = JSON.parse(fileContent);
				}

				// 새로운 키들을 기존 구조에 병합
				const mergedContent = this.deepMerge(
					existingContent,
					this.flatToNested(this.generatedKeys[lang])
				);

				// 파일 쓰기
				fs.writeFileSync(
					commonFilePath,
					JSON.stringify(mergedContent, null, '\t'),
					'utf8'
				);

				console.log(
					`✅ [${lang}] ${Object.keys(this.generatedKeys[lang]).length}개 번역 키 추가됨`
				);
			} catch (error) {
				console.error(
					`❌ [${lang}] locale 파일 업데이트 실패:`,
					error.message
				);
			}
		}
	}

	/**
	 * 플랫 객체를 중첩 객체로 변환
	 */
	flatToNested(flatObj) {
		const nested = {};

		Object.entries(flatObj).forEach(([key, value]) => {
			const keys = key.split('.');
			let current = nested;

			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) {
					current[keys[i]] = {};
				}
				current = current[keys[i]];
			}

			current[keys[keys.length - 1]] = value;
		});

		return nested;
	}

	/**
	 * 깊은 객체 병합
	 */
	deepMerge(target, source) {
		const result = { ...target };

		Object.keys(source).forEach((key) => {
			if (
				source[key] &&
				typeof source[key] === 'object' &&
				!Array.isArray(source[key])
			) {
				result[key] = this.deepMerge(result[key] || {}, source[key]);
			} else {
				result[key] = source[key];
			}
		});

		return result;
	}

	/**
	 * 솔루션별 번역 키 생성 및 저장
	 */
	async generateForSolution(solutionConfig, solutionName) {
		console.log(`🌍 [${solutionName}] 번역 키 생성 중...`);

		// 키 추출
		this.extractTranslationKeys(solutionConfig, solutionName);

		// 생성된 키 개수 출력
		const koKeysCount = Object.keys(this.generatedKeys.ko).length;
		const enKeysCount = Object.keys(this.generatedKeys.en).length;

		console.log(
			`📝 한국어: ${koKeysCount}개, 영어: ${enKeysCount}개 키 생성`
		);

		// locale 파일에 병합
		await this.mergeToLocaleFiles();

		// 생성된 키 초기화 (다음 솔루션을 위해)
		this.generatedKeys = { ko: {}, en: {} };
	}
}

export { LocaleGenerator };
