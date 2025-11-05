import axios from 'axios';

/**
 * Swagger API 문서를 분석하여 엔티티와 필드 정보를 추출하는 클래스
 */
export class SwaggerAnalyzer {
    constructor() {
        this.apiDoc = null;
        this.authToken = null;
        this.refreshToken = null;
        this.axiosInstance = null;
        this.initializeAxios();
    }

    /**
     * Axios 인스턴스를 초기화합니다
     */
    initializeAxios() {
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'http://localhost:3000',
                'Referer': 'http://localhost:3000/'
            }
        });

        // 요청 인터셉터: 토큰이 있으면 자동으로 헤더에 추가
        this.axiosInstance.interceptors.request.use(
            (config) => {
                if (this.authToken) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터: 401 에러 시 토큰 재발급 시도
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 401 && !error.config._retry) {
                    error.config._retry = true;

                    try {
                        // 먼저 refresh token으로 시도
                        const newToken = await this.refreshAccessToken();

                        if (newToken) {
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            return this.axiosInstance.request(error.config);
                        } else {
                            // refresh 실패 시 재로그인 시도
                            await this.authenticate();
                            error.config.headers.Authorization = `Bearer ${this.authToken}`;
                            return this.axiosInstance.request(error.config);
                        }
                    } catch (authError) {
                        console.error('❌ 토큰 재발급 실패:', authError.message);
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * 환경변수에서 로그인 정보를 가져와 JWT 토큰을 획득합니다
     * @returns {Promise<string>} JWT 토큰
     */
    async authenticate() {
        const baseUrl = process.env.SWAGGER_API_BASE_URL;
        const username = process.env.SWAGGER_USERNAME;
        const password = process.env.SWAGGER_PASSWORD;

        if (!baseUrl || !username || !password) {
            throw new Error(`
환경변수가 설정되지 않았습니다. .env 파일에 다음 정보를 추가해주세요:

SWAGGER_API_BASE_URL=http://your-api-server
SWAGGER_USERNAME=your-username
SWAGGER_PASSWORD=your-password
            `);
        }

        const loginUrl = `${baseUrl}/user/auth/login`;

        try {
            console.log(`🔐 로그인 시도: ${username}@${loginUrl}`);

            const response = await axios.post(loginUrl, {
                username,
                password
            });

            // 프로젝트의 API 응답 구조에 맞춰 토큰 추출
            const responseData = response.data;

            if (responseData.status !== 'success' || !responseData.data) {
                throw new Error('로그인 응답 형식이 올바르지 않습니다');
            }

            const { accessToken, refreshToken } = responseData.data;

            if (!accessToken) {
                throw new Error('로그인 응답에서 accessToken을 찾을 수 없습니다');
            }

            this.authToken = accessToken;
            this.refreshToken = refreshToken;

            console.log(`✅ 로그인 성공, 토큰 획득`);

            return accessToken;
        } catch (error) {
            console.error(`❌ 로그인 실패:`, error.response ? error.response.data : error.message);
            throw new Error(`로그인 실패: ${error.response && error.response.data ? error.response.data.message : error.message}`);
        }
    }

    /**
     * Refresh Token을 사용해서 새로운 Access Token을 획득합니다
     * @returns {Promise<string|null>} 새로운 Access Token 또는 null
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            return null;
        }

        const baseUrl = process.env.SWAGGER_API_BASE_URL;
        const refreshUrl = `${baseUrl}/user/auth/refresh`;

        try {
            console.log(`🔄 토큰 갱신 시도`);

            const response = await axios.post(refreshUrl, {
                refreshToken: this.refreshToken
            });

            const responseData = response.data;

            if (responseData.status !== 'success' || !responseData.data) {
                throw new Error('토큰 갱신 응답 형식이 올바르지 않습니다');
            }

            const { accessToken } = responseData.data;

            if (!accessToken) {
                throw new Error('토큰 갱신 응답에서 accessToken을 찾을 수 없습니다');
            }

            this.authToken = accessToken;
            console.log(`✅ 토큰 갱신 성공`);

            return accessToken;
        } catch (error) {
            console.error(`❌ 토큰 갱신 실패:`, error.response ? error.response.data : error.message);
            return null;
        }
    }

    /**
     * 토큰을 수동으로 설정합니다
     * @param {string} token - JWT 토큰
     */
    setAuthToken(token) {
        this.authToken = token;
        console.log(`🔑 토큰 설정 완료`);
    }

    /**
     * API 연결을 테스트합니다
     * @returns {Promise<boolean>} 연결 성공 여부
     */
    async testConnection() {
        try {
            const baseUrl = process.env.SWAGGER_API_BASE_URL;
            if (!baseUrl) {
                throw new Error('SWAGGER_API_BASE_URL이 설정되지 않았습니다');
            }

            // 먼저 인증 시도
            await this.authenticate();

            // 솔루션별 Swagger 문서 URL들
            const possibleSwaggerUrls = [
                process.env.SWAGGER_URL_INI,
                process.env.SWAGGER_URL_SALES,
                process.env.SWAGGER_URL_PURCHASE,
                process.env.SWAGGER_URL_PRODUCTION,
                process.env.SWAGGER_URL_MACHINE,
                process.env.SWAGGER_URL_MOLD
            ].filter(Boolean); // undefined 값 제거

            for (const swaggerUrl of possibleSwaggerUrls) {
                try {
                    console.log(`🔍 Swagger 문서 확인: ${swaggerUrl}`);
                    await this.fetchApiDoc(swaggerUrl, true);
                    console.log(`✅ API 연결 테스트 성공: ${swaggerUrl}`);
                    return true;
                } catch (error) {
                    console.log(`⚠️ ${swaggerUrl} 접근 실패, 다음 URL 시도...`);
                    continue;
                }
            }

            throw new Error('모든 Swagger URL에서 문서를 찾을 수 없습니다');
        } catch (error) {
            console.error(`❌ API 연결 테스트 실패:`, error.message);
            return false;
        }
    }

    /**
     * 특정 솔루션의 Swagger 문서를 가져옵니다
     * @param {string} solution - 솔루션명 (ini, sales, purchase, production, machine, mold)
     * @returns {Promise<Object>} OpenAPI 문서 객체
     */
    async fetchSolutionApiDoc(solution) {
        const solutionKey = `SWAGGER_URL_${solution.toUpperCase()}`;
        const swaggerUrl = process.env[solutionKey];

        if (!swaggerUrl) {
            throw new Error(`솔루션 '${solution}'의 Swagger URL이 환경변수에 설정되지 않았습니다: ${solutionKey}`);
        }

        console.log(`📡 ${solution} 솔루션 Swagger 문서 가져오기: ${swaggerUrl}`);

        // 먼저 인증 시도
        if (!this.authToken) {
            await this.authenticate();
        }

        return await this.fetchApiDoc(swaggerUrl, true);
    }

    /**
     * 특정 엔티티의 API 엔드포인트를 테스트합니다
     * @param {string} entityName - 엔티티명
     * @returns {Promise<Object>} 테스트 결과
     */
    async testEntityEndpoints(entityName) {
        if (!this.apiDoc) {
            throw new Error('API 문서가 로드되지 않았습니다. fetchApiDoc을 먼저 호출하세요.');
        }

        const entities = this.extractEntities();
        const entity = entities.find(e => e.name === entityName);

        if (!entity) {
            throw new Error(`엔티티 '${entityName}'을 찾을 수 없습니다`);
        }

        const testResults = {
            entityName,
            endpoints: [],
            success: 0,
            failed: 0
        };

        const baseUrl = process.env.SWAGGER_API_BASE_URL;

        for (const endpoint of entity.endpoints) {
            const testUrl = `${baseUrl}${endpoint.path}`;

            try {
                console.log(`🧪 테스트: ${endpoint.method} ${testUrl}`);

                // GET 요청만 테스트 (안전한 요청)
                if (endpoint.method === 'GET') {
                    const response = await this.axiosInstance.get(testUrl);
                    testResults.endpoints.push({
                        path: endpoint.path,
                        method: endpoint.method,
                        status: 'success',
                        statusCode: response.status
                    });
                    testResults.success++;
                } else {
                    testResults.endpoints.push({
                        path: endpoint.path,
                        method: endpoint.method,
                        status: 'skipped',
                        reason: 'GET 요청만 테스트'
                    });
                }
            } catch (error) {
                testResults.endpoints.push({
                    path: endpoint.path,
                    method: endpoint.method,
                    status: 'failed',
                    error: error.response ? error.response.status : error.message
                });
                testResults.failed++;
            }
        }

        console.log(`📊 ${entityName} 테스트 완료: 성공 ${testResults.success}, 실패 ${testResults.failed}`);
        return testResults;
    }

    /**
     * Swagger API 문서를 가져옵니다
     * @param {string} url - Swagger API 문서 URL
     * @param {boolean} requireAuth - 인증이 필요한지 여부 (기본값: true)
     * @returns {Promise<Object>} OpenAPI 문서 객체
     */
    async fetchApiDoc(url, requireAuth = true) {
        try {
            console.log(`📡 Fetching API document from: ${url}`);

            // 인증이 필요한 경우 먼저 로그인
            if (requireAuth && !this.authToken) {
                await this.authenticate();
            }

            const response = requireAuth
                ? await this.axiosInstance.get(url)
                : await axios.get(url);

            this.apiDoc = response.data;
            console.log(`✅ API document fetched successfully`);
            return this.apiDoc;
        } catch (error) {
            console.error(`❌ Failed to fetch API document:`, error.message);
            throw new Error(`API 문서를 가져올 수 없습니다: ${error.message}`);
        }
    }

    /**
     * API 문서에서 엔티티 목록을 추출합니다
     * @param {Object} doc - OpenAPI 문서 객체
     * @returns {Array<Object>} 엔티티 배열
     */
    extractEntities(doc = this.apiDoc) {
        if (!doc || !doc.paths) {
            throw new Error('유효하지 않은 API 문서입니다');
        }

        const entities = new Map();
        const paths = doc.paths;

        // 경로에서 엔티티 추출
        Object.keys(paths).forEach(pathKey => {
            const pathSegments = pathKey.split('/').filter(segment => segment);

            if (pathSegments.length >= 1) {
                const entityName = pathSegments[0];

                if (!entities.has(entityName)) {
                    entities.set(entityName, {
                        name: entityName,
                        endpoints: [],
                        schemas: new Set(),
                        hasDetailEndpoint: false,
                        searchSchema: null
                    });
                }

                const entity = entities.get(entityName);
                const pathItem = paths[pathKey];

                // 엔드포인트 정보 수집
                Object.keys(pathItem).forEach(method => {
                    if (['get', 'post', 'put', 'delete'].includes(method)) {
                        const operation = pathItem[method];
                        entity.endpoints.push({
                            path: pathKey,
                            method: method.toUpperCase(),
                            operation: operation,
                            tags: operation.tags || [],
                            summary: operation.summary || '',
                            operationId: operation.operationId || ''
                        });

                        // Detail 엔드포인트 감지
                        if (pathKey.includes('/detail')) {
                            entity.hasDetailEndpoint = true;
                        }

                        // Search 스키마 추출
                        if (pathKey.includes('/master') && method === 'get') {
                            const searchParam = operation.parameters ? operation.parameters.find(p =>
                                p.name === 'searchRequest'
                            ) : null;
                            if (searchParam && searchParam.schema) {
                                entity.searchSchema = this.resolveSchemaRef(searchParam.schema, doc);
                            }
                        }

                        // 응답 스키마 수집
                        if (operation.responses) {
                            Object.values(operation.responses).forEach(response => {
                                if (response.content) {
                                    Object.values(response.content).forEach(mediaType => {
                                        if (mediaType.schema) {
                                            const schemaName = this.extractSchemaName(mediaType.schema);
                                            if (schemaName) {
                                                entity.schemas.add(schemaName);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });

        const result = Array.from(entities.values()).map(entity => ({
            ...entity,
            schemas: Array.from(entity.schemas)
        }));

        console.log(`📊 추출된 엔티티: ${result.map(e => e.name).join(', ')}`);
        return result;
    }

    /**
     * 엔티티의 페이지 타입을 감지합니다 (singlePage vs masterDetailPage)
     * @param {Object} entity - 엔티티 객체
     * @returns {string} 'singlePage' 또는 'masterDetailPage'
     */
    detectMasterDetailPattern(entity) {
        // Detail 엔드포인트가 있으면 masterDetailPage
        if (entity.hasDetailEndpoint) {
            console.log(`🔍 ${entity.name}: masterDetailPage 패턴 감지`);
            return 'masterDetailPage';
        }

        console.log(`🔍 ${entity.name}: singlePage 패턴 감지`);
        return 'singlePage';
    }

    /**
     * 스키마에서 필드 정보를 추출합니다
     * @param {Object} schema - 스키마 객체
     * @param {Object} doc - OpenAPI 문서 (스키마 참조 해결용)
     * @returns {Array<Object>} 필드 정보 배열
     */
    extractFieldInfo(schema, doc = this.apiDoc) {
        if (!schema || !schema.properties) {
            return [];
        }

        const fields = [];
        const properties = schema.properties;

        Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
            const fieldInfo = {
                name: fieldName,
                type: this.mapSwaggerTypeToJSType(fieldSchema.type),
                description: fieldSchema.description || '',
                example: fieldSchema.example,
                required: schema.required ? schema.required.includes(fieldName) : false,
                maxLength: fieldSchema.maxLength,
                minLength: fieldSchema.minLength,
                format: fieldSchema.format,
                enum: fieldSchema.enum
            };

            fields.push(fieldInfo);
        });

        return fields;
    }

    /**
     * Search 스키마에서 검색 필드 정보를 추출합니다
     * @param {Object} searchSchema - 검색 스키마 객체
     * @returns {Array<Object>} 검색 필드 정보 배열
     */
    extractSearchFields(searchSchema) {
        if (!searchSchema || !searchSchema.properties) {
            return [];
        }

        const searchFields = [];
        const properties = searchSchema.properties;

        Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
            // 시스템 필드는 제외
            if (this.isSystemField(fieldName)) {
                return;
            }

            const searchField = {
                name: fieldName,
                type: fieldSchema.type || 'string',
                label: this.generateFieldLabel(fieldName),
                component: this.determineSearchComponent(fieldSchema),
                placeholder: this.generatePlaceholder(fieldName, fieldSchema),
                options: fieldSchema.enum ? fieldSchema.enum.map(value => ({
                    label: value,
                    value: value
                })) : undefined
            };

            searchFields.push(searchField);
        });

        console.log(`🔍 검색 필드 추출: ${searchFields.map(f => f.name).join(', ')}`);
        return searchFields;
    }

    /**
     * 스키마 참조를 해결합니다
     * @param {Object} schema - 스키마 객체 (참조 포함 가능)
     * @param {Object} doc - OpenAPI 문서
     * @returns {Object} 해결된 스키마 객체
     */
    resolveSchemaRef(schema, doc) {
        if (schema.$ref) {
            const refPath = schema.$ref.replace('#/', '').split('/');
            let resolved = doc;

            for (const segment of refPath) {
                resolved = resolved[segment];
                if (!resolved) break;
            }

            return resolved || schema;
        }

        return schema;
    }

    /**
     * 스키마에서 스키마 이름을 추출합니다
     * @param {Object} schema - 스키마 객체
     * @returns {string|null} 스키마 이름
     */
    extractSchemaName(schema) {
        if (schema.$ref) {
            const refParts = schema.$ref.split('/');
            return refParts[refParts.length - 1];
        }
        return null;
    }

    /**
     * Swagger 타입을 JavaScript 타입으로 매핑합니다
     * @param {string} swaggerType - Swagger 타입
     * @returns {string} JavaScript 타입
     */
    mapSwaggerTypeToJSType(swaggerType) {
        const typeMap = {
            'string': 'string',
            'integer': 'number',
            'number': 'number',
            'boolean': 'boolean',
            'array': 'array',
            'object': 'object'
        };

        return typeMap[swaggerType] || 'string';
    }

    /**
     * 필드명에서 라벨을 생성합니다
     * @param {string} fieldName - 필드명
     * @returns {string} 생성된 라벨
     */
    generateFieldLabel(fieldName) {
        const labelMap = {
            'id': 'ID',
            'createdAt': '생성일시',
            'updatedAt': '수정일시',
            'createdBy': '생성자',
            'updatedBy': '수정자',
            'vendorName': '업체명',
            'vendorNo': '업체번호',
            'orderCode': '주문코드',
            'orderDate': '주문일자',
            'deliveryDate': '납기일자',
            'itemName': '품명',
            'itemNumber': '품번',
            'unitPrice': '단가',
            'totalAmount': '총금액'
        };

        return labelMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }

    /**
     * 검색 컴포넌트 타입을 결정합니다
     * @param {Object} fieldSchema - 필드 스키마
     * @returns {string} 컴포넌트 타입
     */
    determineSearchComponent(fieldSchema) {
        if (fieldSchema.enum) {
            return 'select';
        }

        if (fieldSchema.format === 'date' || fieldSchema.format === 'date-time') {
            return 'date';
        }

        if (fieldSchema.type === 'boolean') {
            return 'select';
        }

        return 'input';
    }

    /**
     * 플레이스홀더를 생성합니다
     * @param {string} fieldName - 필드명
     * @param {Object} fieldSchema - 필드 스키마
     * @returns {string} 플레이스홀더 텍스트
     */
    generatePlaceholder(fieldName, fieldSchema) {
        if (fieldSchema.example) {
            return fieldSchema.example;
        }

        const label = this.generateFieldLabel(fieldName);
        return `${label}을(를) 입력하세요`;
    }

    /**
     * 시스템 필드인지 확인합니다
     * @param {string} fieldName - 필드명
     * @returns {boolean} 시스템 필드 여부
     */
    isSystemField(fieldName) {
        const systemFields = [
            'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
            'createdAtStart', 'createdAtEnd', 'updatedAtStart', 'updatedAtEnd',
            'tenantId', 'isDelete', 'page', 'size'
        ];

        return systemFields.includes(fieldName);
    }
}