import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { askQuestion, closeReadline } from './utils/askQuestion.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default configurations
const DEFAULT_CONFIG = {
	domain: 'sales',
	dataType: 'orders',
	chartType: 'line',
	timeRange: 'monthly',
	customTitle: '',
	autoFetchData: true,
	exportEnabled: true,
	interactiveControls: true,
	useCustomData: false,
};

// Available options
const AVAILABLE_OPTIONS = {
	domains: [
		'sales',
		'production',
		'mold',
		'equipment',
		'measurement',
		'purchase',
		'incoming',
	],
	dataTypes: [
		'orders',
		'delivery',
		'maintenance',
		'calibration',
		'efficiency',
		'quality',
		'analysis',
	],
	chartTypes: ['line', 'bar', 'pie'],
	timeRanges: ['yearly', 'monthly', 'weekly', 'daily'],
};

// Load analysis pages from config.json
const loadAnalysisPages = () => {
	try {
		const configPath = path.join(__dirname, 'config.json');
		const configContent = fs.readFileSync(configPath, 'utf8');
		const config = JSON.parse(configContent);
		return config.analysisPages || {};
	} catch (error) {
		console.error('Error loading config.json:', error.message);
		return {};
	}
};

const generateChartComponent = async () => {
	// Load analysis pages from config
	const ANALYSIS_PAGES = loadAnalysisPages();

	// Language selection
	const language =
		(await askQuestion(
			'Select the language you want to use (1: Korean, 2: English) [default: 1]: '
		)) || '1';

	// Component name
	const componentNamePrompt =
		language === '1'
			? '컴포넌트 이름을 입력하세요 (예: SalesOrderChart) [default: MyChart]: '
			: 'Enter component name (e.g., SalesOrderChart) [default: MyChart]: ';

	const componentName = (await askQuestion(componentNamePrompt)) || 'MyChart';

	// Page connection option
	const pageConnectionPrompt =
		language === '1'
			? '기존 분석 페이지에 연결하시겠습니까? (y/n) [default: n]: '
			: 'Do you want to connect to an existing analysis page? (y/n) [default: n]: ';

	const connectToPage = (await askQuestion(pageConnectionPrompt)) || 'n';
	const shouldConnectToPage = connectToPage.toLowerCase() === 'y';

	let selectedPage = null;
	let config = { ...DEFAULT_CONFIG };

	if (shouldConnectToPage) {
		// Show available pages and let user select
		selectedPage = await selectAnalysisPage(language, ANALYSIS_PAGES);
		if (selectedPage) {
			// Auto-configure based on selected page
			config = {
				...config,
				domain: selectedPage.domain,
				dataType: selectedPage.dataType,
			};
		}
	}

	// If no page selected or not connecting to page, get manual config
	if (!selectedPage) {
		config = await getComponentConfig(language);
	}

	// Output path
	const pathPrompt =
		language === '1'
			? '생성할 경로를 입력하세요 (예: charts/analysis) [default: charts]: '
			: 'Enter the output path (e.g., charts/analysis) [default: charts]: ';

	let outputPath = (await askQuestion(pathPrompt)) || 'charts';

	// Path processing
	if (outputPath.startsWith('/')) {
		outputPath = outputPath.slice(1);
	}

	// Create both analysis and financial components
	const analysisComponentName = `${componentName}Analysis`;
	const financialComponentName = `${componentName}Financial`;

	// Generate components
	const analysisTemplate = generateAnalysisChartTemplate(
		analysisComponentName,
		config
	);
	const financialTemplate = generateFinancialSummaryTemplate(
		financialComponentName,
		config
	);

	// Create analysis component
	const analysisPath = path.join(outputPath, 'analysis');
	const analysisFullPath = path.join(
		__dirname,
		'..',
		'src',
		'components',
		analysisPath,
		`${analysisComponentName}.tsx`
	);

	// Create financial component
	const financialPath = path.join(outputPath, 'financial');
	const financialFullPath = path.join(
		__dirname,
		'..',
		'src',
		'components',
		financialPath,
		`${financialComponentName}.tsx`
	);

	// Create directories if they don't exist
	const analysisDir = path.dirname(analysisFullPath);
	const financialDir = path.dirname(financialFullPath);

	if (!fs.existsSync(analysisDir)) {
		fs.mkdirSync(analysisDir, { recursive: true });
	}
	if (!fs.existsSync(financialDir)) {
		fs.mkdirSync(financialDir, { recursive: true });
	}

	// Write files
	fs.writeFileSync(analysisFullPath, analysisTemplate, 'utf8');
	fs.writeFileSync(financialFullPath, financialTemplate, 'utf8');

	console.log(
		language === '1'
			? chalk.green(
					`✅ ${analysisComponentName}.tsx 파일이 ${analysisFullPath} 경로에 생성되었습니다.`
				)
			: chalk.green(
					`✅ ${analysisComponentName}.tsx file has been created at ${analysisFullPath}.`
				)
	);

	console.log(
		language === '1'
			? chalk.green(
					`✅ ${financialComponentName}.tsx 파일이 ${financialFullPath} 경로에 생성되었습니다.`
				)
			: chalk.green(
					`✅ ${financialComponentName}.tsx file has been created at ${financialFullPath}.`
				)
	);

	// Connect to analysis page if requested
	if (shouldConnectToPage && selectedPage) {
		await connectToAnalysisPage(
			selectedPage,
			analysisComponentName,
			financialComponentName,
			language
		);
	}

	closeReadline();
};

