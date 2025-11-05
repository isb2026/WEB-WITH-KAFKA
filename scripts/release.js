const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

const rootDir = path.resolve(__dirname, '..');
const changesetDir = path.join(rootDir, '.changeset');
const backupDir = path.join(rootDir, '.temp-changesets');
const appsDir = path.join(rootDir, 'apps');
const releaseNotePath = path.join(rootDir, '.github/RELEASE_NOTES.md');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');

const logStep = (title) => {
	const line = '='.repeat(40);
	console.log(
		`\n${chalk.bgBlue.white.bold(` STEP `)} ${chalk.cyan.bold(title.toUpperCase())}\n${chalk.gray(line)}\n`
	);
};

// Step 0: 백업 changeset md 파일
logStep('Backup changesets');
fs.mkdirSync(backupDir, { recursive: true });
fs.readdirSync(changesetDir)
	.filter((f) => f.endsWith('.md') && f !== 'README.md')
	.forEach((f) =>
		fs.copyFileSync(path.join(changesetDir, f), path.join(backupDir, f))
	);

// Step 1: changeset version 실행 (버전 bump + 커밋 시도)
logStep('Run changeset version');
run('pnpm changeset version');

// Step 2: 추가 변경 사항 커밋 (changeset이 commit 안 했을 경우 대비)
logStep('Git commit if needed');
try {
	run('git add .');
	run('git commit -m "release: version bump"');
} catch {
	console.log(
		chalk.gray(
			'ℹ️  No changes to commit. Possibly already committed by Changeset.'
		)
	);
}

// Step 3: 각 앱에 대해 name@version 태그 생성
logStep('Tagging packages');
const existingTags = execSync('git tag', { encoding: 'utf8' })
	.split('\n')
	.filter(Boolean);

fs.readdirSync(appsDir).forEach((appName) => {
	const pkgPath = path.join(appsDir, appName, 'package.json');
	if (!fs.existsSync(pkgPath)) return;

	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	if (!pkg.name || pkg.private) return;

	const tag = `${pkg.name}@${pkg.version}`;
	if (existingTags.includes(tag)) {
		console.log(chalk.yellow(`⏩ Skipping existing tag: ${tag}`));
		return;
	}

	run(`git tag -a ${tag} -m "release ${tag}"`);
	console.log(chalk.green(`✅ Tagged ${tag}`));
});

// Step 4: 태그 push
logStep('Push git tags');
run('git push origin --tags');

// Step 5: RELEASE_NOTES.md, CHANGELOG.md 생성/갱신
logStep('Generate changelog files');
const notes = fs
	.readdirSync(backupDir)
	.filter((f) => f.endsWith('.md'))
	.map((f) => fs.readFileSync(path.join(backupDir, f), 'utf8'))
	.join('\n\n---\n\n');

fs.mkdirSync(path.dirname(releaseNotePath), { recursive: true });
fs.writeFileSync(releaseNotePath, notes);
fs.writeFileSync(changelogPath, notes);

console.log(
	chalk.green(
		`📝 RELEASE_NOTES.md and CHANGELOG.md updated (${notes.length} chars)`
	)
);

// Step 6: temp-changesets 디렉토리 삭제
logStep('Clean up temp changesets');
fs.rmSync(backupDir, { recursive: true, force: true });
console.log(chalk.gray('🧹 Temp changesets cleaned.'));
