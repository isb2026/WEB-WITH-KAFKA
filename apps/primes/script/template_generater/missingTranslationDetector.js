import fs from 'fs';
import path from 'path';
import { toCamelCase } from '../utils/stringUtils.js';

/**
 * 누락된 번역 키를 자동으로 감지하고 생성하는 클래스
 */
class MissingTranslationDetector {
	constructor() {
		this.localesDir = path.join(process.cwd(), 'src/locales');
		this.missingKeys = {
			ko: {},
			en: {},
		};

		// 자주 사용되는 패턴들의 기본 번역
		this.defaultTranslations = {
			ko: {
				// 액션 관련
				register: '등록',
				edit: '수정',
				delete: '삭제',
				save: '저장',
				cancel: '취소',
				confirm: '확인',
				close: '닫기',
				search: '검색',
				reset: '초기화',
				add: '추가',
				remove: '제거',
				copy: '복사',
				print: '인쇄',
				export: '내보내기',
				import: '가져오기',

				// 상태 관련
				list: '목록',
				status: '현황',
				detailList: '상세 목록',
				overallStatus: '전체 현황',
				analysis: '분석',
				summary: '요약',
				detail: '상세',
				info: '정보',
				management: '관리',

				// 시간 관련
				today: '오늘',
				yesterday: '어제',
				thisWeek: '이번 주',
				thisMonth: '이번 달',
				thisYear: '올해',
				recent: '최근',

				// 상태값
				active: '활성',
				inactive: '비활성',
				pending: '대기',
				completed: '완료',
				cancelled: '취소됨',
				draft: '임시저장',

				// 메시지
				loading: '로딩 중...',
				noData: '데이터가 없습니다',
				error: '오류가 발생했습니다',
				success: '성공했습니다',
				failed: '실패했습니다',
				required: '필수 항목입니다',
				optional: '선택 항목입니다',
			},
			en: {
				// 액션 관련
				register: 'Register',
				edit: 'Edit',
				delete: 'Delete',
				save: 'Save',
				cancel: 'Cancel',
				confirm: 'Confirm',
				close: 'Close',
				search: 'Search',
				reset: 'Reset',
				add: 'Add',
				remove: 'Remove',
				copy: 'Copy',
				print: 'Print',
				export: 'Export',
				import: 'Import',

				// 상태 관련
				list: 'List',
				status: 'Status',
				detailList: 'Detail List',
				overallStatus: 'Overall Status',
				analysis: 'Analysis',
				summary: 'Summary',
				detail: 'Detail',
				info: 'Information',
				management: 'Management',

				// 시간 관련
				today: 'Today',
				yesterday: 'Yesterday',
				thisWeek: 'This Week',
				thisMonth: 'This Month',
				thisYear: 'This Year',
				recent: 'Recent',

				// 상태값
				active: 'Active',
				inactive: 'Inactive',
				pending: 'Pending',
				completed: 'Completed',
				cancelled: 'Cancelled',
				draft: 'Draft',

				// 메시지
				loading: 'Loading...',
				noData: 'No Data Available',
				error: 'An Error Occurred',
				success: 'Success',
				failed: 'Failed',
				required: 'Required',
				optional: 'Optional',
			},
		};
	}

