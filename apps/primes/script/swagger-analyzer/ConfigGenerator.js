/**
 * Swagger 분석 결과를 바탕으로 Primes config를 생성하는 클래스
 */
import { toCamelCase, toPascalCase } from '../utils/stringUtils.js';
import { safeGet } from '../utils/compatibilityUtils.js';
// 탭 패턴 상수
const TabPattern = {
	SINGLE_ONLY: 'single-only', // 단순 목록만
	SINGLE_WITH_REGISTER: 'single-register', // 목록 + 등록
	MASTER_DETAIL_SIMPLE: 'master-detail-simple', // 마스터-디테일 (등록 모달)
	MASTER_DETAIL_FULL: 'master-detail-full', // 마스터-디테일 (등록 페이지)
};

// 탭 템플릿 정의
const SINGLE_ONLY_TABS = [
	{
		id: 'list',
		name: '현황',
		type: 'singlePage',
		icon: 'TableProperties',
		isDefault: true,
	},
];

const SINGLE_WITH_REGISTER_TABS = [
	{
		id: 'list',
		name: '현황',
		type: 'singlePage',
		icon: 'TableProperties',
		isDefault: true,
	},
];

const MASTER_DETAIL_SIMPLE_TABS = [
	{
		id: 'related-list',
		name: '상세 목록',
		type: 'masterDetailPage',
		icon: 'Table',
		isDefault: true,
	},
	{
		id: 'list',
		name: '전체 현황',
		type: 'singlePage',
		icon: 'FileText',
		isDefault: false,
	},
];

const MASTER_DETAIL_FULL_TABS = [
	{
		id: 'related-list',
		name: '상세 목록',
		type: 'masterDetailPage',
		icon: 'Table',
		isDefault: true,
	},
	{
		id: 'list',
		name: '전체 현황',
		type: 'singlePage',
		icon: 'FileText',
		isDefault: false,
	},
	{
		id: 'analyze',
		name: '분석',
		type: 'singlePage',
		icon: 'ChartPie',
		isDefault: false,
		isAnalyze: true,
	},
];

export class ConfigGenerator {
	constructor() {
		this.apiDoc = null;
		this.iconMap = {
			order: 'ShoppingCart',
			estimate: 'FileText',
			delivery: 'Truck',
			shipment: 'Package',
			shipping: 'Package',
			taxinvoice: 'Receipt',
			statement: 'FileText',
			user: 'Users',
			vendor: 'Building',
			item: 'Package',
			customer: 'UserCheck',
		};
	}

	/**
	 * API 문서를 설정합니다
	 * @param {Object} apiDoc - OpenAPI 문서 객체
	 */
	setApiDoc(apiDoc) {
		this.apiDoc = apiDoc;
	}

	/**
	 * 솔루션 전체 config를 생성합니다
	 * @param {string} solution - 솔루션명
	 * @param {Array<Object>} entities - 엔티티 배열
	 * @returns {Object} 솔루션 config 객체
	 */
	generateSolutionConfig(solution, entities) {
		const modules = {};

		entities.forEach((entity) => {
			const moduleConfig = this.generateModuleConfig(entity, solution);
			// 모듈 키도 camelCase로 변환
			const moduleKey = this.toCamelCase(entity.name);
			modules[moduleKey] = moduleConfig;
		});

		return { modules };
	}

	/**
	 * 문자열을 camelCase로 변환합니다 (하이픈, 언더스코어 제거)
	 * @param {string} str - 변환할 문자열
	 * @returns {string} camelCase 문자열
	 */
	toCamelCase(str) {
		return toCamelCase(str);
	}

	/**
	 * 개별 모듈 config를 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Object} 모듈 config 객체
	 */
	generateModuleConfig(entity, solution) {
		const moduleName = this.generateModuleName(entity.name);
		const pageType = this.determinePageType(entity);

		return {
			name: moduleName,
			path: `${solution}/${entity.name}`,
			route: `/${solution}/${entity.name}`,
			pageType: pageType, // 페이지 타입 정보 추가
			tabs: this.generateTabs(entity, solution),
			actions: this.generateActions(entity, solution),
			menuOptions: this.generateMenuOptions(entity, solution, moduleName),
		};
	}

	/**
	 * 엔티티별 탭 구성을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateTabs(entity, solution) {
		const pattern = this.determineTabPattern(entity);

		switch (pattern) {
			case TabPattern.SINGLE_ONLY:
				return this.generateSingleOnlyTabs(entity, solution);

			case TabPattern.SINGLE_WITH_REGISTER:
				return this.generateSingleWithRegisterTabs(entity, solution);

			case TabPattern.MASTER_DETAIL_SIMPLE:
				return this.generateMasterDetailSimpleTabs(entity, solution);

			case TabPattern.MASTER_DETAIL_FULL:
				return this.generateMasterDetailTabs(entity, solution);

			default:
				return this.generateDefaultTabs(entity, solution);
		}
	}

	/**
	 * 탭 패턴을 결정합니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {string} 탭 패턴
	 */
	determineTabPattern(entity) {
		const hasCreateEndpoint = this.hasCreateEndpoint(entity);
		const hasUpdateEndpoint = this.hasUpdateEndpoint(entity);
		const hasDetailEndpoint = entity.hasDetailEndpoint;
		const hasComplexOperations = hasCreateEndpoint || hasUpdateEndpoint;

		// 마스터-디테일 관계가 있는 경우
		if (hasDetailEndpoint) {
			// 복잡한 등록/수정 로직이 있으면 전체 버전
			if (hasComplexOperations && this.hasComplexFormFields(entity)) {
				return TabPattern.MASTER_DETAIL_FULL;
			}
			// 간단한 경우 심플 버전
			return TabPattern.MASTER_DETAIL_SIMPLE;
		}

		// 단일 테이블인 경우
		if (hasCreateEndpoint || hasUpdateEndpoint) {
			return TabPattern.SINGLE_WITH_REGISTER;
		}

		// 읽기 전용인 경우
		return TabPattern.SINGLE_ONLY;
	}

