import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SinglePageGenerater } from './template_generater/singlePageGenerater.js';
import { masterDetailPageGenerater } from './template_generater/masterDetailPageGenerater.js';
import { TabNavigationGenerater } from './template_generater/tabNavigationGenerater.js';
import { RegisterPageGenerater } from './template_generater/registerPageGenerater.js';
import {
	generateFieldApiHook,
	generateFieldApiService,
} from './template_generater/fieldApiHookGenerater.js';
import {
	generateCustomSelectComponent,
	generateCustomSelectIndex,
} from './template_generater/customSelectGenerater.js';
import { LocaleGenerator } from './template_generater/localeGenerater.js';
import { MissingTranslationDetector } from './template_generater/missingTranslationDetector.js';
import {
	toCamelCase,
	toPascalCase,
	toSafeDirectoryName,
} from './utils/stringUtils.js';
import { safeGet, safeArrayGet } from './utils/compatibilityUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 아이콘 매핑
const iconMapping = {
	TableProperties: 'TableProperties',
	Table: 'Table',
	FileText: 'FileText',
	ChartPie: 'ChartPie',
	Users: 'Users',
	Building: 'Building',
	ShoppingCart: 'ShoppingCart',
	UserCheck: 'UserCheck',
	Package: 'Package',
	ShoppingBag: 'ShoppingBag',
	PackageCheck: 'PackageCheck',
	Calendar: 'Calendar',
	ClipboardList: 'ClipboardList',
	Wrench: 'Wrench',
	Settings: 'Settings',
	Activity: 'Activity',
	History: 'History',
};

/**
 * 솔루션별 config 파일들을 로드합니다
 * @returns {Object|null} 솔루션별 config 객체 또는 null
 */
const loadSolutionConfigs = () => {
	const configsDir = path.join(__dirname, 'configs');
	const configs = {};

	if (!fs.existsSync(configsDir)) {
		console.log(
			'⚠️  configs 폴더가 없습니다. 기본 config.json을 사용합니다.'
		);
		return null;
	}

	const configFiles = fs
		.readdirSync(configsDir)
		.filter((file) => file.endsWith('.json'));

	if (configFiles.length === 0) {
		console.log('⚠️  configs 폴더에 JSON 파일이 없습니다.');
		return null;
	}

	let loadedCount = 0;
	let failedCount = 0;

	configFiles.forEach((file) => {
		const solutionName = path.basename(file, '.json');
		const configPath = path.join(configsDir, file);

		try {
			const configContent = fs.readFileSync(configPath, 'utf8');
			const solutionConfig = JSON.parse(configContent);

			// 하이픈이 포함된 솔루션명을 camelCase로 변환
			const normalizedSolutionName = toCamelCase(solutionName);
			configs[normalizedSolutionName] = solutionConfig;

			console.log(
				`✅ ${solutionName} config 로드됨 (${normalizedSolutionName})`
			);
			loadedCount++;
		} catch (error) {
			console.error(
				`❌ ${solutionName} config 로드 실패:`,
				error.message
			);
			failedCount++;
		}
	});

	console.log(
		`📊 Config 로드 결과: 성공 ${loadedCount}개, 실패 ${failedCount}개`
	);

	return Object.keys(configs).length > 0 ? configs : null;
};

// 전체 config 병합
const mergeConfigs = (solutionConfigs) => {
	const solutions = Object.keys(solutionConfigs);
	const templates = {
		singlePage: {
			type: 'singlePage',
			description: '단일 테이블 페이지 템플릿',
			components: ['Table', 'Search', 'Actions'],
		},
		masterDetailPage: {
			type: 'masterDetailPage',
			description: '마스터-디테일 페이지 템플릿',
			components: ['MasterTable', 'DetailTable', 'Search', 'Actions'],
		},
	};

	return {
		solutions,
		templates,
		...solutionConfigs,
	};
};

/**
 * 라우트 템플릿을 생성합니다
 * @param {Object} moduleConfig - 모듈 설정 객체
 * @param {string} solutionName - 솔루션명
 * @returns {string} 라우트 템플릿 문자열
 */
