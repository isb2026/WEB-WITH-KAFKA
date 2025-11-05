import { BuildErrorParser } from './utils/buildErrorParser.js';
import chalk from 'chalk';

/**
 * 빌드 에러 분석 메인 스크립트
 */
async function main() {
    console.log(chalk.blue('🚀 Missing UI Components Generator - 빌드 에러 분석 시작\n'));

    const parser = new BuildErrorParser();

    try {
        const errors = await parser.runBuildAndCollectErrors();

        // 결과를 JSON 파일로 저장
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const outputPath = path.join(__dirname, 'build-errors.json');
        fs.writeFileSync(outputPath, JSON.stringify(errors, null, 2), 'utf8');

        console.log(chalk.green(`\n💾 분석 결과가 저장되었습니다: ${outputPath}`));

        // 다음 단계 안내
        if (parser.getTotalErrorCount() > 0) {
            console.log(chalk.cyan('\n🔧 다음 단계:'));
            console.log(chalk.white('1. 아이콘 Import 자동 추가'));
            console.log(chalk.white('2. index.ts 파일 자동 업데이트'));
            console.log(chalk.white('3. 누락된 컴포넌트 생성'));
        }

    } catch (error) {
        console.error(chalk.red('❌ 에러 분석 중 오류 발생:'), error.message);
        process.exit(1);
    }
}

// 스크립트 실행
main();