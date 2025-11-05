import fs from 'fs';
import path from 'path';
import { askQuestion, closeReadline } from './utils//askQuestion.js'; // askQuestion 함수 가져오기
import { masterDetailPageGenerater } from './template_generater/masterDetailPageGenerater.js'; // generatePageTemplate 함수 가져오기
import { fileURLToPath } from 'url';

// 사용자 입력을 받기 위한 readline 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 페이지 생성 함수
const generatePage = async (language) => {
	// 사용자 입력 언어 선택
	const pageNamePrompt =
		language === '1'
			? 'Page Key 이름을 입력하세요 (예: PurchaseMasterDetail): '
			: 'Enter the page key name (e.g., PurchaseMasterDetail): ';

	const masterHookPrompt =
		language === '1'
			? 'Master 테이블 데이터를 가져오는 Hook을 입력하세요 (예: usePurchaseMaster): '
			: 'Enter the data fetching hook for the master table (e.g., usePurchaseMaster): ';

	const detailHookPrompt =
		language === '1'
			? 'Detail 테이블 데이터를 가져오는 Hook을 입력하세요 (예: useIncomingDetails): '
			: 'Enter the data fetching hook for the detail table (e.g., useIncomingDetails): ';

	const pathPrompt =
		language === '1'
			? '페이지를 생성할 경로를 입력하세요 (예: ini/items): '
			: 'Enter the path where the page should be created (e.g., /ini/items): ';

	const masterColumnPrompt =
		language === '1'
			? 'Master Table의 컬럼을 추가하시겠습니까? (y/n): '
			: 'Do you want to add columns for master table? (y/n): ';

	const detailColumnPrompt =
		language === '1'
			? 'Detail Table의 컬럼을 추가하시겠습니까? (y/n): '
			: 'Do you want to add columns for detail table? (y/n): ';

	const masterColumns = [];
	const detailColumns = [];

	let addMoreMasterColumns = 'y'; // 컬럼 추가 여부
	let addMoreDetailColumns = 'y'; // 컬럼 추가 여부

	// 페이지 이름과 Hook 입력 받기
	const pageKey = await askQuestion(pageNamePrompt);
	const masterDataHook = await askQuestion(masterHookPrompt);
	const detailDataHook = await askQuestion(detailHookPrompt);

	// 경로 입력 받기
	let pagePath = await askQuestion(pathPrompt);

	// 경로가 /src/pages/ 이 경로 아래로 들어가도록 처리
	if (pagePath.startsWith('/')) {
		pagePath = pagePath.slice(1); // 경로가 /로 시작하면 제거
	}

	// 컬럼 추가 로직
	while (addMoreMasterColumns.toLowerCase() === 'y') {
		addMoreMasterColumns = await askQuestion(masterColumnPrompt);

		if (addMoreMasterColumns.toLowerCase() === 'y') {
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

			masterColumns.push({
				accessorKey,
				header,
				size: parseInt(size ? size : 120, 10),
			});
		}
	}
	while (addMoreDetailColumns.toLowerCase() === 'y') {
		addMoreDetailColumns = await askQuestion(detailColumnPrompt);

		if (addMoreDetailColumns.toLowerCase() === 'y') {
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

			detailColumns.push({
				accessorKey,
				header,
				size: parseInt(size ? size : 120, 10),
			});
		}
	}

	const masterColumnsArray = JSON.stringify(masterColumns, null, 2);
	const detailColumnsArray = JSON.stringify(detailColumns, null, 2);

	const masterTableTitle =
		language === '1'
			? 'Master 테이블의 Title 을 입력해주세요.'
			: 'Please enter a Title for the master table.';
	const detailTableTitle =
		language === '1'
			? 'Detail 테이블의 Title 을 입력해주세요.'
			: 'Please enter a Title for the detail table.';

	const MasterTableTitle = await askQuestion(masterTableTitle);
	const DetailTableTitle = await askQuestion(detailTableTitle);

	// 페이지 템플릿 생성
	const pageTemplate = masterDetailPageGenerater(
		pageKey,
		masterColumnsArray,
		masterDataHook,
		detailColumnsArray,
		detailDataHook,
		MasterTableTitle,
		DetailTableTitle
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
			? `${pageKey}Page.tsx 파일이 ${fullPath} 경로에 생성되었습니다.`
			: `${pageKey}Page.tsx file has been created at ${fullPath}.`
	);

	// readline 종료
	closeReadline();
};

export default generatePage;