const generateRouteTemplate = (moduleConfig, solutionName) => {
	const modules = safeGet(moduleConfig, 'modules', {});
	const routes = [];
	const tabNavigationImports = [];
	const pageImports = [];

	Object.entries(modules).forEach(([moduleKey, module]) => {
		const tabs = safeGet(module, 'tabs', []);
		const baseRoute = safeGet(module, 'route', '');

		// 하이픈이 포함된 모듈명을 PascalCase로 변환
		const normalizedModuleKey = toPascalCase(moduleKey);
		const tabNavigationName = `${normalizedModuleKey}TabNavigation`;

		tabNavigationImports.push(tabNavigationName);

		// children 구조로 라우트 생성
		if (baseRoute && tabs.length > 0) {
			const childRoutes = tabs.map((tab) => {
				const tabId = safeGet(tab, 'id', '');
				return `			{
				path: '${tabId}',
				element: <${tabNavigationName} activetab="${tabId}" />
			}`;
			});

			// 페이지 타입에 따라 추가 라우트 생성
			const pageType = safeGet(module, 'pageType', 'singlePage');
			const actions = safeGet(module, 'actions', []);

			// actions 설정에 따라 추가 라우트 생성
			const createAction = actions.find(
				(action) => safeGet(action, 'type', '') === 'create'
			);
			const editAction = actions.find(
				(action) => safeGet(action, 'type', '') === 'edit'
			);

			// register 페이지 라우트 추가 (navigation 방식인 경우만)
			if (
				createAction &&
				safeGet(createAction, 'action', '') === 'navigation'
			) {
				const registerPageName = `${normalizedModuleKey}RegisterPage`;
				childRoutes.push(`			{
				path: 'register',
				element: <${registerPageName} />
			}`);

				// import에 register 페이지 추가
				if (!pageImports.includes(registerPageName)) {
					pageImports.push(registerPageName);
				}
			}

			// edit 페이지 라우트 추가 (navigation 방식인 경우만)
			if (
				editAction &&
				safeGet(editAction, 'action', '') === 'navigation'
			) {
				const editPageName = `${normalizedModuleKey}EditPage`;
				childRoutes.push(`			{
				path: ':id',
				element: <${editPageName} />
			}`);

				// import에 edit 페이지 추가
				if (!pageImports.includes(editPageName)) {
					pageImports.push(editPageName);
				}
			}

			const allChildRoutes = childRoutes.join(',\n');

			routes.push(`
	{
		path: '${baseRoute}',
		children: [
${allChildRoutes}
		]
	}`);
		}
	});

	// 솔루션명도 PascalCase로 변환
	const normalizedSolutionName = toPascalCase(solutionName);

	// import 구문 생성
	const tabImportLine =
		tabNavigationImports.length > 0
			? `import { ${tabNavigationImports.join(', ')} } from '@primes/tabs';`
			: '';
	const pageImportLines =
		pageImports.length > 0
			? pageImports
					.map((page) => `import { ${page} } from '@primes/pages';`)
					.join('\n')
			: '';

	return `import React from 'react';
${tabImportLine}
${pageImportLines}

export const ${normalizedSolutionName}Routes = [
${routes.join(',\n')}
];`;
};

/**
 * 탭 네비게이션 템플릿을 생성합니다
 * @param {Object} moduleConfig - 모듈 설정 객체
 * @param {string} solutionName - 솔루션명
 * @returns {Array<string>} 탭 네비게이션 템플릿 배열
 */
