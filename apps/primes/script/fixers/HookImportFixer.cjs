/**
 * Hook Import 에러 수정기
 * Hook 이름 불일치 에러를 감지하고 수정하는 클래스
 */

const fs = require('fs');
const path = require('path');

class HookImportFixer {
    constructor() {
        this.fixedFiles = new Set();
        this.fixLog = [];
    }

    /**
     * Hook Import 에러를 수정할 수 있는지 확인
     * @param {BuildError} error - 빌드 에러 객체
     * @returns {boolean} 수정 가능 여부
     */
    canFix(error) {
        return error.type === 'hook_import' && error.suggestion;
    }

    /**
     * Hook Import 에러 수정
     * @param {BuildError} error - 빌드 에러 객체
     * @param {string} fileContent - 파일 내용
     * @returns {string} 수정된 파일 내용
     */
    fix(error, fileContent) {
        if (!this.canFix(error)) {
            return fileContent;
        }

        const lines = fileContent.split('\n');
        const targetLine = lines[error.line - 1]; // 0-based index

        if (!targetLine) {
            console.warn(`Warning: Line ${error.line} not found in ${error.file}`);
            return fileContent;
        }

        // Hook 이름 추출 (에러 메시지에서)
        const hookImportMatch = error.message.match(/has no exported member named '(\w+)'\. Did you mean '(\w+)'\?/);
        if (!hookImportMatch) {
            console.warn(`Warning: Could not parse hook names from error message: ${error.message}`);
            return fileContent;
        }

        const [, wrongName, correctName] = hookImportMatch;

        // import 문에서 잘못된 Hook 이름을 올바른 이름으로 교체
        const fixedLine = targetLine.replace(
            new RegExp(`\\b${wrongName}\\b`, 'g'),
            correctName
        );

        // 원본을 주석으로 보존
        const commentLine = `// Original: ${targetLine.trim()}`;

        lines[error.line - 1] = fixedLine;
        lines.splice(error.line - 1, 0, commentLine);

        const fixInfo = {
            file: error.file,
            line: error.line,
            wrongName,
            correctName,
            original: targetLine.trim(),
            fixed: fixedLine.trim()
        };

        this.fixLog.push(fixInfo);
        this.fixedFiles.add(error.file);

        console.log(`✓ Fixed hook import in ${error.file}:${error.line} - ${wrongName} → ${correctName}`);

        return lines.join('\n');
    }

    /**
     * 파일의 모든 Hook Import 에러를 수정
     * @param {string} filePath - 파일 경로
     * @param {BuildError[]} errors - 해당 파일의 에러 배열
     * @returns {boolean} 수정 성공 여부
     */
    fixFile(filePath, errors) {
        try {
            const fullPath = path.resolve(filePath);

            if (!fs.existsSync(fullPath)) {
                console.warn(`Warning: File not found: ${fullPath}`);
                return false;
            }

            let fileContent = fs.readFileSync(fullPath, 'utf8');
            let hasChanges = false;

            // Hook Import 에러만 필터링
            const hookImportErrors = errors.filter(error => this.canFix(error));

            if (hookImportErrors.length === 0) {
                return true; // 수정할 에러가 없음
            }

            // 라인 번호 역순으로 정렬 (뒤에서부터 수정해야 라인 번호가 안 꼬임)
            hookImportErrors.sort((a, b) => b.line - a.line);

            for (const error of hookImportErrors) {
                const originalContent = fileContent;
                fileContent = this.fix(error, fileContent);

                if (fileContent !== originalContent) {
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                // 백업 생성
                const backupPath = `${fullPath}.backup`;
                if (!fs.existsSync(backupPath)) {
                    fs.writeFileSync(backupPath, fs.readFileSync(fullPath));
                }

                // 수정된 내용 저장
                fs.writeFileSync(fullPath, fileContent);
                console.log(`✓ Saved fixes to ${filePath}`);
            }

            return true;
        } catch (error) {
            console.error(`Error fixing file ${filePath}:`, error.message);
            return false;
        }
    }

    /**
     * 여러 파일의 Hook Import 에러를 일괄 수정
     * @param {Object} errorsByFile - 파일별로 그룹화된 에러 객체
     * @returns {Object} 수정 결과 통계
     */
    fixMultipleFiles(errorsByFile) {
        const results = {
            totalFiles: 0,
            fixedFiles: 0,
            totalErrors: 0,
            fixedErrors: 0,
            failedFiles: []
        };

        for (const [filePath, errors] of Object.entries(errorsByFile)) {
            results.totalFiles++;

            const hookImportErrors = errors.filter(error => this.canFix(error));
            results.totalErrors += hookImportErrors.length;

            if (hookImportErrors.length > 0) {
                const success = this.fixFile(filePath, errors);

                if (success) {
                    results.fixedFiles++;
                    results.fixedErrors += hookImportErrors.length;
                } else {
                    results.failedFiles.push(filePath);
                }
            }
        }

        return results;
    }

    /**
     * 수정 결과 리포트 출력
     */
    printReport() {
        console.log('\n=== Hook Import Fixer Report ===');
        console.log(`Fixed files: ${this.fixedFiles.size}`);
        console.log(`Total fixes: ${this.fixLog.length}`);

        if (this.fixLog.length > 0) {
            console.log('\nDetailed fixes:');
            this.fixLog.forEach((fix, index) => {
                console.log(`${index + 1}. ${fix.file}:${fix.line}`);
                console.log(`   ${fix.wrongName} → ${fix.correctName}`);
            });
        }

        console.log('');
    }

    /**
     * 백업 파일들 정리
     * @param {boolean} confirm - 확인 없이 삭제할지 여부
     */
    cleanupBackups(confirm = false) {
        if (!confirm) {
            console.log('To cleanup backup files, run with confirm=true');
            return;
        }

        let cleanedCount = 0;
        this.fixedFiles.forEach(filePath => {
            const backupPath = `${path.resolve(filePath)}.backup`;
            if (fs.existsSync(backupPath)) {
                fs.unlinkSync(backupPath);
                cleanedCount++;
            }
        });

        console.log(`Cleaned up ${cleanedCount} backup files`);
    }
}

module.exports = HookImportFixer;