import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SinglePageGenerater } from './template_generater/singlePageGenerater.js';
import { masterDetailPageGenerater } from './template_generater/masterDetailPageGenerater.js';
import { TabNavigationGenerater } from './template_generater/tabNavigationGenerater.js';
import { RegisterPageGenerater } from './template_generater/registerPageGenerater.js';
import { AnalysisPageGenerater } from './template_generater/analysisPageGenerater.js';

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

// 라우트 템플릿 생성
const generateRouteTemplate = (moduleConfig, solutionName) => {
	const { modules } = moduleConfig;
	const routes = [];

	Object.entries(modules).forEach(([moduleKey, module]) => {
		const { tabs, route: baseRoute } = module;

		tabs.forEach((tab) => {
			const routePath = tab.path;
			const pageName = tab.pageName;
			const tabNavigationName = `${moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}TabNavigation`;

			routes.push(`
	{
		path: "${routePath}",
		element: <${pageName} />,
		children: [
			{
				path: "",
				element: <${tabNavigationName} activetab="${tab.id}" />
			}
		]
	}`);
		});
	});

	return `import React from 'react';
import { ${Object.values(modules)
		.map((module) => module.tabs.map((tab) => tab.pageName))
		.flat()
		.join(', ')} } from '@primes/pages';
import { ${Object.keys(modules)
		.map(
			(key) =>
				`${key.charAt(0).toUpperCase() + key.slice(1)}TabNavigation`
		)
		.join(', ')} } from '@primes/tabs';

export const ${solutionName}Routes = [
${routes.join(',\n')}
];`;
};

// 탭 네비게이션 템플릿 생성
const generateTabNavigationTemplate = (moduleConfig, solutionName) => {
	const { modules } = moduleConfig;
	const tabNavigations = [];

	Object.entries(modules).forEach(([moduleKey, module]) => {
		const { tabs, name, actions } = module;
		const tabNavigationName = `${moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}TabNavigation`;

		// 탭 아이템 생성
		const tabItems = tabs
			.map((tab) => {
				const icon = iconMapping[tab.icon] || 'TableProperties';
				return `		{
			id: '${tab.id}',
			icon: <${icon} size={16} />,
			label: '${tab.name}',
			to: '${tab.path}',
			content: <${tab.pageName} />,
		}`;
			})
			.join(',\n');

		// 기본 탭 찾기
		const defaultTab = tabs.find((tab) => tab.default) || tabs[0];

		// 액션 버튼 생성
		const createAction = actions.find((action) => action.type === 'create');
		const actionType =
			createAction && createAction.action
				? createAction.action
				: 'navigation';
		const actionTitle =
			createAction && createAction.title ? createAction.title : '등록';

		tabNavigations.push(
			TabNavigationGenerater(
				tabNavigationName,
				tabItems,
				actionType,
				`'${defaultTab.id}'`,
				name,
				actions
			)
		);
	});

	return tabNavigations;
};

// 페이지 템플릿 생성
const generatePageTemplates = (moduleConfig) => {
	const { modules } = moduleConfig;
	const pages = [];

	Object.values(modules).forEach((module) => {
		// 탭 페이지 생성
		module.tabs.forEach((tab) => {
			const {
				type,
				pageName,
				columns,
				masterColumns,
				detailColumns,
				tableControl,
				dataHook,
				masterDataHook,
				detailDataHook,
			} = tab;

			if (type === 'singlePage') {
				const columnsArray = JSON.stringify(columns, null, 2);
				const pageTemplate = SinglePageGenerater(
					pageName,
					columnsArray,
					dataHook,
					tableControl.title
				);
				pages.push({
					name: pageName,
					template: pageTemplate,
					path: `src/pages/${module.path}/${pageName}.tsx`,
				});
			} else if (type === 'masterDetailPage') {
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
				const pageTemplate = masterDetailPageGenerater(
					pageName,
					masterColumnsArray,
					masterDataHook,
					detailColumnsArray,
					detailDataHook,
					tableControl.title,
					`${tableControl.title} 상세`
				);
				pages.push({
					name: pageName,
					template: pageTemplate,
					path: `src/pages/${module.path}/${pageName}.tsx`,
				});
			}
		});

		// 등록 페이지 생성
		if (module.actions) {
			module.actions.forEach((action) => {
				if (action.type === 'create' && action.pageName) {
					const isModal = action.action === 'modal';
					const registerPageTemplate = RegisterPageGenerater(
						action.pageName,
						action.formFields || [],
						action.hookName ||
							`use${module.name.replace(/\s+/g, '')}`,
						action.title || `${module.name} 등록`,
						isModal
					);

					const registerPath = isModal
						? `src/pages/${module.path}/${action.pageName}.tsx`
						: `src/pages/${module.path}/${action.pageName}.tsx`;

					pages.push({
						name: action.pageName,
						template: registerPageTemplate,
						path: registerPath,
					});
				}
			});
		}
	});

	return pages;
};