const generateTabNavigationTemplate = (moduleConfig, solutionName) => {
	const modules = safeGet(moduleConfig, 'modules', {});
	const tabNavigations = [];

	Object.entries(modules).forEach(([moduleKey, module]) => {
		const tabs = safeGet(module, 'tabs', []);
		const name = safeGet(module, 'name', '');
		const actions = safeGet(module, 'actions', []);
		const route = safeGet(module, 'route', '');

		// 하이픈이 포함된 모듈명을 PascalCase로 변환
		const normalizedModuleKey = toPascalCase(moduleKey);
		const tabNavigationName = `${normalizedModuleKey}TabNavigation`;

		// 탭 아이템 생성
		const tabItems = tabs
			.map((tab) => {
				const icon = safeGet(
					iconMapping,
					safeGet(tab, 'icon', ''),
					'TableProperties'
				);
				const tabId = safeGet(tab, 'id', '');
				const tabName = safeGet(tab, 'name', '');
				const tabPath = safeGet(tab, 'path', '');
				const pageName = safeGet(tab, 'pageName', '');

				return `		{
			id: '${tabId}',
			icon: <${icon} size={16} />,
			label: '${tabName}',
			to: '${tabPath}',
			content: <${pageName} />,
		}`;
			})
			.join(',\n');

		// 기본 탭 찾기
		const defaultTab =
			tabs.find((tab) => safeGet(tab, 'default', false)) || tabs[0];
		const defaultTabId = defaultTab ? safeGet(defaultTab, 'id', '') : '';

		// 페이지 타입 확인
		const hasMasterDetailPage = tabs.some(
			(tab) => safeGet(tab, 'type', '') === 'masterDetailPage'
		);
		const pageType = hasMasterDetailPage
			? 'masterDetailPage'
			: 'singlePage';

		// 액션 버튼 생성
		const createAction = actions.find(
			(action) => safeGet(action, 'type', '') === 'create'
		);
		const actionType = createAction
			? safeGet(createAction, 'action', 'navigation')
			: 'navigation';

		if (tabItems && defaultTabId) {
			tabNavigations.push(
				TabNavigationGenerater(
					tabNavigationName,
					tabItems,
					actionType,
					`'${defaultTabId}'`,
					name,
					actions,
					pageType,
					route,
					toCamelCase(moduleKey)
				)
			);
		}
	});

	return tabNavigations;
};

/**
 * 페이지 템플릿을 생성합니다
 * @param {Object} moduleConfig - 모듈 설정 객체
 * @returns {Array<Object>} 페이지 템플릿 배열
 */
