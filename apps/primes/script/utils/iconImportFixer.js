import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * lucide-react 아이콘 Import 자동 추가 클래스
 */
export class IconImportFixer {
    constructor() {
        this.processedFiles = [];
        this.errors = [];
    }

    /**
     * 빌드 에러 데이터를 기반으로 아이콘 import 자동 추가
     */
    async fixIconImports(buildErrors) {
        console.log(chalk.blue('🎨 아이콘 Import 자동 추가 시작...'));

        const iconErrors = buildErrors.missingIcons || [];
        if (iconErrors.length === 0) {
            console.log(chalk.green('✅ 누락된 아이콘 import가 없습니다.'));
            return { success: true, processedFiles: [], errors: [] };
        }

        // 파일별로 그룹화
        const fileGroups = this.groupIconsByFile(iconErrors);

        for (const [filePath, icons] of Object.entries(fileGroups)) {
            await this.processFile(filePath, icons);
        }

        return {
            success: this.errors.length === 0,
            processedFiles: this.processedFiles,
            errors: this.errors
        };
    }

    /**
     * 아이콘 에러를 파일별로 그룹화
     */
    groupIconsByFile(iconErrors) {
        const groups = {};

        iconErrors.forEach(error => {
            // 파일 경로에서 라인 번호 정보 제거
            let fullPath = error.fullPath;

            // 파일명에 라인 번호가 포함된 경우 제거 (예: "file.tsx(28,11)" -> "file.tsx")
            const cleanFileName = error.filePath.replace(/\([^)]+\)$/, '');

            // 전체 경로 재구성
            if (fullPath.includes('(')) {
                const pathParts = fullPath.split('/');
                pathParts[pathParts.length - 1] = cleanFileName;
                fullPath = pathParts.join('/');
            }

            if (!groups[fullPath]) {
                groups[fullPath] = [];
            }
            groups[fullPath].push(error.iconName);
        });

        return groups;
    }

    /**
     * 개별 파일의 아이콘 import 처리
     */
    async processFile(filePath, missingIcons) {
        try {
            console.log(chalk.yellow(`📝 처리 중: ${path.basename(filePath)}`));

            // 절대 경로로 변환
            const absolutePath = path.resolve(filePath);

            if (!fs.existsSync(absolutePath)) {
                throw new Error(`파일을 찾을 수 없습니다: ${absolutePath}`);
            }

            const content = fs.readFileSync(absolutePath, 'utf8');
            const updatedContent = this.addIconImports(content, missingIcons);

            if (content !== updatedContent) {
                fs.writeFileSync(absolutePath, updatedContent, 'utf8');
                this.processedFiles.push({
                    filePath: absolutePath,
                    fileName: path.basename(filePath),
                    addedIcons: missingIcons
                });
                console.log(chalk.green(`  ✅ 추가된 아이콘: ${missingIcons.join(', ')}`));
            } else {
                console.log(chalk.gray(`  ⏭️  변경사항 없음`));
            }

        } catch (error) {
            const errorInfo = {
                filePath,
                error: error.message
            };
            this.errors.push(errorInfo);
            console.log(chalk.red(`  ❌ 에러: ${error.message}`));
        }
    }

    /**
     * 파일 내용에 아이콘 import 추가
     */
    addIconImports(content, missingIcons) {
        const lines = content.split('\n');
        let lucideImportLineIndex = -1;
        let lucideImportLine = '';

        // 기존 lucide-react import 라인 찾기
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes("from 'lucide-react'")) {
                lucideImportLineIndex = i;
                lucideImportLine = line;
                break;
            }
        }

        if (lucideImportLineIndex === -1) {
            // lucide-react import가 없는 경우 새로 추가
            return this.addNewLucideImport(content, missingIcons);
        } else {
            // 기존 import에 아이콘 추가
            return this.updateExistingLucideImport(content, lucideImportLineIndex, lucideImportLine, missingIcons);
        }
    }

    /**
     * 새로운 lucide-react import 추가
     */
    addNewLucideImport(content, missingIcons) {
        const lines = content.split('\n');
        const sortedIcons = [...new Set(missingIcons)].sort();
        const newImportLine = `import { ${sortedIcons.join(', ')} } from 'lucide-react';`;

        // React import 다음에 추가
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("import React") || lines[i].includes("import { useState")) {
                insertIndex = i + 1;
                break;
            }
        }

        lines.splice(insertIndex, 0, newImportLine);
        return lines.join('\n');
    }

    /**
     * 기존 lucide-react import 업데이트
     */
    updateExistingLucideImport(content, lineIndex, importLine, missingIcons) {
        const lines = content.split('\n');

        // 기존 import에서 아이콘 목록 추출
        const importMatch = importLine.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
        if (!importMatch) {
            return content; // 매칭되지 않으면 원본 반환
        }

        const existingIcons = importMatch[1]
            .split(',')
            .map(icon => icon.trim())
            .filter(icon => icon.length > 0);

        // 새로운 아이콘 추가 및 중복 제거
        const allIcons = [...new Set([...existingIcons, ...missingIcons])].sort();

        // 새로운 import 라인 생성
        const newImportLine = `import { ${allIcons.join(', ')} } from 'lucide-react';`;
        lines[lineIndex] = newImportLine;

        return lines.join('\n');
    }

    /**
     * 처리 결과 요약 출력
     */
    printSummary() {
        console.log(chalk.cyan('\n📊 아이콘 Import 처리 결과:'));
        console.log(chalk.green(`✅ 처리된 파일: ${this.processedFiles.length}개`));

        if (this.processedFiles.length > 0) {
            this.processedFiles.forEach(file => {
                console.log(chalk.gray(`  ${file.fileName}: ${file.addedIcons.join(', ')}`));
            });
        }

        if (this.errors.length > 0) {
            console.log(chalk.red(`❌ 에러 발생: ${this.errors.length}개`));
            this.errors.forEach(error => {
                console.log(chalk.red(`  ${path.basename(error.filePath)}: ${error.error}`));
            });
        }
    }

    /**
     * 처리 결과 반환
     */
    getResults() {
        return {
            processedFiles: this.processedFiles,
            errors: this.errors,
            totalProcessed: this.processedFiles.length,
            totalErrors: this.errors.length
        };
    }
}