#!/usr/bin/env node

/**
 * .env의 SWAGGER_URL_* 목록을 기반으로 configs/{domain}.json을 자동 생성하는 스크립트
 *
 * 사용법:
 * node generateFromSwagger.js           # 전체 도메인 자동 처리
 * node generateFromSwagger.js sales     # 특정 도메인만 처리
 */

import { SwaggerAnalyzer } from './swagger-analyzer/SwaggerAnalyzer.js';
import { ConfigGenerator } from './swagger-analyzer/ConfigGenerator.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 수동 로드
function loadEnv() {
    try {
        const envPath = join(__dirname, '../.env');
        const envContent = readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                }
            }
        });
        console.log('✅ .env 파일 로드 완료');
    } catch (error) {
        console.warn('⚠️ .env 파일을 찾을 수 없습니다:', error.message);
    }
}

// .env에서 SWAGGER_URL_* 패턴 추출
function getSwaggerDomainsFromEnv() {
    return Object.keys(process.env)
        .filter(key => key.startsWith('SWAGGER_URL_'))
        .map(key => {
            // SWAGGER_URL_SALES → sales
            const domain = key.replace('SWAGGER_URL_', '').toLowerCase();
            return { domain, url: process.env[key] };
        });
}

// 도메인별 config 생성
async function generateConfigForDomain(domain, url) {
    console.log(`\n🚀 [${domain}] Swagger 기반 config 생성 시작`);
    const analyzer = new SwaggerAnalyzer();
    const generator = new ConfigGenerator();
    try {
        // 1. Swagger 문서 가져오기
        console.log(`1️⃣ Swagger 문서 가져오기: ${url}`);
        const apiDoc = await analyzer.fetchApiDoc(url, false);
        generator.setApiDoc(apiDoc);

        // 2. 엔티티 추출
        console.log('2️⃣ 엔티티 추출...');
        const entities = analyzer.extractEntities(apiDoc);
        console.log(`📋 추출된 엔티티: ${entities.length}개`);

        // 3. Config 생성
        console.log('3️⃣ Config 생성...');
        const solutionConfig = generator.generateSolutionConfig(domain, entities);

        // 4. configs/{domain}.json 저장
        const configPath = join(__dirname, 'configs', `${domain}.json`);
        writeFileSync(configPath, JSON.stringify(solutionConfig, null, 2), 'utf8');
        console.log(`✅ configs/${domain}.json 생성 완료`);
    } catch (error) {
        console.error(`❌ [${domain}] config 생성 실패:`, error.message);
    }
}

// 전체 도메인 반복 처리
async function generateAllConfigs() {
    loadEnv();
    const domains = getSwaggerDomainsFromEnv();
    if (domains.length === 0) {
        console.log('⚠️ .env에 SWAGGER_URL_* 항목이 없습니다.');
        return;
    }
    for (const { domain, url } of domains) {
        await generateConfigForDomain(domain, url);
    }
    console.log('\n🎉 모든 도메인 config 생성이 완료되었습니다!');
}

// 단일 도메인 처리
async function generateSingleConfig(domain) {
    loadEnv();
    const envKey = `SWAGGER_URL_${domain.toUpperCase()}`;
    const url = process.env[envKey];
    if (!url) {
        console.error(`❌ .env에 ${envKey}가 없습니다.`);
        return;
    }
    await generateConfigForDomain(domain, url);
}

// 메인 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    const domainArg = process.argv[2];
    if (domainArg) {
        generateSingleConfig(domainArg).catch(console.error);
    } else {
        generateAllConfigs().catch(console.error);
    }
}

export { generateAllConfigs, generateSingleConfig };