	/**
	 * CREATE 엔드포인트가 있는지 확인
	 * @param {Object} entity - 엔티티 객체
	 * @returns {boolean} CREATE 엔드포인트 존재 여부
	 */
	hasCreateEndpoint(entity) {
		return entity.endpoints.some(
			(ep) =>
				ep.method === 'POST' &&
				(ep.path.includes('/master') || ep.path === `/${entity.name}`)
		);
	}

	/**
	 * UPDATE 엔드포인트가 있는지 확인
	 * @param {Object} entity - 엔티티 객체
	 * @returns {boolean} UPDATE 엔드포인트 존재 여부
	 */
	hasUpdateEndpoint(entity) {
		return entity.endpoints.some(
			(ep) =>
				ep.method === 'PUT' &&
				(ep.path.includes('/master') ||
					ep.path.includes(`/${entity.name}`))
		);
	}

	/**
	 * 복잡한 폼 필드를 가지는지 확인
	 * @param {Object} entity - 엔티티 객체
	 * @returns {boolean} 복잡한 폼 필드 여부
	 */
	hasComplexFormFields(entity) {
		const createSchema = this.findCreateRequestSchema(entity);
		if (!createSchema || !createSchema.properties) return false;

		const fieldCount = Object.keys(createSchema.properties).length;

		// 필드가 5개 이상이거나 특정 복잡한 필드 타입이 있으면 복잡한 것으로 판단
		if (fieldCount >= 5) return true;

		// 복잡한 필드 타입 확인
		const properties = createSchema.properties;
		return Object.values(properties).some(
			(field) =>
				field.type === 'array' ||
				field.type === 'object' ||
				(field.maxLength && field.maxLength > 200)
		);
	}

	/**
	 * Single Only 탭들을 생성합니다 (읽기 전용)
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateSingleOnlyTabs(entity, solution) {
		const tabs = [];
		const basePath = `/${solution}/${entity.name}`;
		const basePageName = this.generatePageName(entity.name, solution);

		SINGLE_ONLY_TABS.forEach((template) => {
			const tab = this.createTabFromTemplate(
				template,
				entity,
				solution,
				basePath,
				basePageName
			);
			tabs.push(tab);
		});

		return tabs;
	}

	/**
	 * Single with Register 탭들을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateSingleWithRegisterTabs(entity, solution) {
		const tabs = [];
		const basePath = `/${solution}/${entity.name}`;
		const basePageName = this.generatePageName(entity.name, solution);

		SINGLE_WITH_REGISTER_TABS.forEach((template) => {
			const tab = this.createTabFromTemplate(
				template,
				entity,
				solution,
				basePath,
				basePageName
			);
			tabs.push(tab);
		});

		return tabs;
	}

	/**
	 * Master-Detail Simple 탭들을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateMasterDetailSimpleTabs(entity, solution) {
		const tabs = [];
		const basePath = `/${solution}/${entity.name}`;
		const basePageName = this.generatePageName(entity.name, solution);

		MASTER_DETAIL_SIMPLE_TABS.forEach((template) => {
			const tab = this.createTabFromTemplate(
				template,
				entity,
				solution,
				basePath,
				basePageName
			);
			tabs.push(tab);
		});

		return tabs;
	}

	/**
	 * Master-Detail 탭들을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateMasterDetailTabs(entity, solution) {
		const tabs = [];
		const basePath = `/${solution}/${entity.name}`;
		const basePageName = this.generatePageName(entity.name, solution);

		MASTER_DETAIL_FULL_TABS.forEach((template) => {
			// 분석 탭은 템플릿이 준비되면 추가
			if (template.isAnalyze && !this.isAnalyzeTabSupported()) {
				return;
			}

			const tab = this.createTabFromTemplate(
				template,
				entity,
				solution,
				basePath,
				basePageName
			);
			tabs.push(tab);
		});

		return tabs;
	}

	/**
	 * 기본 탭들을 생성합니다 (fallback)
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 탭 배열
	 */
	generateDefaultTabs(entity, solution) {
		return this.generateSingleOnlyTabs(entity, solution);
	}

	/**
	 * 템플릿에서 탭을 생성합니다
	 * @param {Object} template - 탭 템플릿
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @param {string} basePath - 기본 경로
	 * @param {string} basePageName - 기본 페이지명
	 * @returns {Object} 탭 객체
	 */
	createTabFromTemplate(template, entity, solution, basePath, basePageName) {
		const moduleName = this.generateModuleName(entity.name);

		const tab = {
			id: template.id,
			name: template.name,
			type: template.type,
			path: `${basePath}/${template.id}`,
			pageName: this.generateTabPageName(basePageName, template),
			icon: template.icon,
			default: template.isDefault,
			tableControl: {
				title: this.generateTabTitle(moduleName, template),
				useEdit: !template.isAnalyze,
				useDelete: !template.isAnalyze,
				useExport: true,
			},
			searchOptions: {
				fields: template.isAnalyze
					? []
					: this.determineSearchFields(entity),
			},
			searchSlotFields: template.isAnalyze
				? []
				: this.createSearchSlotFields(entity),
		};

		// 탭 타입별 특별 처리
		if (template.type === 'masterDetailPage') {
			tab.masterColumns = this.createColumnsFromEntity(entity, 'master');
			tab.detailColumns = this.createColumnsFromEntity(entity, 'detail');
			// hook 이름에서 하이픈 제거하여 올바른 camelCase 생성
			const normalizedEntityName = this.toPascalCase(entity.name);
			tab.masterDataHook = `use${normalizedEntityName}Master`;
			tab.detailDataHook = `use${normalizedEntityName}Detail`;
		} else {
			tab.columns = template.isAnalyze
				? []
				: this.createColumnsFromEntity(entity, 'master');
			const normalizedEntityName = this.toPascalCase(entity.name);
			tab.dataHook = template.isAnalyze
				? `use${normalizedEntityName}Analytics`
				: `use${normalizedEntityName}`;
		}

		return tab;
	}

