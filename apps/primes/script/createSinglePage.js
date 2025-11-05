import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { askQuestion, closeReadline } from './utils/askQuestion.js'; // askQuestion 함수 가져오기
import { SinglePageGenerater } from './template_generater/singlePageGenerater.js'; // generatePageTemplate 함수 가져오기
import { fileURLToPath } from 'url';

// 사용자 입력을 받기 위한 readline 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 페이지 생성 함수
const generatePage = async (language) => {
	// 안내 문구 설정 (한글/영어)
	const pageNamePrompt =
		language === '1'
			? 'Page Key 이름을 입력하세요 (예: IniItemTableList): '
			: 'Enter the page key name (e.g., IniItemTableList): ';

	const hookPrompt =
		language === '1'
			? '데이터를 가져오는 Hook을 입력하세요 (예: useItem): '
			: 'Enter the data fetching hook (e.g., useItem): ';

	const pathPrompt =
		language === '1'
			? '페이지를 생성할 경로를 입력하세요 (예: /ini/items): '
			: 'Enter the path where the page should be created (e.g., /ini/items): ';

	const columnPrompt =
		language === '1'
			? '컬럼을 추가하시겠습니까? (y/n): '
			: 'Do you want to add columns? (y/n): ';

	const columns = [];
	let addMoreColumns = 'y'; // 컬럼 추가 여부

	// 페이지 이름과 Hook 입력 받기
	const pageKey = await askQuestion(pageNamePrompt);
	const dataHook = await askQuestion(hookPrompt);

	// 경로 입력 받기
	let pagePath = await askQuestion(pathPrompt);

	// 경로가 /src/pages/ 이 경로 아래로 들어가도록 처리
	if (pagePath.startsWith('/')) {
		pagePath = pagePath.slice(1); // 경로가 /로 시작하면 제거
	}

	// 컬럼 추가 로직
	while (addMoreColumns.toLowerCase() === 'y') {
		// 컬럼 생성 여부 묻기
		addMoreColumns = await askQuestion(columnPrompt);

		if (addMoreColumns.toLowerCase() === 'y') {
			const accessorKey = await askQuestion(
				language === '1'
					? '컬럼의 accessorKey를 입력하세요: '
					: 'Enter the column accessorKey: '
			);
			const header = await askQuestion(
				language === '1'
					? '컬럼의 header를 입력하세요: '
					: 'Enter the column header: '
			);
			const size = await askQuestion(
				language === '1'
					? '컬럼의 size를 입력하세요 (숫자): '
					: 'Enter the column size (number): '
			);

			columns.push({
				accessorKey,
				header,
				size: parseInt(size ? size : 120, 10),
			});
		}

		// 컬럼을 더 추가할지 여부를 물어봄
		if (addMoreColumns.toLowerCase() !== 'y') {
			console.log(
				language === '1'
					? '컬럼 추가를 종료합니다.'
					: 'Column addition has been finished.'
			);
		}
	}

	// columns를 JSON 형식으로 변환
	const columnsArray = JSON.stringify(columns, null, 2);

	const tableTitle =
		language === '1'
			? '테이블의 Title 을 입력해주세요.: '
			: 'Please enter a Title for the table.: ';

	const TableTitle = await askQuestion(tableTitle);

	// 페이지 템플릿 생성
	const pageTemplate = SinglePageGenerater(
		pageKey,
		columnsArray,
		dataHook,
		TableTitle
	);

	// 경로가 없으면 생성
	const fullPath = path.join(
		__dirname,
		'..',
		'src',
		'pages',
		pagePath,
		`${pageKey}Page.tsx`
	);

	// 폴더가 없으면 생성
	const dir = path.dirname(fullPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	// 파일 생성
	fs.writeFileSync(fullPath, pageTemplate, 'utf8');
	console.log(
		language === '1'
			? chalk.green(
					`${pageKey}Page.tsx 파일이 ${fullPath} 경로에 생성되었습니다.`
				)
			: chalk.green(
					`${pageKey}Page.tsx file has been created at ${fullPath}.`
				)
	);

	// readline 종료
	closeReadline();
};
export default generatePage;