const selectAnalysisPage = async (language, ANALYSIS_PAGES) => {
	console.log(chalk.blue('\n📋 Available Analysis Pages:'));

	const pageOptions = [];
	let optionNumber = 1;

	// Build page options list from config
	for (const [domain, domainPages] of Object.entries(ANALYSIS_PAGES)) {
		for (const [dataType, pageInfo] of Object.entries(domainPages)) {
			const option = `${optionNumber}. ${domain} - ${dataType} (${pageInfo.component})`;
			console.log(chalk.cyan(option));
			pageOptions.push({
				number: optionNumber,
				domain,
				dataType,
				...pageInfo,
			});
			optionNumber++;
		}
	}

	if (pageOptions.length === 0) {
		console.log(
			chalk.yellow(
				language === '1'
					? '⚠️ config.json에서 분석 페이지 정보를 찾을 수 없습니다.'
					: '⚠️ No analysis pages found in config.json.'
			)
		);
		return null;
	}

	const pageSelectionPrompt =
		language === '1'
			? `\n연결할 분석 페이지를 선택하세요 (1-${pageOptions.length}) [default: 1]: `
			: `\nSelect the analysis page to connect to (1-${pageOptions.length}) [default: 1]: `;

	const selection = (await askQuestion(pageSelectionPrompt)) || '1';
	const selectedIndex = parseInt(selection) - 1;

	if (selectedIndex >= 0 && selectedIndex < pageOptions.length) {
		return pageOptions[selectedIndex];
	}

	console.log(
		chalk.red(
			language === '1' ? '잘못된 선택입니다.' : 'Invalid selection.'
		)
	);
	return null;
};

const connectToAnalysisPage = async (
	selectedPage,
	analysisComponentName,
	financialComponentName,
	language
) => {
	const pagePath = path.join(
		__dirname,
		'..',
		'src',
		'pages',
		selectedPage.path
	);

	if (!fs.existsSync(pagePath)) {
		console.log(
			chalk.red(
				language === '1'
					? `❌ 분석 페이지를 찾을 수 없습니다: ${pagePath}`
					: `❌ Analysis page not found: ${pagePath}`
			)
		);
		return;
	}

	try {
		// Read the existing page content
		let pageContent = fs.readFileSync(pagePath, 'utf8');

		// Add import statements for both components
		const analysisImport = `import { ${analysisComponentName} } from '@primes/components/charts/analysis/${analysisComponentName}';`;
		const financialImport = `import { ${financialComponentName} } from '@primes/components/charts/financial/${financialComponentName}';`;

		if (!pageContent.includes(`import { ${analysisComponentName}`)) {
			// Add analysis component import after existing imports
			const importIndex = pageContent.lastIndexOf('import');
			const nextLineIndex = pageContent.indexOf('\n', importIndex) + 1;
			pageContent =
				pageContent.slice(0, nextLineIndex) +
				analysisImport +
				'\n' +
				pageContent.slice(nextLineIndex);
		}

		if (!pageContent.includes(`import { ${financialComponentName}`)) {
			// Add financial component import after existing imports
			const importIndex = pageContent.lastIndexOf('import');
			const nextLineIndex = pageContent.indexOf('\n', importIndex) + 1;
			pageContent =
				pageContent.slice(0, nextLineIndex) +
				financialImport +
				'\n' +
				pageContent.slice(nextLineIndex);
		}

		// Replace the existing AnalysisChart with both components
		const analysisChartRegex = /<AnalysisChart[^>]*\/>/;
		const newComponents = `<${analysisComponentName} />\n\t\t\t<${financialComponentName} />`;

		if (analysisChartRegex.test(pageContent)) {
			pageContent = pageContent.replace(
				analysisChartRegex,
				newComponents
			);
		} else {
			// If no AnalysisChart found, add both components inside PageTemplate
			const pageTemplateRegex =
				/<PageTemplate>([\s\S]*?)<\/PageTemplate>/;
			const match = pageContent.match(pageTemplateRegex);
			if (match) {
				const replacement = `<PageTemplate>\n\t\t\t<${analysisComponentName} />\n\t\t\t<${financialComponentName} />\n\t\t</PageTemplate>`;
				pageContent = pageContent.replace(
					pageTemplateRegex,
					replacement
				);
			}
		}

		// Write the updated content back
		fs.writeFileSync(pagePath, pageContent, 'utf8');

		console.log(
			chalk.green(
				language === '1'
					? `✅ ${analysisComponentName} 및 ${financialComponentName} 컴포넌트가 ${selectedPage.component} 페이지에 연결되었습니다.`
					: `✅ ${analysisComponentName} and ${financialComponentName} components have been connected to ${selectedPage.component} page.`
			)
		);
	} catch (error) {
		console.log(
			chalk.red(
				language === '1'
					? `❌ 페이지 연결 중 오류가 발생했습니다: ${error.message}`
					: `❌ Error connecting to page: ${error.message}`
			)
		);
	}
};

