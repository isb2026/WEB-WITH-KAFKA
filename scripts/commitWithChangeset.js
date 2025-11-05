const { execSync } = require('child_process');
const readline = require('readline');

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

const prompt = (question) =>
	new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		});
	});

(async () => {
	// 1. Changeset 실행
	console.log('📦 Running pnpm changeset...');
	run('pnpm changeset');

	// 2. 커밋 메시지 입력
	const commitMessage = await prompt(
		'📝 Enter commit message (default: chore: update changeset): '
	);
	const message = commitMessage.trim() || 'chore: update changeset';

	// 3. 전체 스테이징
	run('git add .');

	// 4. 커밋
	run(`git commit -m "${message}"`);

	// 5. 푸시
	run('git push');

	console.log('✅ All changes (including changeset) committed and pushed!');
})();
