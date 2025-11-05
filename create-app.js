const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appName = process.argv[2];

if (!appName) {
  console.log('앱 이름을 인자로 제공해주세요.');
  process.exit(1);
}

const appPath = path.join(__dirname, 'apps', appName);

// 디렉토리 확인
if (fs.existsSync(appPath)) {
  console.log(`앱 "${appName}" 이미 존재합니다.`);
  process.exit(1);
}

// 앱 디렉토리 생성
fs.mkdirSync(appPath, { recursive: true });
console.log(`앱 디렉토리 "${appPath}" 생성 중...`);

// Vite 프로젝트 초기화 (React + TS)
try {
  execSync(`pnpm create vite ${appName} --template react-ts`, { stdio: 'inherit' });
  console.log(`앱 "${appName}"이 성공적으로 생성되었습니다.`);
} catch (error) {
  console.error('앱 생성에 실패했습니다.', error);
  process.exit(1);
}

// 의존성 설치
try {
  execSync('pnpm install', { cwd: appPath, stdio: 'inherit' });
  console.log('의존성 설치 완료.');
} catch (error) {
  console.error('의존성 설치에 실패했습니다.', error);
  process.exit(1);
}

// 앱 실행
try {
  execSync('pnpm dev', { cwd: appPath, stdio: 'inherit' });
} catch (error) {
  console.error('앱 실행에 실패했습니다.', error);
  process.exit(1);
}