	/**
	 * 탭 페이지명을 생성합니다
	 * @param {string} basePageName - 기본 페이지명
	 * @param {Object} template - 탭 템플릿
	 * @returns {string} 탭 페이지명
	 */
	generateTabPageName(basePageName, template) {
		const suffixMap = {
			list: 'ListPage',
			'related-list': 'MasterDetailPage',
			analyze: 'AnalyzePage',
		};

		const suffix = suffixMap[template.id] || 'Page';
		return `${basePageName}${suffix}`;
	}

	/**
	 * 탭 제목을 생성합니다
	 * @param {string} moduleName - 모듈명
	 * @param {Object} template - 탭 템플릿
	 * @returns {string} 탭 제목
	 */
	generateTabTitle(moduleName, template) {
		const titleMap = {
			list: `${moduleName} 목록`,
			'related-list': `${moduleName} 상세`,
			analyze: `${moduleName} 분석`,
		};

		return titleMap[template.id] || `${moduleName}`;
	}

	/**
	 * 액션 구성을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Array<Object>} 액션 배열
	 */
	generateActions(entity, solution) {
		const actions = [];
		const pattern = this.determineTabPattern(entity);
		const basePageName = this.generatePageName(entity.name, solution);
		const moduleName = this.generateModuleName(entity.name);

		// CREATE 액션이 필요한 패턴들
		const needsCreateAction = [
			TabPattern.SINGLE_WITH_REGISTER,
			TabPattern.MASTER_DETAIL_SIMPLE,
			TabPattern.MASTER_DETAIL_FULL,
		];

		if (
			needsCreateAction.includes(pattern) &&
			this.hasCreateEndpoint(entity)
		) {
			const action = {
				type: 'create',
				action: this.determineActionType(pattern),
				pageName: `${basePageName}RegisterPage`,
				title: `${moduleName} 등록`,
				hookName: `use${this.toPascalCase(entity.name)}`,
				formFields: this.createFormFieldsFromEntity(entity),
			};

			// navigation 타입인 경우 경로 추가
			if (action.action === 'navigation') {
				action.path = `/${solution}/${entity.name}/register`;
			}

			actions.push(action);
		}

		return actions;
	}

	/**
	 * 액션 타입을 결정합니다
	 * @param {string} pattern - 탭 패턴
	 * @returns {string} 액션 타입 ('modal' 또는 'navigation')
	 */
	determineActionType(pattern) {
		switch (pattern) {
			case TabPattern.MASTER_DETAIL_FULL:
			case TabPattern.MASTER_DETAIL_SIMPLE:
				// MasterDetailPage는 navigation 방식으로 등록
				return 'navigation';
			case TabPattern.SINGLE_WITH_REGISTER:
			case TabPattern.SINGLE_ONLY:
				// SinglePage는 modal 방식으로 등록
				return 'modal';
			default:
				return 'modal';
		}
	}

	/**
	 * 메뉴 옵션을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @param {string} moduleName - 모듈명
	 * @returns {Object} 메뉴 옵션 객체
	 */
	generateMenuOptions(entity, solution, moduleName) {
		const pageType = this.determinePageType(entity);
		const defaultPath =
			pageType === 'masterDetailPage'
				? `/${solution}/${entity.name}/related-list`
				: `/${solution}/${entity.name}/list`;

		return {
			type: 'single',
			icon: this.getEntityIcon(entity.name),
			name: `menu.${solution}_${entity.name}`,
			to: defaultPath,
		};
	}

	/**
	 * 테이블 컬럼을 생성합니다
	 * @param {Array<Object>} fields - FieldInfo 배열 (SwaggerAnalyzer에서 추출된 필드 정보)
	 * @returns {Array<Object>} 컬럼 배열
	 */
	createColumns(fields) {
		if (!Array.isArray(fields)) return [];

		const columns = [];

		fields.forEach((fieldInfo) => {
			// 시스템 필드는 ID만 포함
			if (this.isSystemField(fieldInfo.name) && fieldInfo.name !== 'id') {
				return;
			}

			const column = {
				accessorKey: fieldInfo.name,
				header: this.generateFieldLabel(fieldInfo.name),
				size: this.getColumnSize(fieldInfo.name, fieldInfo),
			};

			// 최소 크기 설정
			if (fieldInfo.name === 'id') {
				column.minSize = 60;
			}

			columns.push(column);
		});

		return columns;
	}

	/**
	 * 엔티티에서 응답 스키마를 찾아 컬럼을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} type - 'master' 또는 'detail'
	 * @returns {Array<Object>} 컬럼 배열
	 */
	createColumnsFromEntity(entity, type = 'master') {
		const schema =
			type === 'master'
				? this.findMasterResponseSchema(entity)
				: this.findDetailResponseSchema(entity);

		if (!schema) {
			console.warn(
				`⚠️ ${entity.name}: ${type} 응답 스키마를 찾을 수 없습니다`
			);
			return [];
		}

		const fieldInfos = this.extractFieldInfoFromSchema(schema);
		return this.createColumns(fieldInfos);
	}