	/**
	 * 코드에서 사용된 번역 키들을 추출합니다
	 * @param {string} codeContent - 분석할 코드 내용
	 * @returns {Array} 발견된 번역 키 배열
	 */
	extractTranslationKeysFromCode(codeContent) {
		const keys = [];

		// t('key') 패턴 찾기
		const tCallPattern = /t\(['"`]([^'"`]+)['"`]\)/g;
		let match;

		while ((match = tCallPattern.exec(codeContent)) !== null) {
			keys.push(match[1]);
		}

		return keys;
	}

	/**
	 * 프로젝트의 모든 코드 파일에서 번역 키를 추출합니다
	 */
	async scanProjectForMissingKeys() {
		const srcDir = path.join(process.cwd(), 'src');
		const usedKeys = new Set();

		await this.scanDirectory(srcDir, usedKeys);

		// 현재 locale 파일들에서 존재하는 키들 확인
		const existingKeys = await this.loadExistingKeys();

		// 누락된 키들 찾기
		usedKeys.forEach((key) => {
			if (!this.keyExists(key, existingKeys)) {
				this.generateMissingKey(key);
			}
		});

		return {
			totalUsedKeys: usedKeys.size,
			missingKeysCount: Object.keys(this.missingKeys.ko).length,
			missingKeys: this.missingKeys,
		};
	}

	/**
	 * 디렉토리를 재귀적으로 스캔하여 번역 키 추출
	 */
	async scanDirectory(dirPath, usedKeys) {
		if (!fs.existsSync(dirPath)) return;

		const items = fs.readdirSync(dirPath);

		for (const item of items) {
			const itemPath = path.join(dirPath, item);
			const stat = fs.statSync(itemPath);

			if (stat.isDirectory()) {
				// node_modules, .git 등 제외
				if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
					await this.scanDirectory(itemPath, usedKeys);
				}
			} else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
				// TypeScript/JavaScript 파일만 처리
				const content = fs.readFileSync(itemPath, 'utf8');
				const keys = this.extractTranslationKeysFromCode(content);
				keys.forEach((key) => usedKeys.add(key));
			}
		}
	}

	/**
	 * 기존 locale 파일들에서 키들을 로드
	 */
	async loadExistingKeys() {
		const existingKeys = {};
		const languages = ['ko', 'en'];

		for (const lang of languages) {
			existingKeys[lang] = {};
			const commonFilePath = path.join(
				this.localesDir,
				lang,
				'common.json'
			);

			if (fs.existsSync(commonFilePath)) {
				try {
					const content = JSON.parse(
						fs.readFileSync(commonFilePath, 'utf8')
					);
					existingKeys[lang] = this.flattenObject(content);
				} catch (error) {
					console.warn(
						`⚠️ [${lang}] locale 파일 로드 실패:`,
						error.message
					);
				}
			}
		}

		return existingKeys;
	}

	/**
	 * 키가 존재하는지 확인
	 */
	keyExists(key, existingKeys) {
		return existingKeys.ko && existingKeys.ko[key];
	}

	/**
	 * 누락된 키에 대한 번역 생성
	 */
	generateMissingKey(key) {
		const keyParts = key.split('.');
		const lastPart = keyParts[keyParts.length - 1];

		// 기본 번역이 있는지 확인
		if (this.defaultTranslations.ko[lastPart]) {
			this.missingKeys.ko[key] = this.defaultTranslations.ko[lastPart];
			this.missingKeys.en[key] = this.defaultTranslations.en[lastPart];
		} else {
			// 키 구조를 분석하여 번역 추측
			this.missingKeys.ko[key] = this.generateTranslationFromKey(
				key,
				'ko'
			);
			this.missingKeys.en[key] = this.generateTranslationFromKey(
				key,
				'en'
			);
		}
	}

	/**
	 * 키 구조를 분석하여 번역 생성
	 */
	generateTranslationFromKey(key, lang) {
		const keyParts = key.split('.');
		const lastPart = keyParts[keyParts.length - 1];

		// camelCase를 분리하여 읽기 쉽게 변환
		const words = lastPart.replace(/([A-Z])/g, ' $1').trim();

		if (lang === 'ko') {
			// 한국어 추측 생성
			if (key.includes('placeholder')) {
				return `${words}을 선택하세요`;
			} else if (key.includes('title')) {
				return `${words} 제목`;
			} else if (key.includes('label')) {
				return words;
			} else if (key.includes('action')) {
				return words;
			} else {
				return `[번역필요] ${words}`;
			}
		} else {
			// 영어는 카멜케이스를 일반 문자열로 변환
			if (key.includes('placeholder')) {
				return `Select ${words}`;
			} else if (key.includes('title')) {
				return `${words} Title`;
			} else if (key.includes('label')) {
				return words;
			} else if (key.includes('action')) {
				return words;
			} else {
				return `[Need Translation] ${words}`;
			}
		}
	}

	/**
	 * 중첩 객체를 플랫 객체로 변환
	 */
	flattenObject(obj, prefix = '') {
		let flattened = {};

		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				let newKey = prefix ? `${prefix}.${key}` : key;

				if (
					typeof obj[key] === 'object' &&
					obj[key] !== null &&
					!Array.isArray(obj[key])
				) {
					Object.assign(
						flattened,
						this.flattenObject(obj[key], newKey)
					);
				} else {
					flattened[newKey] = obj[key];
				}
			}
		}

		return flattened;
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
	 * 누락된 번역들을 locale 파일에 추가
	 */
	async addMissingKeysToLocaleFiles() {
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
					this.flatToNested(this.missingKeys[lang])
				);

				// 파일 쓰기
				fs.writeFileSync(
					commonFilePath,
					JSON.stringify(mergedContent, null, '\t'),
					'utf8'
				);

				const addedCount = Object.keys(this.missingKeys[lang]).length;
				if (addedCount > 0) {
					console.log(
						`✅ [${lang}] ${addedCount}개 누락된 번역 키 추가됨`
					);
				}
			} catch (error) {
				console.error(
					`❌ [${lang}] 누락된 번역 키 추가 실패:`,
					error.message
				);
			}
		}
	}

	/**
	 * 누락된 번역 키 검사 및 자동 생성 실행
	 */
	async detectAndGenerateMissingKeys() {
		console.log('🔍 프로젝트에서 누락된 번역 키 검사 중...');

		const result = await this.scanProjectForMissingKeys();

		console.log(`📊 사용된 번역 키: ${result.totalUsedKeys}개`);
		console.log(`❌ 누락된 번역 키: ${result.missingKeysCount}개`);

		if (result.missingKeysCount > 0) {
			console.log('🔧 누락된 번역 키들을 자동 생성합니다...');
			await this.addMissingKeysToLocaleFiles();
			console.log('✅ 누락된 번역 키 자동 생성 완료!');
		} else {
			console.log('✅ 모든 번역 키가 존재합니다!');
		}

		return result;
	}
}

export { MissingTranslationDetector };
