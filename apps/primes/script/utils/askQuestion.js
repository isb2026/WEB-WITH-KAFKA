import readline from 'readline';

// readline 설정
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// 사용자 입력을 받는 함수
export const askQuestion = (question) => {
	return new Promise((resolve) => rl.question(question, resolve));
};

// readline 종료 함수
export const closeReadline = () => {
	rl.close();
};