	/**
	 * 폼 필드를 생성합니다 (CREATE/UPDATE 요청 스키마 기반)
	 * @param {Array<Object>} fields - FieldInfo 배열 (SwaggerAnalyzer에서 추출된 필드 정보)
	 * @returns {Array<Object>} 폼 필드 배열
	 */
	createFormFields(fields) {
		if (!Array.isArray(fields)) return [];

		const formFields = [];

		fields.forEach((fieldInfo) => {
			// 시스템 필드나 읽기 전용 필드는 제외
			if (
				this.isSystemField(fieldInfo.name) ||
				this.isReadOnlyField(fieldInfo.name)
			) {
				return;
			}

			const formField = {
				name: fieldInfo.name,
				label: this.generateFieldLabel(fieldInfo.name),
				type: this.mapToFormFieldType(fieldInfo),
				placeholder: this.generatePlaceholder(
					fieldInfo.name,
					fieldInfo
				),
				required: fieldInfo.required || false,
			};

			// Select 옵션 추가
			if (fieldInfo.enum) {
				formField.options = fieldInfo.enum.map((value) => ({
					label: value,
					value: value,
				}));
			}

			// 마스크 처리
			if (this.needsMask(fieldInfo.name)) {
				formField.mask = this.getMask(fieldInfo.name);
				if (
					fieldInfo.name.includes('tel') ||
					fieldInfo.name.includes('phone')
				) {
					formField.maskAutoDetect = true;
				}
			}

			// 최대 길이 설정
			if (fieldInfo.maxLength) {
				formField.maxLength = fieldInfo.maxLength;
			}

			// 패턴 검증 추가
			if (fieldInfo.format === 'email') {
				formField.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			}

			formFields.push(formField);
		});

		return formFields;
	}

	/**
	 * 엔티티에서 CREATE 요청 스키마를 찾아 폼 필드를 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Array<Object>} 폼 필드 배열
	 */
	createFormFieldsFromEntity(entity) {
		const createSchema = this.findCreateRequestSchema(entity);
		if (!createSchema) {
			console.warn(
				`⚠️ ${entity.name}: CREATE 요청 스키마를 찾을 수 없습니다`
			);
			return [];
		}

		const fieldInfos = this.extractFieldInfoFromSchema(createSchema);
		return this.createFormFields(fieldInfos);
	}