const generatePageTemplates = (moduleConfig) => {
	const modules = safeGet(moduleConfig, 'modules', {});
	const pages = [];

	Object.values(modules).forEach((module) => {
		const tabs = safeGet(module, 'tabs', []);
		const actions = safeGet(module, 'actions', []);
		const modulePath = safeGet(module, 'path', '');
		const moduleName = safeGet(module, 'name', '');

		// 탭 페이지 생성
		tabs.forEach((tab) => {
			const type = safeGet(tab, 'type', '');
			const pageName = safeGet(tab, 'pageName', '');
			const columns = safeGet(tab, 'columns', []);
			const masterColumns = safeGet(tab, 'masterColumns', []);
			const detailColumns = safeGet(tab, 'detailColumns', []);
			const tableControl = safeGet(tab, 'tableControl', {});
			const dataHook = safeGet(tab, 'dataHook', '');
			const masterDataHook = safeGet(tab, 'masterDataHook', '');
			const detailDataHook = safeGet(tab, 'detailDataHook', '');

			if (type === 'singlePage' && pageName) {
				try {
					const columnsArray = JSON.stringify(columns, null, 2);
					const tableTitle = safeGet(tableControl, 'title', '');

					// dataHook에서 하이픈 제거
					const normalizedDataHook = dataHook.replace(/-/g, '');

					const pageTemplate = SinglePageGenerater(
						pageName,
						columnsArray,
						normalizedDataHook,
						tableTitle
					);

					pages.push({
						name: pageName,
						template: pageTemplate,
						path: `src/pages/${modulePath}/${pageName}.tsx`,
						type: 'singlePage',
					});
				} catch (error) {
					console.error(
						`❌ SinglePage 생성 실패 (${pageName}):`,
						error.message
					);
				}
			} else if (type === 'masterDetailPage' && pageName) {
				try {
					const masterColumnsArray = JSON.stringify(
						masterColumns,
						null,
						2
					);
					const detailColumnsArray = JSON.stringify(
						detailColumns,
						null,
						2
					);
					const tableTitle = safeGet(tableControl, 'title', '');

					// hook 이름에서 하이픈 제거
					const normalizedMasterDataHook = masterDataHook.replace(
						/-/g,
						''
					);
					const normalizedDetailDataHook = detailDataHook.replace(
						/-/g,
						''
					);

					const pageTemplate = masterDetailPageGenerater(
						pageName,
						masterColumnsArray,
						normalizedMasterDataHook,
						detailColumnsArray,
						normalizedDetailDataHook,
						tableTitle,
						`${tableTitle} 상세`
					);

					pages.push({
						name: pageName,
						template: pageTemplate,
						path: `src/pages/${modulePath}/${pageName}.tsx`,
						type: 'masterDetailPage',
					});
				} catch (error) {
					console.error(
						`❌ MasterDetailPage 생성 실패 (${pageName}):`,
						error.message
					);
				}
			}
		});

		// 등록 페이지 생성
		actions.forEach((action) => {
			const actionType = safeGet(action, 'type', '');
			const pageName = safeGet(action, 'pageName', '');

			if (actionType === 'create' && pageName) {
				try {
					const actionType = safeGet(action, 'action', '');
					const formFields = safeGet(action, 'formFields', []);
					const hookName =
						safeGet(action, 'hookName', '') ||
						`use${moduleName.replace(/\s+/g, '')}`;
					const title =
						safeGet(action, 'title', '') || `${moduleName} 등록`;

					// 페이지 타입에 따라 등록 방식 결정
					let isModal = true;
					let pageType = 'singlePage';

					// config에서 페이지 타입 확인 (우선순위 1)
					const configPageType = safeGet(module, 'pageType', '');
					if (configPageType) {
						pageType = configPageType;
						isModal = configPageType === 'singlePage';
					} else {
						// tabs에서 페이지 타입 확인 (우선순위 2)
						const tabs = safeGet(module, 'tabs', []);
						const hasMasterDetailPage = tabs.some(
							(tab) =>
								safeGet(tab, 'type', '') === 'masterDetailPage'
						);

						if (hasMasterDetailPage) {
							// MasterDetailPage가 있으면 navigation 방식
							isModal = false;
							pageType = 'masterDetailPage';
						} else if (actionType === 'navigation') {
							// 명시적으로 navigation으로 설정된 경우
							isModal = false;
							pageType = 'singlePage';
						} else {
							// 기본값은 modal 방식
							isModal = true;
							pageType = 'singlePage';
						}
					}

					// hookName에서 하이픈 제거
					const normalizedHookName = hookName.replace(/-/g, '');

					const registerPageTemplate = RegisterPageGenerater(
						pageName,
						formFields,
						normalizedHookName,
						title,
						isModal,
						pageType
					);

					const registerPath = `src/pages/${modulePath}/${pageName}.tsx`;

					pages.push({
						name: pageName,
						template: registerPageTemplate,
						path: registerPath,
						type: 'registerPage',
					});
				} catch (error) {
					console.error(
						`❌ RegisterPage 생성 실패 (${pageName}):`,
						error.message
					);
				}
			}
		});
	});

	return pages;
};

/**
 * 파일을 생성합니다 (기존 파일이 있으면 백업)
 * @param {string} filePath - 생성할 파일 경로
 * @param {string} content - 파일 내용
 * @param {Object} options - 생성 옵션
 * @returns {boolean} 생성 성공 여부
 */
const createFile = (filePath, content, options = {}) => {
	try {
		const { overwrite = false, backup = true } = options;
		const fullPath = path.join(__dirname, '..', filePath);
		const dir = path.dirname(fullPath);

		// 디렉토리 생성
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		// 기존 파일 처리
		if (fs.existsSync(fullPath)) {
			if (overwrite) {
				// 백업 생성
				if (backup) {
					const timestamp = new Date()
						.toISOString()
						.replace(/[:.]/g, '-');
					const pathInfo = path.parse(fullPath);
					const backupPath = path.join(
						pathInfo.dir,
						`${pathInfo.name}.backup.${timestamp}${pathInfo.ext}`
					);
					fs.copyFileSync(fullPath, backupPath);
					console.log(
						`📦 Backup created: ${path.relative(path.join(__dirname, '..'), backupPath)}`
					);
				}

				fs.writeFileSync(fullPath, content, 'utf8');
				console.log(`✅ Overwritten: ${filePath}`);
			} else {
				// 새로운 이름으로 생성
				const pathInfo = path.parse(fullPath);
				let counter = 1;
				let newFilePath = fullPath;

				while (fs.existsSync(newFilePath)) {
					const newFileName = `${pathInfo.name}_${counter}${pathInfo.ext}`;
					newFilePath = path.join(pathInfo.dir, newFileName);
					counter++;
				}

				fs.writeFileSync(newFilePath, content, 'utf8');
				const relativeNewPath = path.relative(
					path.join(__dirname, '..'),
					newFilePath
				);
				console.log(`✅ Created (renamed): ${relativeNewPath}`);
			}
		} else {
			fs.writeFileSync(fullPath, content, 'utf8');
			console.log(`✅ Created: ${filePath}`);
		}

		return true;
	} catch (error) {
		console.error(`❌ 파일 생성 실패 (${filePath}):`, error.message);
		return false;
	}
};