// 파일 생성 함수
const createFile = (filePath, content) => {
	const fullPath = path.join(__dirname, '..', filePath);
	const dir = path.dirname(fullPath);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(fullPath, content, 'utf8');
	console.log(`✅ Created: ${filePath}`);
};

// 분석 페이지 템플릿 생성
const generateAnalysisPageTemplates = (analysisPages) => {
	const templates = [];

	Object.entries(analysisPages).forEach(([domain, domainPages]) => {
		Object.entries(domainPages).forEach(([dataType, pageConfig]) => {
			const {
				path: pagePath,
				component: componentName,
				domain: pageDomain,
				dataType: pageDataType,
				chartType = 'line',
				timeRange = 'weekly',
				chartTitle = '',
				additionalProps = {}
			} = pageConfig;

			const template = AnalysisPageGenerater(
				componentName,
				pageDomain,
				pageDataType,
				chartType,
				timeRange,
				chartTitle,
				additionalProps
			);

			templates.push({
				path: `src/pages/${pagePath}`,
				template
			});
		});
	});

	return templates;
};

// 솔루션별 설정 파일 처리
const processSolutionConfig = (solutionName) => {
	try {
		const configPath = path.join(
			__dirname,
			'configs',
			`${solutionName}.json`
		);

		if (!fs.existsSync(configPath)) {
			console.log(`⚠️  Config file not found: ${solutionName}.json`);
			return;
		}

		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

		console.log(`📁 Processing solution: ${solutionName}`);

		// 페이지 생성
		const pages = generatePageTemplates(config);
		pages.forEach((page) => {
			createFile(page.path, page.template);
		});

		// 탭 네비게이션 생성
		const tabNavigations = generateTabNavigationTemplate(
			config,
			solutionName
		);
		tabNavigations.forEach((template, index) => {
			const moduleKey = Object.keys(config.modules)[index];
			const tabNavigationName = `${moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}TabNavigation`;
			createFile(
				`src/tabs/${solutionName}/${tabNavigationName}.tsx`,
				template
			);
		});

		// 라우트 생성
		const routeTemplate = generateRouteTemplate(config, solutionName);
		createFile(`src/routes/${solutionName}Route.tsx`, routeTemplate);

		console.log(`✅ Completed: ${solutionName}\n`);
	} catch (error) {
		console.error(`❌ Error processing ${solutionName}:`, error);
	}
};

// 메인 생성 함수
const generateFromConfig = () => {
	try {
		// 메인 config.json에서 분석 페이지 생성
		const mainConfigPath = path.join(__dirname, 'config.json');
		if (fs.existsSync(mainConfigPath)) {
			const mainConfig = JSON.parse(fs.readFileSync(mainConfigPath, 'utf8'));
			
			if (mainConfig.analysisPages) {
				console.log('📊 Generating analysis pages from main config...\n');
				const analysisTemplates = generateAnalysisPageTemplates(mainConfig.analysisPages);
				analysisTemplates.forEach((template) => {
					createFile(template.path, template.template);
				});
				console.log(`✅ Generated ${analysisTemplates.length} analysis pages\n`);
			}
		}

		const configsDir = path.join(__dirname, 'configs');

		if (!fs.existsSync(configsDir)) {
			console.error('❌ Configs directory not found');
			return;
		}

		// configs 폴더에서 모든 .json 파일 읽기
		const files = fs
			.readdirSync(configsDir)
			.filter((file) => file.endsWith('.json'));

		if (files.length === 0) {
			console.log('⚠️  No config files found in configs directory');
			return;
		}

		console.log('🚀 Starting generation from configs directory...\n');

		// 각 설정 파일 처리
		files.forEach((file) => {
			const solutionName = file.replace('.json', '');
			processSolutionConfig(solutionName);
		});

		console.log('🎉 All files generated successfully!');
	} catch (error) {
		console.error('❌ Error during generation:', error);
	}
};

// 스크립트 실행
generateFromConfig();
