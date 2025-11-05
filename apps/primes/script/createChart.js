import chalk from 'chalk';
import { askQuestion } from './utils/askQuestion.js';
import masterDetailPageGenerater from './createMasterDetailPage.js';
import singlePageGenerater from './createSinglePage.js';
import chartComponentGenerater from './createChartComponent.js';

const generatePage = async () => {
	console.log(chalk.blue('🚀 Primes Page Generator'));
	console.log(chalk.gray('Config 기반 페이지 생성 도구\n'));

	// 사용자 입력 언어 선택
	const language = await askQuestion(
		'Select the language you want to use (1: Korean, 2: English): '
	);

	// 페이지 유형 선택
	const selectTemplate =
		language === '1'
			? '생성할 페이지 유형을 선택하세요:\n1. Single Page (단일 테이블 페이지)\n2. Master Detail Page (마스터-디테일 페이지)\n3. Chart Component (차트 컴포넌트)\n선택 (1-3): '
			: 'Select the page type to generate:\n1. Single Page (single table page)\n2. Master Detail Page (master-detail page)\n3. Chart Component (chart component)\nChoice (1-3): ';

	const pageType = await askQuestion(selectTemplate);

	// 페이지 유형에 맞는 템플릿 생성 함수 호출
	if (pageType === '1') {
		console.log(
			chalk.cyan(
				language === '1'
					? '📄 Single Page 생성 중...'
					: '📄 Generating Single Page...'
			)
		);
		await singlePageGenerater(language);
	} else if (pageType === '2') {
		console.log(
			chalk.cyan(
				language === '1'
					? '📊 Master Detail Page 생성 중...'
					: '📊 Generating Master Detail Page...'
			)
		);
		await masterDetailPageGenerater(language);
	} else if (pageType === '3') {
		console.log(
			chalk.cyan(
				language === '1'
					? '📈 Chart Component 생성 중...'
					: '📈 Generating Chart Component...'
			)
		);
		await chartComponentGenerater();
	} else {
		console.log(
			chalk.red(
				language === '1'
					? '❌ 잘못된 입력입니다. 1, 2, 또는 3을 입력해주세요.'
					: '❌ Invalid input. Please enter 1, 2, or 3.'
			)
		);
	}
};

generatePage();