/**
 * 배치로 파일들을 생성합니다
 * @param {Array<Object>} files - 생성할 파일 배열 [{path, content, options}]
 * @returns {Object} 생성 결과 통계
 */
const createFilesBatch = (files) => {
	const results = {
		success: 0,
		failed: 0,
		total: files.length,
		errors: [],
	};

	console.log(`📦 배치 파일 생성 시작: ${files.length}개 파일`);

	files.forEach((file, index) => {
		const { path: filePath, content, options = {} } = file;

		try {
			const success = createFile(filePath, content, options);
			if (success) {
				results.success++;
			} else {
				results.failed++;
				results.errors.push({
					path: filePath,
					error: 'Creation failed',
				});
			}
		} catch (error) {
			results.failed++;
			results.errors.push({ path: filePath, error: error.message });
		}

		// 진행률 표시 (10개마다)
		if ((index + 1) % 10 === 0 || index === files.length - 1) {
			const progress = Math.round(((index + 1) / files.length) * 100);
			console.log(
				`📊 진행률: ${progress}% (${index + 1}/${files.length})`
			);
		}
	});

	console.log(
		`📊 배치 생성 완료: 성공 ${results.success}개, 실패 ${results.failed}개`
	);

	if (results.errors.length > 0) {
		console.log('❌ 실패한 파일들:');
		results.errors.forEach(({ path, error }) => {
			console.log(`   - ${path}: ${error}`);
		});
	}

	return results;
};

/**
 * 메인 생성 함수 - 솔루션별 config에서 파일들을 생성합니다
 */