	/**
	 * SearchSlot 필드를 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Array<Object>} SearchSlot 필드 배열
	 */
	createSearchSlotFields(entity) {
		if (!entity.searchSchema) return [];

		const searchFields = [];
		const properties = entity.searchSchema.properties || {};

		Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
			if (this.isSystemField(fieldName)) return;

			const searchField = {
				name: fieldName,
				label: this.generateFieldLabel(fieldName),
				type: this.mapToSearchFieldType(fieldSchema),
				placeholder: this.generatePlaceholder(fieldName),
			};

			if (fieldSchema.enum) {
				searchField.options = fieldSchema.enum.map((value) => ({
					label: value,
					value: value,
				}));
			}

			searchFields.push(searchField);
		});

		return searchFields;
	}

	/**
	 * 검색 필드를 결정합니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Array<string>} 검색 필드명 배열
	 */
	determineSearchFields(entity) {
		const masterSchema = this.findMasterResponseSchema(entity);
		if (!masterSchema) return [];

		const searchableFields = [];
		const properties = masterSchema.properties || {};

		Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
			if (this.isSearchableField(fieldName, fieldSchema)) {
				searchableFields.push(fieldName);
			}
		});

		return searchableFields.slice(0, 3); // 최대 3개까지
	}

	// Helper Methods

	/**
	 * 페이지 타입을 결정합니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {string} 페이지 타입
	 */
	determinePageType(entity) {
		const pattern = this.determineTabPattern(entity);

		switch (pattern) {
			case TabPattern.MASTER_DETAIL_SIMPLE:
			case TabPattern.MASTER_DETAIL_FULL:
				return 'masterDetailPage';
			case TabPattern.SINGLE_ONLY:
			case TabPattern.SINGLE_WITH_REGISTER:
			default:
				return 'singlePage';
		}
	}

	/**
	 * 모듈명을 생성합니다
	 */
	generateModuleName(entityName) {
		const nameMap = {
			order: '주문 관리',
			estimate: '견적 관리',
			delivery: '납품 관리',
			shipment: '출하 관리',
			shipping: '출하 관리',
			taxinvoice: '세금계산서',
			statement: '명세서',
			user: '사용자 관리',
			vendor: '거래처 관리',
			item: '품목 관리',
			customer: '고객 관리',
		};

		return nameMap[entityName.toLowerCase()] || `${entityName} 관리`;
	}

	/**
	 * 페이지명을 생성합니다
	 */
	generatePageName(entityName, solution) {
		const cleanEntityName = this.toPascalCase(entityName);
		return `${this.capitalize(solution)}${cleanEntityName}`;
	}

	/**
	 * 문자열을 PascalCase로 변환합니다 (하이픈, 언더스코어 제거)
	 * @param {string} str - 변환할 문자열
	 * @returns {string} PascalCase 문자열
	 */
	toPascalCase(str) {
		return toPascalCase(str);
	}

	/**
	 * 엔티티 아이콘을 가져옵니다
	 */
	getEntityIcon(entityName) {
		return this.iconMap[entityName.toLowerCase()] || 'TableProperties';
	}

	/**
	 * CREATE 요청 스키마를 찾습니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Object|null} CREATE 요청 스키마
	 */
	findCreateRequestSchema(entity) {
		// POST 엔드포인트에서 requestBody 스키마 찾기
		const postEndpoint = entity.endpoints.find(
			(ep) =>
				ep.method === 'POST' &&
				(ep.path.includes('/master') || ep.path === `/${entity.name}`)
		);

		if (!postEndpoint || !postEndpoint.operation.requestBody) {
			return null;
		}

		const requestBody = postEndpoint.operation.requestBody;
		const content = requestBody.content;

		// application/json 컨텐츠 타입에서 스키마 추출
		if (
			content &&
			content['application/json'] &&
			content['application/json'].schema
		) {
			return this.resolveSchemaRef(content['application/json'].schema);
		}

		return null;
	}

	/**
	 * UPDATE 요청 스키마를 찾습니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Object|null} UPDATE 요청 스키마
	 */
	findUpdateRequestSchema(entity) {
		// PUT 엔드포인트에서 requestBody 스키마 찾기
		const putEndpoint = entity.endpoints.find(
			(ep) =>
				ep.method === 'PUT' &&
				(ep.path.includes('/master') ||
					ep.path.includes(`/${entity.name}`))
		);

		if (!putEndpoint || !putEndpoint.operation.requestBody) {
			return null;
		}

		const requestBody = putEndpoint.operation.requestBody;
		const content = requestBody.content;

		if (
			content &&
			content['application/json'] &&
			content['application/json'].schema
		) {
			return this.resolveSchemaRef(content['application/json'].schema);
		}

		return null;
	}

	/**
	 * Master 응답 스키마를 찾습니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Object|null} Master 응답 스키마
	 */
	findMasterResponseSchema(entity) {
		// 다양한 패턴의 GET 엔드포인트 찾기 (우선순위 순)
		const patterns = [
			'/master', // 기본 패턴
			'/list', // 목록 조회
			'', // 기본 엔티티 조회 (예: /vendor)
			'/search', // 검색 엔드포인트
			'/all', // 전체 조회
		];

		let getMasterEndpoint = null;
		let usedPattern = '';

		for (const pattern of patterns) {
			getMasterEndpoint = entity.endpoints.find(
				(ep) =>
					ep.method === 'GET' &&
					(pattern === ''
						? ep.path === `/${entity.name}` ||
							ep.path.endsWith(`/${entity.name}`)
						: ep.path.includes(pattern)) &&
					!ep.path.includes('/fields/') &&
					!ep.path.includes('/{id}') &&
					!ep.path.includes('/detail')
			);

			if (getMasterEndpoint) {
				usedPattern = pattern || 'base';
				break;
			}
		}

		if (!getMasterEndpoint) {
			console.warn(
				`⚠️ ${entity.name}: GET 엔드포인트를 찾을 수 없습니다`
			);
			console.warn(
				`   사용 가능한 엔드포인트: ${entity.endpoints
					.filter((ep) => ep.method === 'GET')
					.map((ep) => ep.path)
					.join(', ')}`
			);
			return null;
		}

		console.log(
			`🔍 ${entity.name}: GET 엔드포인트 발견 (${usedPattern}) - ${getMasterEndpoint.path}`
		);
		const schema = this.extractResponseSchema(getMasterEndpoint.operation);

		if (schema) {
			console.log(`✅ ${entity.name}: Master 스키마 추출 성공`);
			console.log(
				`   Properties: ${Object.keys(schema.properties || {}).join(', ')}`
			);
		} else {
			console.warn(`⚠️ ${entity.name}: Master 스키마 추출 실패`);
		}

		return schema;
	}

	/**
	 * Detail 응답 스키마를 찾습니다
	 * @param {Object} entity - 엔티티 객체
	 * @returns {Object|null} Detail 응답 스키마
	 */
	findDetailResponseSchema(entity) {
		// 다양한 패턴의 Detail GET 엔드포인트 찾기
		const detailPatterns = [
			'/detail', // 기본 detail 패턴
			'/{id}', // ID로 조회
			'/by-master-id', // Master ID로 detail 조회
		];

		let getDetailEndpoint = null;

		for (const pattern of detailPatterns) {
			getDetailEndpoint = entity.endpoints.find(
				(ep) =>
					ep.method === 'GET' &&
					ep.path.includes(pattern) &&
					!ep.path.includes('/fields/')
			);

			if (getDetailEndpoint) {
				console.log(
					`🔍 ${entity.name}: Detail 엔드포인트 발견 - ${getDetailEndpoint.path}`
				);
				break;
			}
		}

		if (!getDetailEndpoint) {
			console.log(
				`ℹ️ ${entity.name}: Detail 엔드포인트 없음 (단일 테이블로 처리)`
			);
			return null;
		}

		return this.extractResponseSchema(getDetailEndpoint.operation);
	}

	/**
	 * 오퍼레이션에서 응답 스키마를 추출합니다
	 * @param {Object} operation - OpenAPI 오퍼레이션 객체
	 * @returns {Object|null} 응답 스키마
	 */
	extractResponseSchema(operation) {
		if (!operation.responses) return null;

		// 200 응답에서 스키마 추출
		const successResponse =
			operation.responses['200'] || operation.responses['201'];
		if (!successResponse || !successResponse.content) return null;

		const content = successResponse.content;

		// application/json 또는 */* 컨텐츠 타입에서 스키마 추출
		let schema = null;
		if (content['application/json'] && content['application/json'].schema) {
			schema = content['application/json'].schema;
		} else if (content['*/*'] && content['*/*'].schema) {
			schema = content['*/*'].schema;
		}

		if (!schema) return null;

		// $ref로 참조된 스키마 해결
		const resolvedSchema = this.resolveSchemaRef(schema);

		// CommonResponse 패턴 처리 (data 필드에서 실제 데이터 추출)
		if (resolvedSchema.properties && resolvedSchema.properties.data) {
			const dataSchema = this.resolveSchemaRef(
				resolvedSchema.properties.data
			);

			// 페이징된 응답인 경우 content 배열의 items 스키마 반환
			if (
				dataSchema.properties &&
				dataSchema.properties.content &&
				dataSchema.properties.content.type === 'array'
			) {
				return this.resolveSchemaRef(
					dataSchema.properties.content.items
				);
			}

			// 배열 응답인 경우 items 스키마 반환
			if (dataSchema.type === 'array' && dataSchema.items) {
				return this.resolveSchemaRef(dataSchema.items);
			}

			return dataSchema;
		}

		// 배열 응답인 경우 items 스키마 반환
		if (resolvedSchema.type === 'array' && resolvedSchema.items) {
			return this.resolveSchemaRef(resolvedSchema.items);
		}

		return resolvedSchema;
	}

	/**
	 * 스키마에서 필드 정보를 추출합니다
	 * @param {Object} schema - 스키마 객체
	 * @returns {Array<Object>} FieldInfo 배열
	 */
	extractFieldInfoFromSchema(schema) {
		if (!schema || !schema.properties) return [];

		const fields = [];
		const properties = schema.properties;

		Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
			const fieldInfo = {
				name: fieldName,
				type: this.mapSwaggerTypeToJSType(fieldSchema.type),
				description: fieldSchema.description || '',
				example: fieldSchema.example,
				required: schema.required?.includes(fieldName) || false,
				maxLength: fieldSchema.maxLength,
				minLength: fieldSchema.minLength,
				format: fieldSchema.format,
				enum: fieldSchema.enum,
			};

			fields.push(fieldInfo);
		});

		return fields;
	}

	/**
	 * 스키마 참조를 해결합니다
	 * @param {Object} schema - 스키마 객체 (참조 포함 가능)
	 * @returns {Object} 해결된 스키마 객체
	 */
	resolveSchemaRef(schema) {
		if (!schema) return null;

		if (schema.$ref && this.apiDoc) {
			const refPath = schema.$ref.replace('#/', '').split('/');
			let resolved = this.apiDoc;

			try {
				for (const segment of refPath) {
					resolved = safeGet(resolved, segment, null);
					if (!resolved) {
						console.warn(
							`⚠️ 스키마 참조 해결 실패: ${schema.$ref}`
						);
						return null;
					}
				}
				return resolved;
			} catch (error) {
				console.warn(
					`⚠️ 스키마 참조 해결 중 오류: ${schema.$ref}`,
					error.message
				);
				return null;
			}
		}

		return schema;
	}

	/**
	 * Swagger 타입을 JavaScript 타입으로 매핑합니다
	 * @param {string} swaggerType - Swagger 타입
	 * @returns {string} JavaScript 타입
	 */
	mapSwaggerTypeToJSType(swaggerType) {
		const typeMap = {
			string: 'string',
			integer: 'number',
			number: 'number',
			boolean: 'boolean',
			array: 'array',
			object: 'object',
		};

		return safeGet(typeMap, swaggerType, 'string');
	}

	/**
	 * 필드를 폼 필드 타입으로 매핑합니다
	 * @param {Object} fieldInfo - 필드 정보
	 * @returns {string} 폼 필드 타입
	 */
	mapToFormFieldType(fieldInfo) {
		const fieldType = safeGet(fieldInfo, 'type', 'string');
		const fieldFormat = safeGet(fieldInfo, 'format', '');
		const fieldEnum = safeGet(fieldInfo, 'enum', null);

		if (fieldEnum) return 'select';
		if (fieldFormat === 'email') return 'email';
		if (fieldFormat === 'date') return 'date';
		if (fieldFormat === 'date-time') return 'datetime-local';
		if (fieldType === 'boolean') return 'checkbox';
		if (fieldType === 'number' || fieldType === 'integer') return 'number';
		if (fieldType === 'array') return 'multiselect';

		return 'text';
	}

	/**
	 * 필드를 검색 필드 타입으로 매핑합니다
	 * @param {Object} fieldSchema - 필드 스키마
	 * @returns {string} 검색 필드 타입
	 */
	mapToSearchFieldType(fieldSchema) {
		const fieldType = safeGet(fieldSchema, 'type', 'string');
		const fieldEnum = safeGet(fieldSchema, 'enum', null);

		if (fieldEnum) return 'select';
		if (fieldType === 'boolean') return 'select';
		if (fieldType === 'number' || fieldType === 'integer') return 'number';

		return 'text';
	}

	/**
	 * 시스템 필드인지 확인합니다
	 * @param {string} fieldName - 필드명
	 * @returns {boolean} 시스템 필드 여부
	 */
	isSystemField(fieldName) {
		const systemFields = [
			'createdAt',
			'updatedAt',
			'deletedAt',
			'createdBy',
			'updatedBy',
			'deletedBy',
			'version',
			'revision',
		];
		return systemFields.includes(fieldName);
	}

	/**
	 * 읽기 전용 필드인지 확인합니다
	 * @param {string} fieldName - 필드명
	 * @returns {boolean} 읽기 전용 필드 여부
	 */
	isReadOnlyField(fieldName) {
		const readOnlyFields = [
			'id',
			'createdAt',
			'updatedAt',
			'deletedAt',
			'createdBy',
			'updatedBy',
			'deletedBy',
		];
		return readOnlyFields.includes(fieldName);
	}

	/**
	 * 검색 가능한 필드인지 확인합니다
	 * @param {string} fieldName - 필드명
	 * @param {Object} fieldSchema - 필드 스키마
	 * @returns {boolean} 검색 가능 여부
	 */
	isSearchableField(fieldName, fieldSchema) {
		// 시스템 필드는 검색 불가
		if (this.isSystemField(fieldName)) return false;

		const fieldType = safeGet(fieldSchema, 'type', 'string');

		// 문자열, 숫자, enum 필드만 검색 가능
		return (
			fieldType === 'string' ||
			fieldType === 'number' ||
			fieldType === 'integer' ||
			safeGet(fieldSchema, 'enum', null) !== null
		);
	}

	/**
	 * 필드 라벨을 생성합니다
	 * @param {string} fieldName - 필드명
	 * @returns {string} 필드 라벨
	 */
	generateFieldLabel(fieldName) {
		const labelMap = {
			id: 'ID',
			name: '이름',
			title: '제목',
			description: '설명',
			status: '상태',
			type: '유형',
			code: '코드',
			email: '이메일',
			phone: '전화번호',
			address: '주소',
			createdAt: '생성일',
			updatedAt: '수정일',
		};

		return safeGet(labelMap, fieldName, fieldName);
	}

	/**
	 * 플레이스홀더를 생성합니다
	 * @param {string} fieldName - 필드명
	 * @param {Object} fieldInfo - 필드 정보
	 * @returns {string} 플레이스홀더
	 */
	generatePlaceholder(fieldName, fieldInfo = {}) {
		const label = this.generateFieldLabel(fieldName);
		return `${label}을(를) 입력하세요`;
	}

	/**
	 * 컬럼 크기를 결정합니다
	 * @param {string} fieldName - 필드명
	 * @param {Object} fieldInfo - 필드 정보
	 * @returns {number} 컬럼 크기
	 */
	getColumnSize(fieldName, fieldInfo = {}) {
		if (fieldName === 'id') return 80;
		if (fieldName.includes('date') || fieldName.includes('time'))
			return 150;
		if (fieldName === 'status' || fieldName === 'type') return 100;
		if (fieldName === 'code') return 120;

		const maxLength = safeGet(fieldInfo, 'maxLength', 0);
		if (maxLength > 0) {
			return Math.min(Math.max(maxLength * 8, 100), 300);
		}

		return 150;
	}

	/**
	 * 마스크가 필요한 필드인지 확인합니다
	 * @param {string} fieldName - 필드명
	 * @returns {boolean} 마스크 필요 여부
	 */
	needsMask(fieldName) {
		return (
			fieldName.includes('phone') ||
			fieldName.includes('tel') ||
			fieldName.includes('mobile')
		);
	}

	/**
	 * 필드에 맞는 마스크를 반환합니다
	 * @param {string} fieldName - 필드명
	 * @returns {string} 마스크 패턴
	 */
	getMask(fieldName) {
		if (
			fieldName.includes('phone') ||
			fieldName.includes('tel') ||
			fieldName.includes('mobile')
		) {
			return '000-0000-0000';
		}
		return '';
	}

	/**
	 * 분석 탭이 지원되는지 확인합니다
	 * @returns {boolean} 분석 탭 지원 여부
	 */
	isAnalyzeTabSupported() {
		// 현재는 분석 탭을 지원하지 않음
		return false;
	}

	/**
	 * 문자열의 첫 글자를 대문자로 변환합니다
	 * @param {string} str - 변환할 문자열
	 * @returns {string} 첫 글자가 대문자인 문자열
	 */
	capitalize(str) {
		if (!str) return '';
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * 스키마에서 컬럼을 생성합니다
	 */
	generateColumnsFromSchema(schema, type = 'single') {
		const columns = [];
		const properties = schema.properties || {};

		Object.entries(properties).forEach(([fieldName, fieldSchema]) => {
			if (this.isSystemField(fieldName) && fieldName !== 'id') return;

			const column = {
				accessorKey: fieldName,
				header: this.generateFieldLabel(fieldName),
				size: this.getColumnSize(fieldName, fieldSchema),
			};

			columns.push(column);
		});

		return columns;
	}

	/**
	 * 컬럼 크기를 결정합니다
	 * @param {string} fieldName - 필드명
	 * @param {Object} fieldInfo - 필드 정보 객체
	 * @returns {number} 컬럼 크기
	 */
	getColumnSize(fieldName, fieldInfo) {
		const sizeMap = {
			id: 80,
			code: 120,
			name: 150,
			date: 120,
			amount: 120,
			price: 100,
			quantity: 80,
			email: 200,
			phone: 130,
			tel: 130,
			address: 250,
			description: 200,
			memo: 200,
			remark: 200,
		};

		// 필드명 기반 크기 결정
		for (const [key, size] of Object.entries(sizeMap)) {
			if (fieldName.toLowerCase().includes(key)) {
				return size;
			}
		}

		// 타입 기반 크기 결정
		if (fieldInfo.type === 'number') return 100;
		if (fieldInfo.format === 'date' || fieldInfo.format === 'date-time')
			return 120;
		if (fieldInfo.format === 'email') return 200;

		// 최대 길이 기반 크기 결정
		if (fieldInfo.maxLength) {
			if (fieldInfo.maxLength <= 10) return 100;
			if (fieldInfo.maxLength <= 50) return 150;
			if (fieldInfo.maxLength <= 100) return 200;
			return 250;
		}

		return 150; // 기본값
	}

	/**
	 * 폼 필드 타입으로 매핑합니다
	 * @param {Object} fieldInfo - 필드 정보 객체
	 * @returns {string} 폼 필드 타입
	 */
	mapToFormFieldType(fieldInfo) {
		if (fieldInfo.enum) return 'select';
		if (fieldInfo.format === 'date') return 'date';
		if (fieldInfo.format === 'date-time') return 'datetime-local';
		if (fieldInfo.format === 'email') return 'email';
		if (fieldInfo.type === 'number') return 'number';
		if (
			fieldInfo.name &&
			(fieldInfo.name.includes('tel') || fieldInfo.name.includes('phone'))
		)
			return 'tel';
		if (fieldInfo.maxLength && fieldInfo.maxLength > 100) return 'textarea';

		return 'text';
	}

	/**
	 * 검색 필드 타입으로 매핑합니다
	 * @param {Object} fieldInfo - 필드 정보 객체
	 * @returns {string} 검색 필드 타입
	 */
	mapToSearchFieldType(fieldInfo) {
		if (fieldInfo.enum) return 'select';
		if (fieldInfo.format === 'date' || fieldInfo.format === 'date-time')
			return 'date';

		return 'text';
	}

	/**
	 * 필드 라벨을 생성합니다
	 */
	generateFieldLabel(fieldName) {
		const labelMap = {
			id: 'ID',
			code: '코드',
			name: '이름',
			date: '일자',
			vendorName: '업체명',
			orderCode: '주문코드',
			deliveryDate: '납기일자',
		};

		return labelMap[fieldName] || fieldName;
	}

	/**
	 * 플레이스홀더를 생성합니다
	 * @param {string} fieldName - 필드명
	 * @param {Object} fieldInfo - 필드 정보 객체 (선택사항)
	 * @returns {string} 플레이스홀더 텍스트
	 */
	generatePlaceholder(fieldName, fieldInfo = null) {
		// 예시값이 있으면 사용
		if (fieldInfo && fieldInfo.example) {
			return fieldInfo.example;
		}

		// 특정 필드에 대한 맞춤 플레이스홀더
		const placeholderMap = {
			email: 'example@company.com',
			phone: '010-0000-0000',
			tel: '02-0000-0000',
			fax: '02-0000-0000',
			licenseNo: '000-00-00000',
			businessNo: '000-00-00000',
			zipCode: '12345',
			date: 'YYYY-MM-DD',
		};

		// 필드명 기반 플레이스홀더
		for (const [key, placeholder] of Object.entries(placeholderMap)) {
			if (fieldName.toLowerCase().includes(key)) {
				return placeholder;
			}
		}

		const label = this.generateFieldLabel(fieldName);
		return `${label}을(를) 입력하세요`;
	}

	/**
	 * 시스템 필드인지 확인합니다
	 */
	isSystemField(fieldName) {
		const systemFields = [
			'tenantId',
			'isDelete',
			'createdBy',
			'createdAt',
			'updatedBy',
			'updatedAt',
			'page',
			'size',
		];
		return systemFields.includes(fieldName);
	}

	/**
	 * 읽기 전용 필드인지 확인합니다
	 */
	isReadOnlyField(fieldName) {
		const readOnlyFields = ['id', 'createdAt', 'updatedAt'];
		return readOnlyFields.includes(fieldName);
	}

	/**
	 * 검색 가능한 필드인지 확인합니다
	 */
	isSearchableField(fieldName, fieldSchema) {
		if (this.isSystemField(fieldName)) return false;
		if (fieldSchema.type === 'string') return true;
		if (fieldName.includes('name') || fieldName.includes('code'))
			return true;

		return false;
	}

	/**
	 * 분석 탭이 지원되는지 확인합니다
	 * @returns {boolean} 분석 탭 지원 여부
	 */
	isAnalyzeTabSupported() {
		// 현재는 분석 탭을 비활성화 (추후 구현 시 true로 변경)
		return false;
	}

	/**
	 * 마스크가 필요한 필드인지 확인합니다
	 */
	needsMask(fieldName) {
		return (
			fieldName.includes('phone') ||
			fieldName.includes('tel') ||
			fieldName.includes('license')
		);
	}

	/**
	 * 필드에 맞는 마스크를 가져옵니다
	 */
	getMask(fieldName) {
		if (fieldName.includes('phone') || fieldName.includes('tel')) {
			return '000-0000-0000';
		}
		if (fieldName.includes('license')) {
			return '000-00-00000';
		}
		return undefined;
	}

	/**
	 * Swagger 타입을 JavaScript 타입으로 매핑합니다
	 * @param {string} swaggerType - Swagger 타입
	 * @returns {string} JavaScript 타입
	 */
	mapSwaggerTypeToJSType(swaggerType) {
		const typeMap = {
			string: 'string',
			integer: 'number',
			number: 'number',
			boolean: 'boolean',
			array: 'array',
			object: 'object',
		};

		return typeMap[swaggerType] || 'string';
	}

	/**
	 * 분석 탭이 지원되는지 확인합니다 (템플릿 준비 상태 확인)
	 * @returns {boolean} 분석 탭 지원 여부
	 */
	isAnalyzeTabSupported() {
		// 현재는 분석 페이지 템플릿이 준비 중이므로 false 반환
		// 추후 분석 템플릿 PR이 머지되면 true로 변경
		return false;
	}

	/**
	 * 분석 탭을 생성합니다
	 * @param {Object} entity - 엔티티 객체
	 * @param {string} solution - 솔루션명
	 * @returns {Object|null} 분석 탭 객체 또는 null
	 */
	createAnalyzeTab(entity, solution) {
		if (!this.isAnalyzeTabSupported()) {
			return null;
		}

		const basePath = `/${solution}/${entity.name}`;
		const basePageName = this.generatePageName(entity.name, solution);
		const moduleName = this.generateModuleName(entity.name);

		return {
			id: 'analyze',
			name: '분석',
			type: 'singlePage',
			path: `${basePath}/analyze`,
			pageName: `${basePageName}AnalyzePage`,
			icon: 'ChartPie',
			default: false,
			columns: [],
			tableControl: {
				title: `${moduleName} 분석`,
				useEdit: false,
				useDelete: false,
				useExport: true,
			},
			searchOptions: {
				fields: [],
			},
			searchSlotFields: [],
			dataHook: `use${this.capitalize(entity.name)}Analytics`,
		};
	}

	/**
	 * 문자열 첫 글자를 대문자로 변환합니다
	 * @param {string} str - 변환할 문자열
	 * @returns {string} 첫 글자가 대문자인 문자열
	 */
	capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
