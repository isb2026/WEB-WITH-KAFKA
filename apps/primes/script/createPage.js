import chalk from 'chalk';
import { askQuestion } from './utils/askQuestion.js'; // askQuestion 함수 가져오기
import masterDetailPageGenerater from './createMasterDetailPage.js';
import singlePageGenerater from './createSinglePage.js';

const generatePage = async () => {
	// 사용자 입력 언어 선택
	const language = await askQuestion(
		'Select the language you want to use (1: Korean, 2: English): '
	);

	// 페이지 유형 선택
	const selectTemplate =
		language === '1'
			? '생성할 페이지 유형을 입력해주세요(1:singlePage . 2:masterDetailPage)'
			: 'Please enter the page to be displayed (1:singlePage . 2:masterDetailPage)';
	const pageType = await askQuestion(selectTemplate);

	// 페이지 유형에 맞는 템플릿 생성 함수 호출
	if (pageType === '1') {
		// singlePage 생성
		await singlePageGenerater(language);
	} else if (pageType === '2') {
		// masterDetailPage 생성
		await masterDetailPageGenerater(language);
	} else {
		console.log(
			chalk.red(
				language === '1' ? '잘못된 입력입니다.' : 'Invalid input.'
			)
		);
	}
};

generatePage();
