#!/usr/bin/env node

/**
 * 분석 페이지를 동적으로 생성하는 스크립트
 * 
 * 사용법:
 * node createAnalysisPage.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AnalysisPageGenerater } from './template_generater/analysisPageGenerater.js';
import { askQuestion, closeReadline } from './utils/askQuestion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 지원하는 도메인과 데이터 타입
const SUPPORTED_DOMAINS = ['sales', 'purchase', 'production', 'incoming', 'mold', 'aps', 'cmms', 'qms'];
const SUPPORTED_CHART_TYPES = ['line', 'bar', 'pie', 'area', 'scatter'];
const SUPPORTED_TIME_RANGES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

// config.json 읽기
const loadConfig = () => {
	try {
		const configPath = path.join(__dirname, 'config.json');
		const configContent = fs.readFileSync(configPath, 'utf8');
		return JSON.parse(configContent);
	} catch (error) {
		console.error('❌ config.json 파일을 읽을 수 없습니다:', error.message);
		return { analysisPages: {} };
	}
};

// config.json 저장
const saveConfig = (config) => {
	try {
		const configPath = path.join(__dirname, 'config.json');
		fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'), 'utf8');
		console.log('✅ config.json 업데이트 완료');
	} catch (error) {
		console.error('❌ config.json 저장 실패:', error.message);
	}
};

// 분석 페이지 생성
const createAnalysisPage = async () => {
	console.log('🚀 분석 페이지 생성 시작\n');

	try {
		// 1. 도메인 선택
		console.log('📋 지원하는 도메인:');
		SUPPORTED_DOMAINS.forEach((domain, index) => {
			console.log(`   ${index + 1}. ${domain}`);
		});

		const domainIndex = await askQuestion('\n도메인을 선택하세요 (1-7) [default: 1]: ');
		const domain = SUPPORTED_DOMAINS[parseInt(domainIndex) - 1] || SUPPORTED_DOMAINS[0];
		console.log(`✅ 선택된 도메인: ${domain}\n`);

		// 2. 데이터 타입 입력
		const dataType = await askQuestion('데이터 타입을 입력하세요 (예: orders, delivery, sales): ');
		if (!dataType.trim()) {
			console.log('❌ 데이터 타입은 필수입니다.');
			return;
		}
		console.log(`✅ 데이터 타입: ${dataType}\n`);

		// 3. 차트 타입 선택
		console.log('📊 지원하는 차트 타입:');
		SUPPORTED_CHART_TYPES.forEach((type, index) => {
			console.log(`   ${index + 1}. ${type}`);
		});

		const chartTypeIndex = await askQuestion('\n차트 타입을 선택하세요 (1-5) [default: 1]: ');
		const chartType = SUPPORTED_CHART_TYPES[parseInt(chartTypeIndex) - 1] || SUPPORTED_CHART_TYPES[0];
		console.log(`✅ 선택된 차트 타입: ${chartType}\n`);

		// 4. 시간 범위 선택
		console.log('⏰ 지원하는 시간 범위:');
		SUPPORTED_TIME_RANGES.forEach((range, index) => {
			console.log(`   ${index + 1}. ${range}`);
		});

		const timeRangeIndex = await askQuestion('\n시간 범위를 선택하세요 (1-5) [default: 2]: ');
		const timeRange = SUPPORTED_TIME_RANGES[parseInt(timeRangeIndex) - 1] || SUPPORTED_TIME_RANGES[1];
		console.log(`✅ 선택된 시간 범위: ${timeRange}\n`);

		// 5. 페이지 경로 입력
		const defaultPath = `${domain}/${dataType}`;
		const pagePath = await askQuestion(`페이지 경로를 입력하세요 [default: ${defaultPath}]: `) || defaultPath;
		console.log(`✅ 페이지 경로: ${pagePath}\n`);

		// 6. 컴포넌트명 생성
		const componentName = `${domain.charAt(0).toUpperCase() + domain.slice(1)}${dataType.charAt(0).toUpperCase() + dataType.slice(1)}AnalysisPage`;
		console.log(`✅ 생성될 컴포넌트명: ${componentName}\n`);

		// 7. 차트 제목 입력
		const chartTitle = await askQuestion('차트 제목을 입력하세요 (선택사항): ');
		console.log(`✅ 차트 제목: ${chartTitle || '기본 제목'}\n`);

		// 8. 추가 속성 입력
		const additionalProps = {};
		const addMoreProps = await askQuestion('추가 속성을 설정하시겠습니까? (y/n) [default: n]: ');
		
		if (addMoreProps.toLowerCase() === 'y') {
			while (true) {
				const propName = await askQuestion('속성명을 입력하세요 (종료하려면 빈 값): ');
				if (!propName.trim()) break;
				
				const propValue = await askQuestion(`${propName}의 값을 입력하세요: `);
				additionalProps[propName] = propValue;
			}
		}

		// 9. 파일 생성
		const config = loadConfig();
		
		// analysisPages 섹션이 없으면 생성
		if (!config.analysisPages) {
			config.analysisPages = {};
		}
		
		// 도메인 섹션이 없으면 생성
		if (!config.analysisPages[domain]) {
			config.analysisPages[domain] = {};
		}

		// 분석 페이지 정보 추가
		config.analysisPages[domain][dataType] = {
			path: `${pagePath}/${componentName}.tsx`,
			component: componentName,
			domain: domain,
			dataType: dataType,
			chartType: chartType,
			timeRange: timeRange,
			chartTitle: chartTitle || `${componentName} 분석`,
			additionalProps: additionalProps
		};

		// 파일 생성
		const filePath = path.join(__dirname, '..', 'src', 'pages', pagePath, `${componentName}.tsx`);
		const dirPath = path.dirname(filePath);

		// 디렉토리 생성
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
			console.log(`📁 디렉토리 생성: ${dirPath}`);
		}

		// 템플릿 생성
		const template = AnalysisPageGenerater(
			componentName,
			domain,
			dataType,
			chartType,
			timeRange,
			chartTitle,
			additionalProps
		);

		// 파일 저장
		fs.writeFileSync(filePath, template, 'utf8');
		console.log(`✅ 분석 페이지 생성 완료: ${filePath}`);

		// config.json 저장
		saveConfig(config);

		console.log('\n🎉 분석 페이지 생성이 완료되었습니다!');
		console.log(`📄 파일 위치: ${filePath}`);
		console.log(`🔧 컴포넌트명: ${componentName}`);
		console.log(`📊 차트 설정: ${chartType} 차트, ${timeRange} 범위`);

	} catch (error) {
		console.error('❌ 분석 페이지 생성 실패:', error.message);
	} finally {
		closeReadline();
	}
};

// 스크립트 실행
createAnalysisPage(); 