import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { askQuestion, closeReadline } from './utils/askQuestion.js';
import { TabNavigationGenerater } from './template_generater/tabNavigationGenerater.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTabNavigation = async () => {
	const language = await askQuestion(
		'Select the language you want to use (1: Korean, 2: English): '
	);
	const tabKeyPrompt =
		language === '1'
			? '탭 Key 이름을 입력하세요 (예: IniVendor): '
			: 'Enter tab key name (e.g., IniVendor): ';

	const createTypePrompt =
		language === '1'
			? '등록 방식 (modal 또는 none): '
			: 'Create type (modal or none): ';

	const tabTitlePrompt =
		language === '1'
			? '타이틀을 입력하세요 (예: 거래처): '
			: 'Enter title (e.g., Vendor): ';

	const defaultTabPrompt =
		language === '1'	
			? '기본 탭 id를 입력하세요 (예: list): '
			: 'Enter default tab id (e.g., list): ';
	

	// 필수 입력
	const tabKey = await askQuestion(tabKeyPrompt);
	const defaultValue = await askQuestion(defaultTabPrompt);
	const createType = await askQuestion(createTypePrompt);
	const title = await askQuestion(tabTitlePrompt);

	// 탭 정의 반복 입력
	const tabItems = [];
	let addMore = 'y';

	while (addMore.toLowerCase() === 'y') {
		const id = await askQuestion(
			language === '1' ? '탭 id를 입력하세요: ' : 'Enter tab id: '
		);
		const label = await askQuestion(
			language === '1' ? '탭 라벨을 입력하세요: ' : 'Enter tab label: '
		);
		const to = await askQuestion(
			language === '1'
				? '탭 경로 (to)를 입력하세요: '
				: 'Enter tab path (to): '
		);

		const pageComponent = await askQuestion(
			language === '1'
				? '페이지 컴포넌트 이름 (예: IniVendorPage): '
				: 'Page component (e.g., IniVendorPage): '
		);

		tabItems.push(`{
			id: '${id}',
			icon: <TableProperties size={16} className="rotate-180" />,
			label: '${label}',
			content: ${pageComponent ? '<' + pageComponent + '/>' : ''},
			to: '${to}',
		}`);

		addMore = await askQuestion(
			language === '1'
				? '탭을 더 추가하시겠습니까? (y/n): '
				: 'Add another tab? (y/n): '
		);
	}

	const tabsFormatted = tabItems.join(',\n');


	// 템플릿 생성
	const tabNavigationCode = TabNavigationGenerater(
		tabKey,
		tabsFormatted,
		createType,
		`'${defaultValue}'`,
		title
	);

	const fullPath = path.join(
		__dirname,
		'..',
		'src',
		'tabs',
		`${tabKey}TabNavigation.tsx`
	);
	const dir = path.dirname(fullPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(fullPath, tabNavigationCode, 'utf8');

	console.log(
		chalk.green(
			`${tabKey}TabNavigation.tsx 파일이 ${fullPath} 경로에 생성되었습니다.`
		)
	);

	closeReadline();
};

generateTabNavigation();
