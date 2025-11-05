#!/usr/bin/env node

/**
 * config.json의 analysisPages 섹션을 기반으로 모든 분석 페이지를 일괄 생성하는 스크립트
 * 
 * 사용법:
 * node generateAnalysisPages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AnalysisPageGenerater } from './template_generater/analysisPageGenerater.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 파일 생성 함수
const createFile = (filePath, content) => {
	const fullPath = path.join(__dirname, '..', filePath);
	const dir = path.dirname(fullPath);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`📁 디렉토리 생성: ${dir}`);
	}

	fs.writeFileSync(fullPath, content, 'utf8');
	console.log(`✅ 생성됨: ${filePath}`);
};

// 분석 페이지 생성
const generateAnalysisPages = () => {
	try {
		console.log('🚀 분석 페이지 일괄 생성 시작\n');

		// config.json 읽기
		const configPath = path.join(__dirname, 'config.json');
		if (!fs.existsSync(configPath)) {
			console.error('❌ config.json 파일을 찾을 수 없습니다.');
			return;
		}

		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		
		if (!config.analysisPages) {
			console.log('⚠️ analysisPages 섹션이 config.json에 없습니다.');
			return;
		}

		let totalGenerated = 0;

		// 각 도메인별로 분석 페이지 생성
		Object.entries(config.analysisPages).forEach(([domain, domainPages]) => {
			console.log(`📊 ${domain} 도메인 처리 중...`);
			
			Object.entries(domainPages).forEach(([dataType, pageConfig]) => {
				const {
					path: pagePath,
					component: componentName,
					domain: pageDomain,
					dataType: pageDataType,
					chartType = 'line',
					timeRange = 'weekly',
					chartTitle = '',
					additionalProps = {}
				} = pageConfig;

				// 템플릿 생성
				const template = AnalysisPageGenerater(
					componentName,
					pageDomain,
					pageDataType,
					chartType,
					timeRange,
					chartTitle,
					additionalProps
				);

				// 파일 생성
				createFile(`src/pages/${pagePath}`, template);
				totalGenerated++;
			});
		});

		console.log(`\n🎉 분석 페이지 생성 완료! 총 ${totalGenerated}개 파일이 생성되었습니다.`);

	} catch (error) {
		console.error('❌ 분석 페이지 생성 실패:', error.message);
	}
};

// 스크립트 실행
generateAnalysisPages(); 