const generateFromSolutionConfigs = () => {
	const startTime = Date.now();

	try {
		console.log('🚀 솔루션별 config에서 생성을 시작합니다...\n');

		// 솔루션별 config 로드
		const solutionConfigs = loadSolutionConfigs();

		if (!solutionConfigs) {
			console.log(
				'⚠️ 솔루션 config를 찾을 수 없습니다. 기본 config.json 사용 모드로 전환합니다.'
			);
			try {
				const { execSync } = require('child_process');
				execSync('node script/generateFromConfig.js', {
					stdio: 'inherit',
				});
			} catch (fallbackError) {
				console.error(
					'❌ 기본 config 실행도 실패했습니다:',
					fallbackError.message
				);
			}
			return;
		}

		// 전체 config 병합
		const mergedConfig = mergeConfigs(solutionConfigs);

		// 전체 통계
		const totalStats = {
			solutions: 0,
			pages: 0,
			tabNavigations: 0,
			routes: 0,
			locales: 0,
			errors: 0,
		};

		// 각 솔루션별로 생성
		for (const [solutionName, solutionConfig] of Object.entries(
			solutionConfigs
		)) {
			try {
				console.log(`\n📁 Processing solution: ${solutionName}`);
				totalStats.solutions++;

				const solutionFiles = [];

				// 1. 페이지 생성 준비
				try {
					const pages = generatePageTemplates(solutionConfig);
					console.log(`📄 페이지 ${pages.length}개 생성 준비`);

					pages.forEach((page) => {
						solutionFiles.push({
							path: page.path,
							content: page.template,
							options: { backup: true },
						});
					});

					totalStats.pages += pages.length;
				} catch (pageError) {
					console.error(
						`❌ [${solutionName}] 페이지 템플릿 생성 실패:`,
						pageError.message
					);
					totalStats.errors++;
				}

				// 2. 탭 네비게이션 생성 준비
				try {
					const tabNavigations = generateTabNavigationTemplate(
						solutionConfig,
						solutionName
					);
					const moduleKeys = Object.keys(
						safeGet(solutionConfig, 'modules', {})
					);

					console.log(
						`🗂️ 탭 네비게이션 ${tabNavigations.length}개 생성 준비`
					);

					tabNavigations.forEach((template, index) => {
						if (index < moduleKeys.length) {
							const moduleKey = moduleKeys[index];
							const normalizedModuleKey = toPascalCase(moduleKey);
							const tabNavigationName = `${normalizedModuleKey}TabNavigation`;

							solutionFiles.push({
								path: `src/tabs/${solutionName}/${tabNavigationName}.tsx`,
								content: template,
								options: { backup: true },
							});
						}
					});

					totalStats.tabNavigations += tabNavigations.length;
				} catch (tabError) {
					console.error(
						`❌ [${solutionName}] 탭 네비게이션 생성 실패:`,
						tabError.message
					);
					totalStats.errors++;
				}

				// 3. Field API 및 Custom Select 생성 준비
				try {
					const fieldApiFiles = generateFieldApiFiles(
						solutionConfig,
						solutionName
					);
					console.log(
						`🔗 Field API/Custom Select ${fieldApiFiles.length}개 생성 준비`
					);

					fieldApiFiles.forEach((file) => {
						solutionFiles.push(file);
					});
				} catch (fieldApiError) {
					console.error(
						`❌ [${solutionName}] Field API 생성 실패:`,
						fieldApiError.message
					);
					totalStats.errors++;
				}

				// 4. 번역 키 자동 생성
// 				try {
// 					const localeGenerator = new LocaleGenerator();
// 					await localeGenerator.generateForSolution(solutionConfig, solutionName);
// 					console.log(`🌍 번역 키 자동 생성 완료`);
// 					totalStats.locales++;
// 				} catch (localeError) {
// 					console.error(
// 						`❌ [${solutionName}] 번역 키 생성 실패:`,
// 						localeError.message
// 					);
// 					totalStats.errors++;
// 				}

				// 5. 라우트 생성 준비
				try {
					const routeTemplate = generateRouteTemplate(
						solutionConfig,
						solutionName
					);
					const normalizedSolutionName = toPascalCase(solutionName);

					solutionFiles.push({
						path: `src/routes/${normalizedSolutionName}Route.tsx`,
						content: routeTemplate,
						options: { backup: true },
					});

					console.log(`🛣️ 라우트 1개 생성 준비`);
					totalStats.routes++;
				} catch (routeError) {
					console.error(
						`❌ [${solutionName}] 라우트 생성 실패:`,
						routeError.message
					);
					totalStats.errors++;
				}

				// 6. 배치로 파일 생성
				if (solutionFiles.length > 0) {
					console.log(
						`📦 [${solutionName}] ${solutionFiles.length}개 파일 배치 생성 시작`
					);
					const batchResult = createFilesBatch(solutionFiles);

					if (batchResult.failed > 0) {
						totalStats.errors += batchResult.failed;
					}
				}

				console.log(`✅ [${solutionName}] 완료`);
			} catch (solutionError) {
				console.error(
					`❌ [${solutionName}] 솔루션 처리 실패:`,
					solutionError.message
				);
				console.log(
					`⚠️ [${solutionName}] 스킵하고 다음 솔루션으로 진행합니다.`
				);
				totalStats.errors++;
			}
		}

		// 5. 병합된 config 저장 (기존 시스템 호환성)
		try {
			const configPath = path.join(__dirname, 'config.json');
			fs.writeFileSync(
				configPath,
				JSON.stringify(mergedConfig, null, 2),
				'utf8'
			);
			console.log('\n✅ 병합된 config.json 생성 완료');
		} catch (configError) {
			console.error('❌ config.json 저장 실패:', configError.message);
			totalStats.errors++;
		}

		// 6. 누락된 번역 키 검사 및 자동 생성
// 		try {
// 			console.log('\n🔍 누락된 번역 키 검사 시작...');
// 			const detector = new MissingTranslationDetector();
// 			const detectionResult = await detector.detectAndGenerateMissingKeys();
// 			console.log(`✅ 번역 키 검사 완료: ${detectionResult.missingKeysCount}개 키 추가`);
// 		} catch (detectionError) {
// 			console.error('❌ 번역 키 검사 실패:', detectionError.message);
// 			totalStats.errors++;
// 		}

		// 7. 최종 결과 출력
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		console.log('\n🎉 모든 솔루션 파일 생성 완료!');
		console.log('📊 생성 통계:');
		console.log(`   - 솔루션: ${totalStats.solutions}개`);
		console.log(`   - 페이지: ${totalStats.pages}개`);
		console.log(`   - 탭 네비게이션: ${totalStats.tabNavigations}개`);
		console.log(`   - 라우트: ${totalStats.routes}개`);
		console.log(`   - 번역 키: ${totalStats.locales}개 솔루션`);
		console.log(`   - 에러: ${totalStats.errors}개`);
		console.log(`   - 소요 시간: ${duration}초`);

		if (totalStats.errors > 0) {
			console.log(
				'⚠️ 일부 파일 생성 중 오류가 발생했습니다. 로그를 확인해주세요.'
			);
		}
	} catch (error) {
		console.error('❌ 생성 중 치명적 오류가 발생했습니다:', error);
		console.error('Stack trace:', error.stack);
	}
};