const getComponentConfig = async (language) => {
	const config = { ...DEFAULT_CONFIG };

	// Domain selection
	const domainPrompt =
		language === '1'
			? `도메인을 선택하세요 ${AVAILABLE_OPTIONS.domains.join('/')} [default: ${config.domain}]: `
			: `Select domain ${AVAILABLE_OPTIONS.domains.join('/')} [default: ${config.domain}]: `;

	const domain = (await askQuestion(domainPrompt)) || config.domain;
	if (AVAILABLE_OPTIONS.domains.includes(domain)) {
		config.domain = domain;
	}

	// Data type selection
	const dataTypePrompt =
		language === '1'
			? `데이터 타입을 선택하세요 ${AVAILABLE_OPTIONS.dataTypes.join('/')} [default: ${config.dataType}]: `
			: `Select data type ${AVAILABLE_OPTIONS.dataTypes.join('/')} [default: ${config.dataType}]: `;

	const dataType = (await askQuestion(dataTypePrompt)) || config.dataType;
	if (AVAILABLE_OPTIONS.dataTypes.includes(dataType)) {
		config.dataType = dataType;
	}

	// Chart type selection
	const chartTypePrompt =
		language === '1'
			? `차트 타입을 선택하세요 ${AVAILABLE_OPTIONS.chartTypes.join('/')} [default: ${config.chartType}]: `
			: `Select chart type ${AVAILABLE_OPTIONS.chartTypes.join('/')} [default: ${config.chartType}]: `;

	const chartType = (await askQuestion(chartTypePrompt)) || config.chartType;
	if (AVAILABLE_OPTIONS.chartTypes.includes(chartType)) {
		config.chartType = chartType;
	}

	// Time range selection
	const timeRangePrompt =
		language === '1'
			? `시간 범위를 선택하세요 ${AVAILABLE_OPTIONS.timeRanges.join('/')} [default: ${config.timeRange}]: `
			: `Select time range ${AVAILABLE_OPTIONS.timeRanges.join('/')} [default: ${config.timeRange}]: `;

	const timeRange = (await askQuestion(timeRangePrompt)) || config.timeRange;
	if (AVAILABLE_OPTIONS.timeRanges.includes(timeRange)) {
		config.timeRange = timeRange;
	}

	// Custom title
	const titlePrompt =
		language === '1'
			? '커스텀 제목을 입력하세요 (선택사항, 엔터로 건너뛰기): '
			: 'Enter custom title (optional, press enter to skip): ';

	const customTitle = await askQuestion(titlePrompt);
	if (customTitle) {
		config.customTitle = customTitle;
	}

	// Custom data option for financial summary
	const customDataPrompt =
		language === '1'
			? '재무 요약 테이블에 커스텀 데이터를 사용하시겠습니까? (y/n) [default: n]: '
			: 'Do you want to use custom data for financial summary table? (y/n) [default: n]: ';

	const useCustomData = (await askQuestion(customDataPrompt)) || 'n';
	config.useCustomData = useCustomData.toLowerCase() === 'y';

	return config;
};

const generateAnalysisChartTemplate = (componentName, config) => {
	const title = config.customTitle || `${componentName} Chart`;

	return `import React from 'react';
import { AnalysisChart } from '@primes/components/charts';

interface ${componentName}Props {
	// Add your custom props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
	return (
		<div className="w-full">
			<AnalysisChart
				domain="${config.domain}"
				chartType="${config.chartType}"
				dataType="${config.dataType}"
				timeRange="${config.timeRange}"
				customTitle="${title}"
				autoFetchData={${config.autoFetchData}}
				exportEnabled={${config.exportEnabled}}
				interactiveControls={${config.interactiveControls}}
			/>
		</div>
	);
};

export default ${componentName};
`;
};

const generateFinancialSummaryTemplate = (componentName, config) => {
	const customDataSection = config.useCustomData
		? `
	// Example custom data structure
	const customData = {
		labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
		series: [
			{
				name: '매입금액',
				data: [1200, 1500, 1800, 2000, 2200, 2500],
				color: '#6A53B1'
			},
			{
				name: '매출금액',
				data: [1000, 1300, 1600, 1800, 2000, 2300],
				color: '#0086C9'
			},
			{
				name: '매입률',
				data: [120, 115, 112, 111, 110, 108],
				color: '#DD2590'
			}
		]
	};`
		: '';

	const customDataProp = config.useCustomData
		? 'customData={customData}'
		: '';

	return `import React from 'react';
import { FinancialSummaryTable } from '@primes/components/charts';

interface ${componentName}Props {
	// Add your custom props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {${customDataSection}

	return (
		<div className="w-full">
			<FinancialSummaryTable
				timeRange="${config.timeRange}"
				${customDataProp}
			/>
		</div>
	);
};

export default ${componentName};
`;
};

generateChartComponent();
