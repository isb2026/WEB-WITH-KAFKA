import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * 빌드 에러 로그를 파싱하여 구조화된 데이터로 반환하는 클래스
 */
export class BuildErrorParser {
    constructor() {
        this.errors = {
            missingExports: [],
            missingIcons: [],
            missingComponents: []
        };
    }

    /**
     * Primes 앱의 빌드를 실행하고 에러 로그를 수집
     */
    async runBuildAndCollectErrors() {
        console.log(chalk.blue('🔍 Primes 앱 빌드 실행 중...'));

        try {
            // 빌드 실행 (에러가 발생해도 로그를 수집하기 위해 try-catch 사용)
            execSync('pnpm build --filter @repo/primes', {
                stdio: 'pipe',
                encoding: 'utf8',
                cwd: process.cwd()
            });
            console.log(chalk.green('✅ 빌드 성공! 에러가 없습니다.'));
            return this.errors;
        } catch (error) {
            const errorOutput = error.stdout + error.stderr;
            console.log(chalk.yellow('📊 빌드 에러 분석 중...'));

            this.parseErrorLog(errorOutput);
            return this.errors;
        }
    }

    /**
     * 에러 로그를 파싱하여 에러 유형별로 분류
     */
    parseErrorLog(errorLog) {
        const lines = errorLog.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Missing export 에러 패턴
            if (line.includes('has no exported member')) {
                this.parseMissingExportError(line);
            }

            // Missing icon/component 에러 패턴
            else if (line.includes('Cannot find name')) {
                this.parseMissingComponentError(line, lines[i - 2] || '');
            }
        }

        this.printErrorSummary();
    }

    /**
     * Export 누락 에러 파싱
     * 예: Module '"@primes/tabs"' has no exported member 'PurchaseTabNavigation'
     */
    parseMissingExportError(line) {
        const exportMatch = line.match(/Module '"([^"]+)"' has no exported member '([^']+)'/);
        if (exportMatch) {
            const [, modulePath, componentName] = exportMatch;

            this.errors.missingExports.push({
                modulePath,
                componentName,
                type: this.determineComponentType(componentName)
            });
        }
    }

    /**
     * 컴포넌트/아이콘 누락 에러 파싱
     * 예: Cannot find name 'TableProperties'
     */
    parseMissingComponentError(line, contextLine) {
        const componentMatch = line.match(/Cannot find name '([^']+)'/);
        if (componentMatch) {
            const [, componentName] = componentMatch;

            // 파일 경로 추출 (라인 번호 제거)
            const filePathMatch = contextLine.match(/^([^:]+):/);
            let filePath = filePathMatch ? filePathMatch[1] : 'unknown';

            // 상대 경로를 절대 경로로 변환
            if (filePath.startsWith('src/')) {
                filePath = `apps/primes/${filePath}`;
            }

            // 아이콘인지 컴포넌트인지 판별
            if (this.isIconComponent(componentName)) {
                this.errors.missingIcons.push({
                    iconName: componentName,
                    filePath: filePath.replace(/^.*\//, ''), // 파일명만 추출
                    fullPath: filePath
                });
            } else {
                this.errors.missingComponents.push({
                    componentName,
                    filePath: filePath.replace(/^.*\//, ''),
                    fullPath: filePath,
                    type: this.determineComponentType(componentName)
                });
            }
        }
    }

    /**
     * 컴포넌트 타입 결정
     */
    determineComponentType(componentName) {
        if (componentName.includes('TabNavigation')) {
            return 'TabNavigation';
        } else if (componentName.includes('ListPage')) {
            return 'ListPage';
        } else if (componentName.includes('RegisterPage')) {
            return 'RegisterPage';
        } else if (componentName.includes('MasterDetailPage')) {
            return 'MasterDetailPage';
        }
        return 'Unknown';
    }

    /**
     * 아이콘 컴포넌트인지 판별
     */
    isIconComponent(componentName) {
        const iconNames = [
            'TableProperties', 'Table', 'FileText', 'Plus', 'Trash2', 'Edit',
            'Search', 'Download', 'Upload', 'Settings', 'User', 'Home',
            'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
            'Check', 'X', 'AlertTriangle', 'Info', 'Eye', 'EyeOff'
        ];

        return iconNames.includes(componentName);
    }

    /**
     * 에러 요약 출력
     */
    printErrorSummary() {
        console.log(chalk.cyan('\n📋 빌드 에러 분석 결과:'));
        console.log(chalk.red(`❌ 총 에러 수: ${this.getTotalErrorCount()}`));

        console.log(chalk.yellow(`\n🔗 Export 누락 에러: ${this.errors.missingExports.length}개`));
        if (this.errors.missingExports.length > 0) {
            const grouped = this.groupBy(this.errors.missingExports, 'modulePath');
            Object.entries(grouped).forEach(([module, errors]) => {
                console.log(chalk.gray(`  ${module}: ${errors.map(e => e.componentName).join(', ')}`));
            });
        }

        console.log(chalk.yellow(`\n🎨 아이콘 Import 누락: ${this.errors.missingIcons.length}개`));
        if (this.errors.missingIcons.length > 0) {
            const iconsByFile = this.groupBy(this.errors.missingIcons, 'filePath');
            Object.entries(iconsByFile).forEach(([file, icons]) => {
                console.log(chalk.gray(`  ${file}: ${icons.map(i => i.iconName).join(', ')}`));
            });
        }

        console.log(chalk.yellow(`\n📄 컴포넌트 누락: ${this.errors.missingComponents.length}개`));
        if (this.errors.missingComponents.length > 0) {
            const componentsByType = this.groupBy(this.errors.missingComponents, 'type');
            Object.entries(componentsByType).forEach(([type, components]) => {
                console.log(chalk.gray(`  ${type}: ${components.length}개`));
            });
        }
    }

    /**
     * 배열을 특정 키로 그룹화
     */
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    /**
     * 총 에러 수 반환
     */
    getTotalErrorCount() {
        return this.errors.missingExports.length +
            this.errors.missingIcons.length +
            this.errors.missingComponents.length;
    }

    /**
     * 에러 데이터 반환
     */
    getErrors() {
        return this.errors;
    }
}