/**
 * Field API 관련 파일들을 생성합니다
 * @param {Object} solutionConfig - 솔루션 설정
 * @param {string} solutionName - 솔루션명
 * @returns {Array} 생성할 파일 목록
 */
const generateFieldApiFiles = (solutionConfig, solutionName) => {
	const files = [];
	const modules = safeGet(solutionConfig, 'modules', {});
	const customSelects = [];

	Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
		const hasFieldApi = safeGet(moduleConfig, 'fieldApi', false);
		const customSelectConfig = safeGet(moduleConfig, 'customSelect', null);

		if (!hasFieldApi && !customSelectConfig) {
			return; // Field API나 Custom Select가 설정되지 않은 경우 스킵
		}

		const moduleNameCamel = toCamelCase(moduleKey);
		const moduleNamePascal = toPascalCase(moduleKey);
		const solutionNameCamel = toCamelCase(solutionName);

		// 1. Field API Hook 생성
		if (hasFieldApi) {
			const hookContent = generateFieldApiHook(
				moduleNameCamel,
				solutionNameCamel
			);
			const hookPath = path.join(
				'src/hooks',
				solutionNameCamel,
				moduleNameCamel,
				`use${moduleNamePascal}FieldQuery.ts`
			);

			files.push({
				path: hookPath,
				content: hookContent,
				options: { backup: true },
			});

			// 서비스 파일에 Field API 함수 추가 (기존 서비스 파일 수정)
			const serviceFunction = generateFieldApiService(
				moduleNameCamel,
				solutionNameCamel
			);
			const servicePath = path.join(
				'src/services',
				solutionNameCamel,
				`${moduleNameCamel}Service.ts`
			);

			// TODO: 기존 서비스 파일에 함수 추가하는 로직 필요
			console.log(
				`📝 ${servicePath}에 Field API 함수를 수동으로 추가해주세요:`
			);
			console.log(serviceFunction);
		}

		// 2. Custom Select 컴포넌트 생성
		if (customSelectConfig) {
			const selectContent = generateCustomSelectComponent(
				moduleNameCamel,
				solutionNameCamel,
				customSelectConfig
			);
			const selectPath = path.join(
				'src/components/customSelect',
				`${moduleNamePascal}SelectComponent.tsx`
			);

			files.push({
				path: selectPath,
				content: selectContent,
				options: { backup: true },
			});

			// Custom Select 목록에 추가 (index 파일 생성용)
			customSelects.push({
				componentName: `${moduleNamePascal}SelectComponent`,
				fileName: `${moduleNamePascal}SelectComponent`,
				typeName: `${moduleNameCamel}Select`,
				moduleName: moduleNameCamel,
				solutionName: solutionNameCamel,
			});
		}
	});

	// 3. Custom Select Index 파일 생성 (여러 개가 있는 경우)
	if (customSelects.length > 0) {
		const indexContent = generateCustomSelectIndex(customSelects);
		const indexPath = path.join('src/components/customSelect', 'index.ts');

		files.push({
			path: indexPath,
			content: indexContent,
			options: { backup: true, append: true }, // 기존 내용에 추가
		});
	}

	return files;
};

// 스크립트 실행
generateFromSolutionConfigs();
